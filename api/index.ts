import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const cgCache = new Map<string, { data: any; expiry: number }>();
const CG_CACHE_TTL = 60000;

function getCgCache(key: string) {
  const c = cgCache.get(key);
  if (c && Date.now() < c.expiry) return c.data;
  return null;
}
function setCgCache(key: string, data: any, ttl = CG_CACHE_TTL) {
  cgCache.set(key, { data, expiry: Date.now() + ttl });
}

// ============ Sentiment ============
app.post("/api/sentiment", async (req, res) => {
  try {
    const asset = req.body.asset || 'cryptocurrency';
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });

    const prompt = `Analyze the current news and market sentiment for ${asset}. Return a JSON object with 'sentiment' (one of: 'Bullish', 'Bearish', 'Neutral'), 'score' (0-100), and 'summary' (2-3 sentences).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["sentiment", "score", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    res.json(JSON.parse(text));
  } catch (error: any) {
    const isCrypto = req.body.asset?.includes('crypto');
    res.json({
      sentiment: isCrypto ? 'Bullish' : 'Neutral',
      score: isCrypto ? 75 : 55,
      summary: `Due to rate limits, this is a simulated sentiment response. The ${req.body.asset || 'market'} shows signs of consolidation.`
    });
  }
});

// ============ Metals ============
const getMockMetalsData = () => ({
  success: true, base: "USD",
  rates: {
    "XAG": 0.035, "XAU": 0.0005, "XPD": 0.001, "XPT": 0.0011,
    "BTC": 0.000015, "ETH": 0.00032,
    "USDXAG": 28.5, "USDXAU": 2043.20, "USDXPD": 980.50, "USDXPT": 910.20,
    "USDBTC": 64500.00, "USDETH": 3200.00
  }
});

app.get("/api/metals", async (_req, res) => {
  try {
    const cacheKey = "metals";
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);

    const [goldRes, xausRes] = await Promise.allSettled([
      axios.get('https://www.goldapi.io/api/XAU/USD', { timeout: 8000 }),
      axios.get('https://xaus.com/api/v1/spot', { timeout: 8000 })
    ]);

    let rates: any = {};

    if (goldRes.status === 'fulfilled' && goldRes.value.data) {
      rates.USDXAU = goldRes.value.data.price || 2043.20;
      rates.XAU = 1 / rates.USDXAU;
    }
    if (xausRes.status === 'fulfilled' && xausRes.value.data) {
      const xaus = xausRes.value.data;
      if (xaus.spot_usd_oz) rates.USDXAU = xaus.spot_usd_oz;
      if (xaus.silver_usd_oz) { rates.USDXAG = xaus.silver_usd_oz; rates.XAG = 1 / rates.USDXAG; }
      if (xaus.xau) rates.XAU = 1 / xaus.spot_usd_oz;
    }

    if (!rates.USDXAU) rates.USDXAU = 2043.20;
    if (!rates.XAU) rates.XAU = 1 / rates.USDXAU;
    if (!rates.USDXAG) rates.USDXAG = 28.50;
    if (!rates.XAG) rates.XAG = 1 / rates.USDXAG;
    if (!rates.USDXPD) rates.USDXPD = 980.50;
    if (!rates.XPD) rates.XPD = 1 / rates.USDXPD;
    if (!rates.USDXPT) rates.USDXPT = 910.20;
    if (!rates.XPT) rates.XPT = 1 / rates.USDXPT;

    try {
      const cryptoRes = await axios.get(`${COINGECKO_BASE}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd`, { timeout: 5000 });
      if (cryptoRes.data.bitcoin) { rates.USDBTC = cryptoRes.data.bitcoin.usd; rates.BTC = 1 / rates.USDBTC; }
      if (cryptoRes.data.ethereum) { rates.USDETH = cryptoRes.data.ethereum.usd; rates.ETH = 1 / rates.USDETH; }
    } catch { if (!rates.USDBTC) { rates.USDBTC = 64500; rates.BTC = 1 / rates.USDBTC; rates.USDETH = 3200; rates.ETH = 1 / rates.USDETH; } }

    const data = { success: true, base: "USD", rates, timestamp: Date.now(), source: 'free-apis' };
    setCgCache(cacheKey, data, 600000);
    res.json(data);
  } catch { res.json(getMockMetalsData()); }
});

// ============ Binance ============
app.get("/api/binance/ticker", async (_req, res) => {
  try {
    const cached = getCgCache("binance_ticker");
    if (cached) return res.json(cached);
    const response = await axios.get("https://api.binance.com/api/v3/ticker/24hr", { timeout: 10000 });
    const usdtPairs = response.data
      .filter((t: any) => t.symbol.endsWith("USDT"))
      .map((t: any) => ({
        symbol: t.symbol.replace("USDT", ""),
        price: parseFloat(t.lastPrice),
        change: parseFloat(t.priceChangePercent),
        high: parseFloat(t.highPrice),
        low: parseFloat(t.lowPrice),
        volume: parseFloat(t.quoteVolume),
        trades: parseInt(t.count),
      }))
      .sort((a: any, b: any) => b.volume - a.volume)
      .slice(0, 50);
    setCgCache("binance_ticker", usdtPairs, 30000);
    res.json(usdtPairs);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch Binance data" }); }
});

app.get("/api/binance/klines/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = "1h", limit = "168" } = req.query;
    const cacheKey = `binance_klines_${symbol}_${interval}`;
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);
    const response = await axios.get("https://api.binance.com/api/v3/klines", {
      params: { symbol: `${symbol}USDT`, interval, limit: parseInt(limit as string) },
      timeout: 10000,
    });
    const klines = response.data.map((k: any) => ({
      time: k[0], open: parseFloat(k[1]), high: parseFloat(k[2]),
      low: parseFloat(k[3]), close: parseFloat(k[4]), volume: parseFloat(k[5]),
    }));
    setCgCache(cacheKey, klines, 60000);
    res.json(klines);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch klines" }); }
});

// ============ CryptoCompare ============
app.get("/api/cryptocompare/price", async (req, res) => {
  try {
    const { fsyms = "BTC,ETH", tsyms = "USD" } = req.query;
    const cacheKey = `cc_price_${fsyms}_${tsyms}`;
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);
    const apiKey = process.env.CRYPTOCOMPARE_API_KEY || "";
    const response = await axios.get("https://min-api.cryptocompare.com/data/pricemultifull", {
      params: { fsyms, tsyms, api_key: apiKey }, timeout: 10000,
    });
    setCgCache(cacheKey, response.data, 30000);
    res.json(response.data);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch CryptoCompare data" }); }
});

app.get("/api/cryptocompare/top/:limit", async (req, res) => {
  try {
    const { limit = "20" } = req.params;
    const cacheKey = `cc_top_${limit}`;
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);
    const apiKey = process.env.CRYPTOCOMPARE_API_KEY || "";
    const response = await axios.get("https://min-api.cryptocompare.com/data/top/mktcapfull", {
      params: { limit: parseInt(limit), tsym: "USD", api_key: apiKey }, timeout: 10000,
    });
    const coins = (response.data.Data || []).map((c: any) => ({
      name: c.CoinInfo?.Name, fullName: c.CoinInfo?.FullName,
      price: c.RAW?.USD?.PRICE, change24h: c.RAW?.USD?.CHANGE24HOURPCT,
      changeDay: c.RAW?.USD?.CHANGEDAY, marketCap: c.RAW?.USD?.MKTCAP,
      volume24h: c.RAW?.USD?.TOTALVOLUME24HTO, supply: c.RAW?.USD?.SUPPLY,
      open24h: c.RAW?.USD?.OPEN24H, high24h: c.RAW?.USD?.HIGH24H, low24h: c.RAW?.USD?.LOW24H,
    }));
    setCgCache(cacheKey, coins, 30000);
    res.json(coins);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch CryptoCompare top" }); }
});

app.get("/api/cryptocompare/news", async (_req, res) => {
  try {
    const cached = getCgCache("cc_news");
    if (cached) return res.json(cached);
    const apiKey = process.env.CRYPTOCOMPARE_API_KEY || "";
    const response = await axios.get("https://min-api.cryptocompare.com/data/v2/news/", {
      params: { lang: "EN", api_key: apiKey }, timeout: 10000,
    });
    const articles = (response.data.Data || []).slice(0, 15).map((a: any) => ({
      id: a.id, title: a.title, body: a.body, url: a.url, source: a.source,
      image: a.imageurl, categories: a.categories, publishedOn: a.published_on,
    }));
    setCgCache("cc_news", articles, 300000);
    res.json(articles);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch news" }); }
});

// ============ Coinbase ============
app.get("/api/coinbase/prices", async (_req, res) => {
  try {
    const cached = getCgCache("coinbase_prices");
    if (cached) return res.json(cached);
    const response = await axios.get("https://api.coinbase.com/v2/prices", { params: { currency: "USD" }, timeout: 10000 });
    const prices = (response.data.data || []).map((p: any) => ({ pair: p.base + "-" + p.currency, base: p.base, price: parseFloat(p.amount) }));
    setCgCache("coinbase_prices", prices, 30000);
    res.json(prices);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch Coinbase data" }); }
});

app.get("/api/coinbase/spot/:currency", async (req, res) => {
  try {
    const { currency } = req.params;
    const cached = getCgCache(`coinbase_spot_${currency}`);
    if (cached) return res.json(cached);
    const response = await axios.get(`https://api.coinbase.com/v2/prices/${currency}-USD/spot`, { timeout: 10000 });
    setCgCache(`coinbase_spot_${currency}`, response.data.data, 30000);
    res.json(response.data.data);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch spot price" }); }
});

