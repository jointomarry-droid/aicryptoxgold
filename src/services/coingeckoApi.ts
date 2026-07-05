import axios from 'axios';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface CoinMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    repos_url: { github: string[] };
  };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    ath: { usd: number };
    ath_change_percentage: { usd: number };
    atl: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
  };
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  categories: string[];
  image?: { small: string; medium: string; large: string };
}

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    score: number;
    data: {
      price: number;
      price_change_percentage_24h: { usd: number };
      market_cap: string;
      total_volume: string;
    };
  };
}

export interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

export interface FearGreedIndex {
  value: string;
  value_classification: string;
  timestamp: string;
}

export class CoinGeckoService {
  private static cache = new Map<string, { data: any; expiry: number }>();
  private static CACHE_TTL = 60000; // 1 minute

  private static getCache(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiry) return cached.data;
    return null;
  }

  private static setCache(key: string, data: any, ttl = this.CACHE_TTL) {
    this.cache.set(key, { data, expiry: Date.now() + ttl });
  }

  /**
   * Get top coins by market cap
   */
  static async getTopCoins(vsCurrency = 'usd', perPage = 20, page = 1): Promise<CoinGeckoPrice[]> {
    const cacheKey = `top_coins_${vsCurrency}_${perPage}_${page}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
        params: {
          vs_currency: vsCurrency,
          order: 'market_cap_desc',
          per_page: perPage,
          page,
          sparkline: false,
          price_change_percentage: '1h,24h,7d',
        },
        timeout: 10000,
      });
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error: any) {
      console.error('CoinGecko getTopCoins error:', error.message);
      return [];
    }
  }

  /**
   * Get prices for specific coin IDs
   */
  static async getPrice(ids: string[], vsCurrency = 'usd'): Promise<Record<string, { usd: number }>> {
    const cacheKey = `price_${ids.sort().join(',')}_${vsCurrency}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${COINGECKO_BASE}/simple/price`, {
        params: {
          ids: ids.join(','),
          vs_currencies: vsCurrency,
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true,
        },
        timeout: 10000,
      });
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error: any) {
      console.error('CoinGecko getPrice error:', error.message);
      return {};
    }
  }

  /**
   * Get coin market chart (price history)
   */
  static async getMarketChart(coinId: string, vsCurrency = 'usd', days = 1): Promise<CoinMarketChart | null> {
    const cacheKey = `chart_${coinId}_${vsCurrency}_${days}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${COINGECKO_BASE}/coins/${coinId}/market_chart`, {
        params: { vs_currency: vsCurrency, days },
        timeout: 10000,
      });
      this.setCache(cacheKey, response.data, 300000); // 5 min cache for charts
      return response.data;
    } catch (error: any) {
      console.error('CoinGecko getMarketChart error:', error.message);
      return null;
    }
  }

  /**
   * Get detailed coin info
   */
  static async getCoinDetail(coinId: string): Promise<CoinDetail | null> {
    const cacheKey = `detail_${coinId}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${COINGECKO_BASE}/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: true,
          developer_data: false,
          sparkline: false,
        },
        timeout: 10000,
      });
      this.setCache(cacheKey, response.data, 300000);
      return response.data;
    } catch (error: any) {
      console.error('CoinGecko getCoinDetail error:', error.message);
      return null;
    }
  }

  /**
   * Get trending coins
   */
  static async getTrending(): Promise<TrendingCoin[]> {
    const cacheKey = 'trending';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${COINGECKO_BASE}/search/trending`, { timeout: 10000 });
      this.setCache(cacheKey, response.data.coins, 300000);
      return response.data.coins || [];
    } catch (error: any) {
      console.error('CoinGecko getTrending error:', error.message);
      return [];
    }
  }

  /**
   * Get global crypto market data
   */
  static async getGlobalData(): Promise<GlobalData | null> {
    const cacheKey = 'global';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${COINGECKO_BASE}/global`, { timeout: 10000 });
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error: any) {
      console.error('CoinGecko getGlobalData error:', error.message);
      return null;
    }
  }

  /**
   * Search coins
   */
  static async search(query: string): Promise<any[]> {
    try {
      const response = await axios.get(`${COINGECKO_BASE}/search`, {
        params: { query },
        timeout: 10000,
      });
      return response.data.coins || [];
    } catch (error: any) {
      console.error('CoinGecko search error:', error.message);
      return [];
    }
  }

  /**
   * Get Fear & Greed Index
   */
  static async getFearGreedIndex(): Promise<FearGreedIndex | null> {
    const cacheKey = 'fear_greed';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get('https://api.alternative.me/fng/', { timeout: 10000 });
      const data = response.data?.data?.[0];
      if (data) {
        this.setCache(cacheKey, data, 600000); // 10 min cache
        return data;
      }
      return null;
    } catch (error: any) {
      console.error('Fear & Greed Index error:', error.message);
      return null;
    }
  }
}
