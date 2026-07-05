import axios from 'axios';

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_1h_in_currency?: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  last_updated: string;
}

export interface CoinChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface AiRecommendation {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  action: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  metrics: {
    priceChange24h: number;
    priceChange7d: number;
    priceChange30d: number;
    volumeToMcap: number;
    athDrop: number;
    momentumScore: number;
  };
  priceTarget: {
    current: number;
    conservative: number;
    optimistic: number;
    timeline: string;
  };
}

export interface MarketRecommendationData {
  fearGreedIndex: { value: number; classification: string };
  btcDominance: number;
  totalMarketCap: number;
  recommendations: AiRecommendation[];
  timestamp: string;
}

export class CoinGeckoClient {
  private static cache = new Map<string, { data: any; expiry: number }>();
  private static CACHE_TTL = 60000;

  private static getCache(key: string) {
    const c = this.cache.get(key);
    if (c && Date.now() < c.expiry) return c.data;
    return null;
  }

  private static setCache(key: string, data: any, ttl = this.CACHE_TTL) {
    this.cache.set(key, { data, expiry: Date.now() + ttl });
  }

  static async getTopCoins(perPage = 20, page = 1): Promise<CoinMarketData[]> {
    const cacheKey = `top_${perPage}_${page}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get('/api/coingecko/markets', {
        params: { vs_currency: 'usd', per_page: perPage, page },
      });
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('CoinGecko client: getTopCoins failed', error);
      return [];
    }
  }

  static async getCoinChart(coinId: string, days = 1): Promise<CoinChartData | null> {
    const cacheKey = `chart_${coinId}_${days}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`/api/coingecko/chart/${coinId}`, {
        params: { days },
      });
      this.setCache(cacheKey, response.data, 300000);
      return response.data;
    } catch (error) {
      console.error('CoinGecko client: getCoinChart failed', error);
      return null;
    }
  }

  static async getTrending(): Promise<any[]> {
    const cacheKey = 'trending';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get('/api/coingecko/trending');
      this.setCache(cacheKey, response.data?.coins || [], 300000);
      return response.data?.coins || [];
    } catch (error) {
      console.error('CoinGecko client: getTrending failed', error);
      return [];
    }
  }

  static async getGlobalData(): Promise<any> {
    const cacheKey = 'global';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get('/api/coingecko/global');
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('CoinGecko client: getGlobalData failed', error);
      return null;
    }
  }

  static async getFearGreedIndex(): Promise<{ value: number; classification: string }> {
    const cacheKey = 'fear_greed';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get('/api/coingecko/fear-greed');
      const data = { value: parseInt(response.data.value), classification: response.data.value_classification };
      this.setCache(cacheKey, data, 600000);
      return data;
    } catch (error) {
      return { value: 50, classification: 'Neutral' };
    }
  }

  static async getRecommendations(coinIds?: string[]): Promise<MarketRecommendationData | null> {
    const cacheKey = 'recommendations';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.post('/api/coingecko/recommendations', {
        coinIds: coinIds || ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano', 'dogecoin', 'polkadot'],
      });
      this.setCache(cacheKey, response.data, 300000);
      return response.data;
    } catch (error) {
      console.error('CoinGecko client: getRecommendations failed', error);
      return null;
    }
  }
}