// ============ CoinGecko ============
app.get("/api/coingecko/markets", async (req, res) => {
  try {
    const { vs_currency = "usd", per_page = "20", page = "1" } = req.query;
    const cacheKey = `markets_${vs_currency}_${per_page}_${page}`;
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);
    const response = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: { vs_currency, order: "market_cap_desc", per_page: parseInt(per_page as string), page: parseInt(page as string), sparkline: false, price_change_percentage: "1h,24h,7d" },
      timeout: 15000,
    });
    setCgCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch market data" }); }
});

app.get("/api/coingecko/price", async (req, res) => {
  try {
    const { ids, vs_currencies = "usd" } = req.query;
    if (!ids) return res.status(400).json({ error: "ids parameter required" });
    const cacheKey = `price_${ids}_${vs_currencies}`;
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);
    const response = await axios.get(`${COINGECKO_BASE}/simple/price`, {
      params: { ids, vs_currencies, include_market_cap: true, include_24hr_vol: true, include_24hr_change: true },
      timeout: 15000,
    });
    setCgCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch price data" }); }
});

app.get("/api/coingecko/coin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cached = getCgCache(`coin_${id}`);
    if (cached) return res.json(cached);
    const response = await axios.get(`${COINGECKO_BASE}/coins/${id}`, {
      params: { localization: false, tickers: false, market_data: true, community_data: true, developer_data: false, sparkline: false },
      timeout: 15000,
    });
    setCgCache(`coin_${id}`, response.data, 300000);
    res.json(response.data);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch coin details" }); }
});

