import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

let yahooFinance: any = null;
async function getYahooFinance() {
  if (!yahooFinance) {
    const YahooFinance = (await import('yahoo-finance2')).default;
    yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
  }
  return yahooFinance;
}
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

// ============ Metals (Multi-source free APIs) ============
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

    // Use yahoo-finance2 for metals + crypto (free, no API key, reliable)
    const metalSymbols = ['GC=F', 'SI=F', 'PL=F', 'PA=F']; // Gold, Silver, Platinum, Palladium
    const cryptoSymbols = ['BTC-USD', 'ETH-USD'];

    let metalQuotes: any[] = [];
    let cryptoQuotes: any[] = [];

    try {
      const yf = await getYahooFinance();
      const [mRes, cRes] = await Promise.allSettled([
        Promise.all(metalSymbols.map(s => yf.quote(s))),
        Promise.all(cryptoSymbols.map(s => yf.quote(s)))
      ]);
      if (mRes.status === 'fulfilled') metalQuotes = mRes.value;
      if (cRes.status === 'fulfilled') cryptoQuotes = cRes.value;
    } catch (e) {
      console.error("Yahoo Finance failed:", e);
    }

    let rates: any = {};

    // Parse metals from yahoo-finance2
    if (metalQuotes.length >= 4) {
      const [gold, silver, platinum, palladium] = metalQuotes;
      if (gold) { rates.USDXAU = gold.regularMarketPrice; rates.XAU = 1 / rates.USDXAU; }
      if (silver) { rates.USDXAG = silver.regularMarketPrice; rates.XAG = 1 / rates.USDXAG; }
      if (platinum) { rates.USDXPT = platinum.regularMarketPrice; rates.XPT = 1 / rates.USDXPT; }
      if (palladium) { rates.USDXPD = palladium.regularMarketPrice; rates.XPD = 1 / rates.USDXPD; }
    }

    // Parse crypto from yahoo-finance2
    if (cryptoQuotes.length >= 2) {
      const [btc, eth] = cryptoQuotes;
      if (btc) { rates.USDBTC = btc.regularMarketPrice; rates.BTC = 1 / rates.USDBTC; }
      if (eth) { rates.USDETH = eth.regularMarketPrice; rates.ETH = 1 / rates.USDETH; }
    }

    // Fallback: Binance for crypto if yahoo fails
    if (!rates.USDBTC) {
      try {
        const btcRes = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', { timeout: 5000 });
        rates.USDBTC = parseFloat(btcRes.data.price);
        rates.BTC = 1 / rates.USDBTC;
      } catch {}
    }
    if (!rates.USDETH) {
      try {
        const ethRes = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT', { timeout: 5000 });
        rates.USDETH = parseFloat(ethRes.data.price);
        rates.ETH = 1 / rates.USDETH;
      } catch {}
    }

    // Defaults if everything fails
    if (!rates.USDXAU) rates.USDXAU = 2350;
    if (!rates.XAU) rates.XAU = 1 / rates.USDXAU;
    if (!rates.USDXAG) rates.USDXAG = 29;
    if (!rates.XAG) rates.XAG = 1 / rates.USDXAG;
    if (!rates.USDXPD) rates.USDXPD = 980;
    if (!rates.XPD) rates.XPD = 1 / rates.USDXPD;
    if (!rates.USDXPT) rates.USDXPT = 910;
    if (!rates.XPT) rates.XPT = 1 / rates.USDXPT;
    if (!rates.USDBTC) rates.USDBTC = 67000;
    if (!rates.BTC) rates.BTC = 1 / rates.USDBTC;
    if (!rates.USDETH) rates.USDETH = 3500;
    if (!rates.ETH) rates.ETH = 1 / rates.USDETH;

    const data = { success: true, base: "USD", rates, timestamp: Date.now(), source: 'multi-source' };
    setCgCache(cacheKey, data, 30000);
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

// ============ ADVANCED AI FEATURES (Global First) ============

