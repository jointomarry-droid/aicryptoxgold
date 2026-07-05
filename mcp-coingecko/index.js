#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";

const server = new McpServer({
  name: "coingecko-mcp",
  version: "1.0.0",
});

const CG_BASE = "https://api.coingecko.com/api/v3";
const cache = new Map();
const CACHE_TTL = 60000;

function getCached(key) {
  const c = cache.get(key);
  if (c && Date.now() < c.expiry) return c.data;
  return null;
}
function setCache(key, data, ttl = CACHE_TTL) {
  cache.set(key, { data, expiry: Date.now() + ttl });
}

// Tool: Get top cryptocurrencies by market cap
server.tool(
  "get_top_coins",
  "Get top cryptocurrencies by market cap from CoinGecko",
  {
    limit: { type: "number", description: "Number of coins (default: 20)", default: 20 },
    currency: { type: "string", description: "Currency for prices (default: usd)", default: "usd" },
  },
  async ({ limit = 20, currency = "usd" }) => {
    const cacheKey = `top_${limit}_${currency}`;
    const cached = getCached(cacheKey);
    if (cached) return { content: [{ type: "text", text: JSON.stringify(cached, null, 2) }] };

    try {
      const res = await axios.get(`${CG_BASE}/coins/markets`, {
        params: { vs_currency: currency, order: "market_cap_desc", per_page: limit, page: 1, sparkline: false, price_change_percentage: "1h,24h,7d" },
        timeout: 15000,
      });
      setCache(cacheKey, res.data);
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error fetching top coins: ${err.message}` }], isError: true };
    }
  }
);

// Tool: Get price for specific coins
server.tool(
  "get_coin_price",
  "Get current price for specific cryptocurrency coins",
  {
    ids: { type: "string", description: "Comma-separated coin IDs (e.g., bitcoin,ethereum,solana)" },
    currency: { type: "string", description: "Currency (default: usd)", default: "usd" },
  },
  async ({ ids, currency = "usd" }) => {
    try {
      const res = await axios.get(`${CG_BASE}/simple/price`, {
        params: { ids, vs_currencies: currency, include_market_cap: true, include_24hr_vol: true, include_24hr_change: true },
        timeout: 15000,
      });
      return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error fetching price: ${err.message}` }], isError: true };
    }
  }
);

// Tool: Get coin market chart (price history)
server.tool(
  "get_coin_chart",
  "Get historical price chart data for a coin",
  {
    coin_id: { type: "string", description: "Coin ID (e.g., bitcoin)" },
    days: { type: "number", description: "Number of days (1, 7, 30, 90, 365)", default: 7 },
    currency: { type: "string", description: "Currency (default: usd)", default: "usd" },
  },
  async ({ coin_id, days = 7, currency = "usd" }) => {
    try {
      const res = await axios.get(`${CG_BASE}/coins/${coin_id}/market_chart`, {
        params: { vs_currency: currency, days },
        timeout: 15000,
      });
      const summary = {
        coin: coin_id,
        days,
        dataPoints: res.data.prices?.length || 0,
        priceRange: {
          min: Math.min(...(res.data.prices || []).map(p => p[1])),
          max: Math.max(...(res.data.prices || []).map(p => p[1])),
        },
        latestPrice: res.data.prices?.[res.data.prices.length - 1]?.[1],
      };
      return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error fetching chart: ${err.message}` }], isError: true };
    }
  }
);

// Tool: Get coin details
server.tool(
  "get_coin_details",
  "Get detailed information about a specific cryptocurrency",
  {
    coin_id: { type: "string", description: "Coin ID (e.g., bitcoin)" },
  },
  async ({ coin_id }) => {
    try {
      const res = await axios.get(`${CG_BASE}/coins/${coin_id}`, {
        params: { localization: false, tickers: false, market_data: true, community_data: true, developer_data: false, sparkline: false },
        timeout: 15000,
      });
      const d = res.data;
      const detail = {
        id: d.id,
        name: d.name,
        symbol: d.symbol,
        description: d.description?.en?.substring(0, 300),
        marketData: {
          currentPrice: d.market_data?.current_price?.usd,
          marketCap: d.market_data?.market_cap?.usd,
          totalVolume: d.market_data?.total_volume?.usd,
          high24h: d.market_data?.high_24h?.usd,
          low24h: d.market_data?.low_24h?.usd,
          priceChange24h: d.market_data?.price_change_percentage_24h,
          priceChange7d: d.market_data?.price_change_percentage_7d,
          priceChange30d: d.market_data?.price_change_percentage_30d,
          ath: d.market_data?.ath?.usd,
          athChange: d.market_data?.ath_change_percentage?.usd,
          circulatingSupply: d.market_data?.circulating_supply,
          totalSupply: d.market_data?.total_supply,
          maxSupply: d.market_data?.max_supply,
        },
        sentiment: {
          up: d.sentiment_votes_up_percentage,
          down: d.sentiment_votes_down_percentage,
        },
        categories: d.categories?.filter(Boolean),
      };
      return { content: [{ type: "text", text: JSON.stringify(detail, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error fetching coin details: ${err.message}` }], isError: true };
    }
  }
);