app.get("/api/coingecko/chart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { vs_currency = "usd", days = "1" } = req.query;
    const cacheKey = `chart_${id}_${vs_currency}_${days}`;
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);
    const response = await axios.get(`${COINGECKO_BASE}/coins/${id}/market_chart`, {
      params: { vs_currency, days: parseInt(days as string) },
      timeout: 15000,
    });
    setCgCache(cacheKey, response.data, 300000);
    res.json(response.data);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch chart data" }); }
});

app.get("/api/coingecko/trending", async (_req, res) => {
  try {
    const cached = getCgCache("trending");
    if (cached) return res.json(cached);
    const response = await axios.get(`${COINGECKO_BASE}/search/trending`, { timeout: 15000 });
    setCgCache("trending", response.data, 300000);
    res.json(response.data);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch trending data" }); }
});

app.get("/api/coingecko/global", async (_req, res) => {
  try {
    const cached = getCgCache("global");
    if (cached) return res.json(cached);
    const response = await axios.get(`${COINGECKO_BASE}/global`, { timeout: 15000 });
    setCgCache("global", response.data);
    res.json(response.data);
  } catch (error: any) { res.status(500).json({ error: "Failed to fetch global data" }); }
});

app.get("/api/coingecko/fear-greed", async (_req, res) => {
  try {
    const cached = getCgCache("fear_greed");
    if (cached) return res.json(cached);
    const response = await axios.get("https://api.alternative.me/fng/", { timeout: 10000 });
    const data = response.data?.data?.[0] || { value: "50", value_classification: "Neutral" };
    setCgCache("fear_greed", data, 600000);
    res.json(data);
  } catch { res.json({ value: "50", value_classification: "Neutral" }); }
});

// ============ AI Recommendations ============
app.post("/api/coingecko/recommendations", async (req, res) => {
  try {
    const { coinIds = ["bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano", "dogecoin", "polkadot"] } = req.body;

    const [marketsRes, fearGreedRes, globalRes, binanceRes] = await Promise.allSettled([
      axios.get(`${COINGECKO_BASE}/coins/markets`, {
        params: { vs_currency: "usd", ids: coinIds.join(","), order: "market_cap_desc", sparkline: false, price_change_percentage: "1h,24h,7d,30d" },
        timeout: 15000,
      }),
      axios.get("https://api.alternative.me/fng/", { timeout: 10000 }),
      axios.get(`${COINGECKO_BASE}/global`, { timeout: 15000 }),
      axios.get("https://api.binance.com/api/v3/ticker/24hr", { timeout: 10000 }),
    ]);

    const coins = marketsRes.status === "fulfilled" ? marketsRes.value.data : [];
    const fearGreedData = fearGreedRes.status === "fulfilled" ? fearGreedRes.value.data?.data?.[0] : { value: "50", value_classification: "Neutral" };
    const globalData = globalRes.status === "fulfilled" ? globalRes.value.data?.data : {};
    const binanceTickers = binanceRes.status === "fulfilled" ? binanceRes.value.data : [];

    const binanceMap = new Map(
      binanceTickers.filter((t: any) => t.symbol.endsWith("USDT")).map((t: any) => [t.symbol.replace("USDT", "").toLowerCase(), t])
    );

    const fearGreed = fearGreedData || { value: "50", value_classification: "Neutral" };

    let recommendations = coins.map((coin: any) => {
      const bin: any = binanceMap.get(coin.symbol) || {};
      const change24h = coin.price_change_percentage_24h || 0;
      const change7d = coin.price_change_percentage_7d_in_currency || coin.price_change_percentage_24h || 0;
      const change30d = coin.price_change_percentage_30d_in_currency || change7d * 2.5;
      const volumeToMcap = coin.total_volume && coin.market_cap ? coin.total_volume / coin.market_cap : 0;
      const athDrop = coin.ath && coin.current_price ? ((coin.current_price - coin.ath) / coin.ath) * 100 : 0;

      const prices = [coin.current_price, bin.price].filter(Boolean);
      const priceVariance = prices.length > 1 ? Math.abs(prices[0] - prices[1]) / prices[0] * 100 : 0;
      const momentumScore = change24h * 0.4 + change7d * 0.3 + change30d * 0.15 + (volumeToMcap * 100) * 0.15;
      const volumeSurge = bin.quoteVolume ? bin.quoteVolume / (coin.market_cap || 1) : volumeToMcap;

      let action = "HOLD";
      let confidence = 50;
      if (momentumScore > 10) { action = "STRONG_BUY"; confidence = 88; }
      else if (momentumScore > 4) { action = "BUY"; confidence = 75; }
      else if (momentumScore > -4) { action = "HOLD"; confidence = 55; }
      else if (momentumScore > -10) { action = "SELL"; confidence = 70; }
      else { action = "STRONG_SELL"; confidence = 82; }

      if (prices.length > 1 && priceVariance < 0.5) confidence = Math.min(95, confidence + 5);
      if (volumeSurge > 0.1) confidence = Math.min(95, confidence + 3);

      const riskScore = Math.abs(change7d) * 0.3 + (volumeToMcap < 0.03 ? 3 : 0) + Math.abs(athDrop) * 0.01 + (priceVariance > 1 ? 2 : 0);
      let riskLevel = "LOW";
      if (riskScore > 8) riskLevel = "VERY_HIGH";
      else if (riskScore > 5) riskLevel = "HIGH";
      else if (riskScore > 2) riskLevel = "MEDIUM";

      return {
        coinId: coin.id, coinName: coin.name, coinSymbol: coin.symbol?.toUpperCase(), coinImage: coin.image,
        action, confidence, riskLevel,
        metrics: { priceChange24h: change24h, priceChange7d: change7d, priceChange30d: change30d, volumeToMcap, athDrop, momentumScore, priceVariance, volumeSurge },
        prices: { coingecko: coin.current_price, binance: bin.price || null, average: prices.reduce((a: number, b: any) => a + b, 0) / prices.length },
        priceTarget: { current: coin.current_price, conservative: coin.current_price * (1 + momentumScore * 0.004), moderate: coin.current_price * (1 + momentumScore * 0.008), optimistic: coin.current_price * (1 + momentumScore * 0.015), timeline: "30 days" },
        signals: {
          momentum: momentumScore > 5 ? "BULLISH" : momentumScore < -5 ? "BEARISH" : "NEUTRAL",
          volume: volumeSurge > 0.08 ? "HIGH" : volumeSurge > 0.03 ? "NORMAL" : "LOW",
          volatility: Math.abs(change7d) > 15 ? "HIGH" : Math.abs(change7d) > 5 ? "MEDIUM" : "LOW",
          sentiment: parseInt(fearGreed.value) > 60 ? "GREEDY" : parseInt(fearGreed.value) < 40 ? "FEARFUL" : "NEUTRAL",
        },
      };
    });

    recommendations.sort((a: any, b: any) => b.confidence - a.confidence);

    res.json({
      fearGreedIndex: { value: parseInt(fearGreed.value), classification: fearGreed.value_classification },
      btcDominance: globalData?.market_cap_percentage?.btc || 50,
      totalMarketCap: globalData?.total_market_cap?.usd || 2500000000000,
      totalVolume24h: globalData?.total_volume?.usd || 80000000000,
      recommendations,
      sources: { coingecko: true, binance: binanceTickers.length > 0 },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) { res.status(500).json({ error: "Failed to generate recommendations" }); }
});

export default app;