// 1. AI Market Oracle - Gemini-powered predictive analysis
app.post("/api/ai/oracle", async (req, res) => {
  try {
    const { asset = "bitcoin", timeframe = "7d" } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

    // Fetch real market data first
    const [marketRes, fearGreedRes] = await Promise.allSettled([
      axios.get(`${COINGECKO_BASE}/coins/${asset}?localization=false&tickers=false&market_data=true&community_data=true&sparkline=false`, { timeout: 10000 }),
      axios.get("https://api.alternative.me/fng/", { timeout: 5000 })
    ]);

    const coinData = marketRes.status === "fulfilled" ? marketRes.value.data : null;
    const fearGreed = fearGreedRes.status === "fulfilled" ? fearGreedRes.value.data?.data?.[0] : { value: "50" };

    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });

    const prompt = `You are an elite financial analyst AI. Analyze ${asset} with this real-time data:
Price: $${coinData?.market_data?.current_price?.usd || 'N/A'}
24h Change: ${coinData?.market_data?.price_change_percentage_24h || 'N/A'}%
7d Change: ${coinData?.market_data?.price_change_percentage_7d || 'N/A'}%
Market Cap: $${coinData?.market_data?.market_cap?.usd || 'N/A'}
Volume 24h: $${coinData?.market_data?.total_volume?.usd || 'N/A'}
ATH: $${coinData?.market_data?.ath?.usd || 'N/A'}
Fear/Greed Index: ${fearGreed?.value || 50}
Timeframe: ${timeframe}

Provide a comprehensive analysis with:
1. price_prediction (object with conservative, moderate, aggressive prices)
2. confidence_score (0-100)
3. risk_assessment (LOW/MEDIUM/HIGH/VERY_HIGH)
4. key_levels (support and resistance)
5. trading_strategy (detailed recommendation)
6. catalysts (array of potential price movers)
7. probability_analysis (bull/bear/neutral probabilities)
8. news_summary (recent relevant developments)`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price_prediction: { type: Type.OBJECT, properties: { conservative: { type: Type.NUMBER }, moderate: { type: Type.NUMBER }, aggressive: { type: Type.NUMBER } } },
            confidence_score: { type: Type.NUMBER },
            risk_assessment: { type: Type.STRING },
            key_levels: { type: Type.OBJECT, properties: { support: { type: Type.ARRAY, items: { type: Type.NUMBER } }, resistance: { type: Type.ARRAY, items: { type: Type.NUMBER } } } },
            trading_strategy: { type: Type.STRING },
            catalysts: { type: Type.ARRAY, items: { type: Type.STRING } },
            probability_analysis: { type: Type.OBJECT, properties: { bull: { type: Type.NUMBER }, bear: { type: Type.NUMBER }, neutral: { type: Type.NUMBER } } },
            news_summary: { type: Type.STRING }
          },
          required: ["price_prediction", "confidence_score", "risk_assessment", "trading_strategy"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    res.json({ ...JSON.parse(text), asset, timeframe, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error("AI Oracle error:", error.message);
    res.json({
      price_prediction: { conservative: 0, moderate: 0, aggressive: 0 },
      confidence_score: 50,
      risk_assessment: "MEDIUM",
      key_levels: { support: [], resistance: [] },
      trading_strategy: "Unable to generate prediction at this time. Please try again later.",
      catalysts: [],
      probability_analysis: { bull: 33, bear: 33, neutral: 34 },
      news_summary: "Analysis temporarily unavailable.",
      error: true
    });
  }
});