// Tool: Get trending coins
server.tool(
  "get_trending",
  "Get currently trending cryptocurrencies on CoinGecko",
  {},
  async () => {
    try {
      const res = await axios.get(`${CG_BASE}/search/trending`, { timeout: 15000 });
      const trending = (res.data.coins || []).map(c => ({
        name: c.item.name,
        symbol: c.item.symbol,
        rank: c.item.market_cap_rank,
        price: c.item.data?.price,
        change24h: c.item.data?.price_change_percentage_24h?.usd,
        volume: c.item.data?.total_volume,
      }));
      return { content: [{ type: "text", text: JSON.stringify(trending, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error fetching trending: ${err.message}` }], isError: true };
    }
  }
);

// Tool: Get global crypto market data
server.tool(
  "get_global_market",
  "Get global cryptocurrency market statistics",
  {},
  async () => {
    try {
      const res = await axios.get(`${CG_BASE}/global`, { timeout: 15000 });
      const g = res.data?.data;
      const global = {
        totalCryptos: g?.active_cryptocurrencies,
        totalMarkets: g?.markets,
        totalMarketCap: g?.total_market_cap?.usd,
        totalVolume24h: g?.total_volume?.usd,
        btcDominance: g?.market_cap_percentage?.btc,
        ethDominance: g?.market_cap_percentage?.eth,
        marketCapChange24h: g?.market_cap_change_percentage_24h_usd,
      };
      return { content: [{ type: "text", text: JSON.stringify(global, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error fetching global data: ${err.message}` }], isError: true };
    }
  }
);

// Tool: Get Fear & Greed Index
server.tool(
  "get_fear_greed",
  "Get the Crypto Fear & Greed Index",
  {},
  async () => {
    try {
      const res = await axios.get("https://api.alternative.me/fng/", { timeout: 10000 });
      const data = res.data?.data?.[0];
      return { content: [{ type: "text", text: JSON.stringify({ value: parseInt(data?.value || "50"), classification: data?.value_classification || "Neutral", timestamp: data?.timestamp }, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// Tool: Get Binance 24h ticker
server.tool(
  "get_binance_ticker",
  "Get 24h price ticker from Binance for all USDT pairs",
  {
    limit: { type: "number", description: "Number of top pairs by volume (default: 20)", default: 20 },
  },
  async ({ limit = 20 }) => {
    const cacheKey = `binance_${limit}`;
    const cached = getCached(cacheKey);
    if (cached) return { content: [{ type: "text", text: JSON.stringify(cached, null, 2) }] };

    try {
      const res = await axios.get("https://api.binance.com/api/v3/ticker/24hr", { timeout: 15000 });
      const tickers = res.data
        .filter(t => t.symbol.endsWith("USDT"))
        .map(t => ({
          symbol: t.symbol.replace("USDT", ""),
          price: parseFloat(t.lastPrice),
          change: parseFloat(t.priceChangePercent),
          high: parseFloat(t.highPrice),
          low: parseFloat(t.lowPrice),
          volume: parseFloat(t.quoteVolume),
          trades: parseInt(t.count),
        }))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, limit);
      setCache(cacheKey, tickers, 30000);
      return { content: [{ type: "text", text: JSON.stringify(tickers, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// Tool: Get crypto news
server.tool(
  "get_crypto_news",
  "Get latest cryptocurrency news from CryptoCompare",
  {
    limit: { type: "number", description: "Number of articles (default: 10)", default: 10 },
  },
  async ({ limit = 10 }) => {
    try {
      const res = await axios.get("https://min-api.cryptocompare.com/data/v2/news/", {
        params: { lang: "EN" },
        timeout: 15000,
      });
      const articles = (res.data.Data || []).slice(0, limit).map(a => ({
        title: a.title,
        source: a.source,
        url: a.url,
        categories: a.categories,
        publishedOn: new Date(a.published_on * 1000).toISOString(),
      }));
      return { content: [{ type: "text", text: JSON.stringify(articles, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// Tool: Multi-source price comparison
server.tool(
  "compare_prices",
  "Compare crypto prices across CoinGecko and Binance for arbitrage detection",
  {
    coin_id: { type: "string", description: "Coin ID (e.g., bitcoin)" },
    symbol: { type: "string", description: "Binance symbol (e.g., BTC)" },
  },
  async ({ coin_id, symbol }) => {
    try {
      const [cgRes, binRes] = await Promise.all([
        axios.get(`${CG_BASE}/simple/price`, { params: { ids: coin_id, vs_currencies: "usd" }, timeout: 10000 }),
        axios.get(`https://api.binance.com/api/v3/ticker/price`, { params: { symbol: `${symbol}USDT` }, timeout: 10000 }),
      ]);
      const cgPrice = cgRes.data?.[coin_id]?.usd;
      const binPrice = parseFloat(binRes.data?.price);
      const diff = cgPrice && binPrice ? ((binPrice - cgPrice) / cgPrice * 100) : 0;

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            coin: coin_id,
            symbol,
            coingecko: cgPrice,
            binance: binPrice,
            difference: `${diff.toFixed(3)}%`,
            arbitrage: Math.abs(diff) > 0.5 ? "Possible arbitrage opportunity" : "Prices aligned",
          }, null, 2),
        }],
      };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CoinGecko MCP Server running on stdio");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