// 2. Cross-Exchange Arbitrage Scanner
app.get("/api/arbitrage/scanner", async (_req, res) => {
  try {
    const cacheKey = "arbitrage";
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);

    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT'];
    const exchanges = [
      { name: 'Binance', fetch: async (s: string) => { const r = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${s}`, { timeout: 5000 }); return parseFloat(r.data.price); } },
      { name: 'Coinbase', fetch: async (s: string) => { const r = await axios.get(`https://api.coinbase.com/v2/prices/${s.replace('USDT', '-USD')}/spot`, { timeout: 5000 }); return parseFloat(r.data.data.amount); } },
    ];

    const opportunities = [];
    for (const symbol of symbols) {
      const prices: Record<string, number> = {};
      const results = await Promise.allSettled(exchanges.map(ex => ex.fetch(symbol)));
      results.forEach((r, i) => { if (r.status === 'fulfilled') prices[exchanges[i].name] = r.value as number; });

      const exchangeNames = Object.keys(prices);
      if (exchangeNames.length >= 2) {
        const low = Math.min(...Object.values(prices));
        const high = Math.max(...Object.values(prices));
        const spread = ((high - low) / low) * 100;
        const buyExchange = exchangeNames.find(e => prices[e] === low) || '';
        const sellExchange = exchangeNames.find(e => prices[e] === high) || '';

        opportunities.push({
          symbol: symbol.replace('USDT', ''),
          prices,
          spread: spread.toFixed(3),
          profitPer1000: ((1000 / low) * high - 1000).toFixed(2),
          buyOn: buyExchange,
          sellOn: sellExchange,
          action: spread > 0.1 ? 'OPPORTUNITY' : 'NO_ARB'
        });
      }
    }

    opportunities.sort((a: any, b: any) => parseFloat(b.spread) - parseFloat(a.spread));
    const data = { opportunities, timestamp: new Date().toISOString() };
    setCgCache(cacheKey, data, 15000);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Arbitrage scanner failed" });
  }
});

// 3. AI Portfolio Optimizer
app.post("/api/ai/portfolio/optimize", async (req, res) => {
  try {
    const { portfolio, riskTolerance = "moderate" } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

    // Fetch current prices
    const ids = portfolio?.map((p: any) => p.coinId).join(',') || 'bitcoin,ethereum,solana';
    const marketRes = await axios.get(`${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${ids}&sparkline=false`, { timeout: 10000 });
    const coins = marketRes.data;

    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });

    const prompt = `Optimize this crypto portfolio with risk tolerance: ${riskTolerance}
Current holdings: ${JSON.stringify(portfolio)}
Live prices: ${JSON.stringify(coins.map((c: any) => ({ id: c.id, price: c.current_price, change24h: c.price_change_percentage_24h, change7d: c.price_change_percentage_7d_in_currency })))}

Provide:
1. optimized_allocation (percentage for each asset)
2. expected_return (monthly estimate)
3. risk_score (1-10)
4. rebalance_actions (specific buy/sell orders)
5. diversification_score (0-100)
6. sharpe_ratio_estimate
7. max_drawdown_estimate
8. reasoning (detailed explanation)`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimized_allocation: { type: Type.OBJECT },
            expected_return: { type: Type.STRING },
            risk_score: { type: Type.NUMBER },
            rebalance_actions: { type: Type.ARRAY, items: { type: Type.OBJECT } },
            diversification_score: { type: Type.NUMBER },
            sharpe_ratio_estimate: { type: Type.NUMBER },
            max_drawdown_estimate: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["optimized_allocation", "expected_return", "risk_score", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    res.json({ ...JSON.parse(text), riskTolerance, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error("Portfolio optimizer error:", error.message);
    res.status(500).json({ error: "Optimization failed" });
  }
});

// 4. Market Crash Predictor
app.get("/api/ai/crash-predictor", async (_req, res) => {
  try {
    const cacheKey = "crash_predictor";
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);

    const [btcRes, fearGreedRes, globalRes] = await Promise.allSettled([
      axios.get(`${COINGECKO_BASE}/coins/bitcoin?localization=false&tickers=false&market_data=true&sparkline=false`, { timeout: 10000 }),
      axios.get("https://api.alternative.me/fng/", { timeout: 5000 }),
      axios.get(`${COINGECKO_BASE}/global`, { timeout: 10000 })
    ]);

    const btc = btcRes.status === "fulfilled" ? btcRes.value.data?.market_data : {};
    const fearGreed = fearGreedRes.status === "fulfilled" ? fearGreedRes.value.data?.data?.[0] : { value: "50" };
    const global = globalRes.status === "fulfilled" ? globalRes.value.data?.data : {};

    // Analyze crash indicators
    const indicators = {
      fearGreedExtreme: parseInt(fearGreed.value) > 80 || parseInt(fearGreed.value) < 20,
      highVolatility: Math.abs(btc.price_change_percentage_7d || 0) > 15,
      volumeSpike: btc.total_volume && btc.market_cap && (btc.total_volume / btc.market_cap) > 0.15,
      ATHDistance: btc.ath && btc.current_price ? ((btc.current_price - btc.ath) / btc.ath * 100) : 0,
      btcDominance: global?.market_cap_percentage?.btc || 50,
      marketCapDrop: global?.market_cap_change_24h || 0,
    };

    let riskScore = 0;
    if (indicators.fearGreedExtreme) riskScore += 25;
    if (indicators.highVolatility) riskScore += 20;
    if (indicators.volumeSpike) riskScore += 15;
    if (indicators.ATHDistance < -30) riskScore += 20;
    if (indicators.btcDominance < 40) riskScore += 10;
    if (indicators.marketCapDrop < -5) riskScore += 10;

    const riskLevel = riskScore > 60 ? "EXTREME" : riskScore > 40 ? "HIGH" : riskScore > 20 ? "MODERATE" : "LOW";
    const prediction = riskScore > 60 ? "Significant correction likely within 48-72 hours" :
      riskScore > 40 ? "Elevated risk of pullback in next 1-2 weeks" :
      riskScore > 20 ? "Market showing some stress, monitor closely" :
      "Market conditions appear stable";

    const data = {
      riskScore,
      riskLevel,
      prediction,
      indicators,
      fearGreedIndex: parseInt(fearGreed.value),
      btcPrice: btc.current_price,
      btcChange7d: btc.price_change_percentage_7d,
      recommendations: riskScore > 40 ? ["Consider reducing exposure", "Set stop-losses", "Avoid leveraged positions"] : ["Market conditions favorable", "Dollar-cost averaging recommended"],
      timestamp: new Date().toISOString()
    };

    setCgCache(cacheKey, data, 300000);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Crash predictor failed" });
  }
});

// 5. Sentiment Heatmap
app.get("/api/sentiment/heatmap", async (_req, res) => {
  try {
    const cacheKey = "sentiment_heatmap";
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);

    const assets = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano', 'dogecoin', 'polkadot', 'avalanche-2', 'chainlink'];
    const marketRes = await axios.get(`${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${assets.join(',')}&sparkline=false&price_change_percentage=1h,24h,7d`, { timeout: 15000 });

    const heatmap = marketRes.data.map((coin: any) => {
      const change1h = coin.price_change_percentage_1h_in_currency || 0;
      const change24h = coin.price_change_percentage_24h || 0;
      const change7d = coin.price_change_percentage_7d_in_currency || 0;
      const volumeRatio = coin.total_volume && coin.market_cap ? coin.total_volume / coin.market_cap : 0;

      // Composite sentiment score
      const momentumScore = (change1h * 0.2 + change24h * 0.5 + change7d * 0.3);
      const sentiment = momentumScore > 5 ? "BULLISH" : momentumScore < -5 ? "BEARISH" : "NEUTRAL";
      const intensity = Math.min(100, Math.abs(momentumScore) * 5 + volumeRatio * 100);

      return {
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        price: coin.current_price,
        change1h, change24h, change7d,
        sentiment,
        intensity: Math.round(intensity),
        volumeRatio: (volumeRatio * 100).toFixed(1),
        marketCap: coin.market_cap
      };
    });

    const data = { assets: heatmap, timestamp: new Date().toISOString() };
    setCgCache(cacheKey, data, 60000);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Sentiment heatmap failed" });
  }
});

// 6. Multi-Asset Correlation Matrix
app.get("/api/correlation/matrix", async (_req, res) => {
  try {
    const cacheKey = "correlation";
    const cached = getCgCache(cacheKey);
    if (cached) return res.json(cached);

    const assets = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple'];
    const charts = await Promise.allSettled(
      assets.map(id => axios.get(`${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=30`, { timeout: 15000 }))
    );

    const priceSeries: Record<string, number[]> = {};
    charts.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        priceSeries[assets[i]] = r.value.data.prices.map((p: [number, number]) => p[1]);
      }
    });

    // Calculate correlation matrix
    const calculateCorrelation = (a: number[], b: number[]) => {
      const n = Math.min(a.length, b.length);
      const aSlice = a.slice(0, n);
      const bSlice = b.slice(0, n);
      const meanA = aSlice.reduce((s, v) => s + v, 0) / n;
      const meanB = bSlice.reduce((s, v) => s + v, 0) / n;
      let num = 0, denA = 0, denB = 0;
      for (let i = 0; i < n; i++) {
        const dA = aSlice[i] - meanA;
        const dB = bSlice[i] - meanB;
        num += dA * dB;
        denA += dA * dA;
        denB += dB * dB;
      }
      return denA && denB ? num / Math.sqrt(denA * denB) : 0;
    };

    const matrix: Record<string, Record<string, number>> = {};
    for (const a of assets) {
      matrix[a] = {};
      for (const b of assets) {
        matrix[a][b] = a === b ? 1 : calculateCorrelation(priceSeries[a] || [], priceSeries[b] || []);
      }
    }

    const data = { matrix, assets, timestamp: new Date().toISOString() };
    setCgCache(cacheKey, data, 600000);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Correlation matrix failed" });
  }
});

// 7. AI Trading Signals (Real-time)
app.post("/api/ai/trading-signals", async (req, res) => {
  try {
    const { asset = "bitcoin" } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

    const [chartRes, tickerRes] = await Promise.allSettled([
      axios.get(`${COINGECKO_BASE}/coins/${asset}/market_chart?vs_currency=usd&days=7`, { timeout: 10000 }),
      axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${asset.toUpperCase()}USDT`, { timeout: 5000 })
    ]);

    const prices = chartRes.status === "fulfilled" ? chartRes.value.data.prices.map((p: [number, number]) => p[1]) : [];
    const ticker = tickerRes.status === "fulfilled" ? tickerRes.value.data : {};

    // Calculate technical indicators
    const sma20 = prices.slice(-20).reduce((a: number, b: number) => a + b, 0) / 20;
    const sma50 = prices.slice(-50).reduce((a: number, b: number) => a + b, 0) / Math.min(50, prices.length);
    const currentPrice = prices[prices.length - 1] || 0;
    const rsi = prices.length > 14 ? calculateRSI(prices.slice(-14)) : 50;

    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });

    const prompt = `Generate trading signals for ${asset} with:
Current Price: $${currentPrice}
24h Change: ${ticker.priceChangePercent || 'N/A'}%
SMA20: $${sma20.toFixed(2)}
SMA50: $${sma50.toFixed(2)}
RSI(14): ${rsi.toFixed(2)}
Volume: ${ticker.quoteVolume || 'N/A'}

Provide JSON with:
1. signal (STRONG_BUY/BUY/SELL/STRONG_SELL/HOLD)
2. entry_price, stop_loss, take_profit_1, take_profit_2
3. risk_reward_ratio
4. timeframe (recommended holding period)
5. indicators (RSI signal, MACD signal, trend direction)
6. confidence (0-100)
7. reasoning`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: { type: Type.STRING },
            entry_price: { type: Type.NUMBER },
            stop_loss: { type: Type.NUMBER },
            take_profit_1: { type: Type.NUMBER },
            take_profit_2: { type: Type.NUMBER },
            risk_reward_ratio: { type: Type.NUMBER },
            timeframe: { type: Type.STRING },
            indicators: { type: Type.OBJECT },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["signal", "entry_price", "confidence", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    res.json({ ...JSON.parse(text), asset, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error("Trading signals error:", error.message);
    res.status(500).json({ error: "Signal generation failed" });
  }
});

function calculateRSI(prices: number[]): number {
  let gains = 0, losses = 0;
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / prices.length;
  const avgLoss = losses / prices.length;
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export default app;