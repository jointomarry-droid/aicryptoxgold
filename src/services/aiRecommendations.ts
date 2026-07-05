import { CoinGeckoService, CoinGeckoPrice, CoinDetail, TrendingCoin } from './coingeckoApi';
import axios from 'axios';

export interface AiRecommendation {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  action: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  signals: Signal[];
  aiAnalysis: string;
  priceTarget: {
    current: number;
    conservative: number;
    optimistic: number;
    timeline: string;
  };
  metrics: CoinMetrics;
  timestamp: string;
}

export interface Signal {
  name: string;
  type: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  strength: number;
  description: string;
}

export interface CoinMetrics {
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  volatility: number;
  volumeToMcap: number;
  athDrop: number;
  sentimentScore: number;
  momentumScore: number;
}

export interface MarketAnalysis {
  fearGreedIndex: { value: number; classification: string };
  marketTrend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  btcDominance: number;
  totalMarketCap: number;
  recommendations: AiRecommendation[];
  trendingCoins: TrendingCoin[];
  marketSummary: string;
  timestamp: string;
}

export class AiRecommendationEngine {
  /**
   * Analyze a single coin and generate a recommendation
   */
  static async analyzeCoin(coinId: string): Promise<AiRecommendation | null> {
    try {
      const [detail, chart] = await Promise.all([
        CoinGeckoService.getCoinDetail(coinId),
        CoinGeckoService.getMarketChart(coinId, 'usd', 30),
      ]);

      if (!detail) return null;

      const md = detail.market_data;
      const signals = this.generateSignals(detail, chart);
      const metrics = this.calculateMetrics(detail, signals);
      const action = this.determineAction(metrics);
      const confidence = this.calculateConfidence(metrics);
      const riskLevel = this.assessRisk(metrics);
      const priceTarget = this.calculatePriceTarget(detail, metrics);
      const aiAnalysis = this.generateAnalysis(detail, signals, metrics, action);

      return {
        id: `rec_${coinId}_${Date.now()}`,
        coinId: detail.id,
        coinName: detail.name,
        coinSymbol: detail.symbol.toUpperCase(),
        coinImage: detail.image?.large || '',
        action,
        confidence,
        riskLevel,
        signals,
        aiAnalysis,
        priceTarget,
        metrics,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error(`Error analyzing ${coinId}:`, error.message);
      return null;
    }
  }

  /**
   * Generate full market analysis with multiple coin recommendations
   */
  static async generateMarketAnalysis(): Promise<MarketAnalysis | null> {
    try {
      const [globalData, fearGreed, topCoins, trending] = await Promise.all([
        CoinGeckoService.getGlobalData(),
        CoinGeckoService.getFearGreedIndex(),
        CoinGeckoService.getTopCoins('usd', 15),
        CoinGeckoService.getTrending(),
      ]);

      const fearGreedValue = fearGreed ? parseInt(fearGreed.value) : 50;
      const btcDominance = globalData?.data?.market_cap_percentage?.btc || 50;
      const totalMarketCap = globalData?.data?.total_market_cap?.usd || 0;

      // Analyze top coins
      const recommendations: AiRecommendation[] = [];
      for (const coin of topCoins.slice(0, 8)) {
        const rec = await this.analyzeCoin(coin.id);
        if (rec) recommendations.push(rec);
      }

      // Determine market trend
      const marketTrend = this.determineMarketTrend(fearGreedValue, btcDominance, recommendations);

      // Generate AI summary using Gemini
      const marketSummary = await this.generateMarketSummary(
        fearGreedValue,
        btcDominance,
        totalMarketCap,
        marketTrend,
        recommendations,
        trending
      );

      return {
        fearGreedIndex: { value: fearGreedValue, classification: fearGreed?.value_classification || 'Neutral' },
        marketTrend,
        btcDominance,
        totalMarketCap,
        recommendations,
        trendingCoins: trending,
        marketSummary,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Market analysis error:', error.message);
      return null;
    }
  }

  /**
   * Generate technical signals for a coin
   */
  private static generateSignals(detail: CoinDetail, chart: any): Signal[] {
    const signals: Signal[] = [];
    const md = detail.market_data;

    // Price momentum signal
    const change24h = md.price_change_percentage_24h || 0;
    const change7d = md.price_change_percentage_7d || 0;
    const change30d = md.price_change_percentage_30d || 0;

    signals.push({
      name: 'Price Momentum',
      type: change7d > 0 ? 'BULLISH' : change7d < -5 ? 'BEARISH' : 'NEUTRAL',
      strength: Math.min(Math.abs(change7d) / 20, 1),
      description: `24h: ${change24h.toFixed(2)}%, 7d: ${change7d.toFixed(2)}%, 30d: ${change30d.toFixed(2)}%`,
    });

    // Volume signal
    const volumeToMcap = md.total_volume?.usd && md.market_cap?.usd
      ? md.total_volume.usd / md.market_cap.usd
      : 0;
    signals.push({
      name: 'Volume/MCap Ratio',
      type: volumeToMcap > 0.1 ? 'BULLISH' : volumeToMcap < 0.03 ? 'BEARISH' : 'NEUTRAL',
      strength: Math.min(volumeToMcap * 5, 1),
      description: `Volume-to-MarketCap ratio: ${(volumeToMcap * 100).toFixed(1)}%`,
    });

    // ATH distance signal
    const athDrop = md.ath?.usd
      ? ((md.current_price.usd - md.ath.usd) / md.ath.usd) * 100
      : 0;
    signals.push({
      name: 'ATH Proximity',
      type: athDrop > -10 ? 'BULLISH' : athDrop < -50 ? 'BEARISH' : 'NEUTRAL',
      strength: Math.min(Math.abs(athDrop) / 80, 1),
      description: `${athDrop.toFixed(1)}% from ATH`,
    });

    // Supply pressure signal
    if (md.circulating_supply && md.max_supply) {
      const supplyPct = (md.circulating_supply / md.max_supply) * 100;
      signals.push({
        name: 'Supply Dynamics',
        type: supplyPct > 90 ? 'BEARISH' : 'NEUTRAL',
        strength: supplyPct > 90 ? 0.7 : 0.3,
        description: `${supplyPct.toFixed(1)}% of max supply circulated`,
      });
    }

    // Sentiment signal
    if (detail.sentiment_votes_up_percentage) {
      const sentimentDiff = detail.sentiment_votes_up_percentage - (detail.sentiment_votes_down_percentage || 0);
      signals.push({
        name: 'Community Sentiment',
        type: sentimentDiff > 20 ? 'BULLISH' : sentimentDiff < -20 ? 'BEARISH' : 'NEUTRAL',
        strength: Math.min(Math.abs(sentimentDiff) / 60, 1),
        description: `${detail.sentiment_votes_up_percentage}% positive votes`,
      });
    }

    // Volatility signal
    const volatility = this.calculateVolatility(chart);
    signals.push({
      name: 'Volatility',
      type: volatility > 10 ? 'BEARISH' : volatility < 3 ? 'BULLISH' : 'NEUTRAL',
      strength: Math.min(volatility / 20, 1),
      description: `30-day volatility: ${volatility.toFixed(1)}%`,
    });

    return signals;
  }

  /**
   * Calculate key metrics
   */
  private static calculateMetrics(detail: CoinDetail, signals: Signal[]): CoinMetrics {
    const md = detail.market_data;
    return {
      priceChange24h: md.price_change_percentage_24h || 0,
      priceChange7d: md.price_change_percentage_7d || 0,
      priceChange30d: md.price_change_percentage_30d || 0,
      volatility: signals.find(s => s.name === 'Volatility')?.strength || 0,
      volumeToMcap: md.total_volume?.usd && md.market_cap?.usd
        ? md.total_volume.usd / md.market_cap.usd
        : 0,
      athDrop: md.ath?.usd
        ? ((md.current_price.usd - md.ath.usd) / md.ath.usd) * 100
        : 0,
      sentimentScore: detail.sentiment_votes_up_percentage || 50,
      momentumScore: this.calculateMomentum(md),
    };
  }

  private static calculateMomentum(md: any): number {
    const w1 = 0.5, w2 = 0.3, w3 = 0.2;
    const c24 = md.price_change_percentage_24h || 0;
    const c7d = md.price_change_percentage_7d || 0;
    const c30d = md.price_change_percentage_30d || 0;
    return (c24 * w1 + c7d * w2 + c30d * w3);
  }

  private static calculateVolatility(chart: any): number {
    if (!chart?.prices || chart.prices.length < 10) return 5;
    const prices = chart.prices.map((p: [number, number]) => p[1]);
    const returns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
    return Math.sqrt(variance) * 100 * Math.sqrt(365);
  }

  /**
   * Determine trading action
   */
  private static determineAction(metrics: CoinMetrics): AiRecommendation['action'] {
    const score = metrics.momentumScore * 0.3
      + (metrics.sentimentScore - 50) * 0.2
      + (metrics.athDrop > -20 ? 15 : metrics.athDrop > -50 ? 0 : -15)
      + (metrics.volumeToMcap > 0.08 ? 10 : -5)
      - metrics.volatility * 0.5;

    if (score > 20) return 'STRONG_BUY';
    if (score > 5) return 'BUY';
    if (score > -5) return 'HOLD';
    if (score > -20) return 'SELL';
    return 'STRONG_SELL';
  }

  private static calculateConfidence(metrics: CoinMetrics): number {
    const signals = [
      Math.abs(metrics.priceChange24h) > 0 ? 1 : 0,
      metrics.volumeToMcap > 0 ? 1 : 0,
      metrics.athDrop !== 0 ? 1 : 0,
      metrics.sentimentScore !== 50 ? 1 : 0,
    ];
    const signalStrength = signals.reduce((a, b) => a + b, 0) / signals.length;
    return Math.round(Math.min(95, Math.max(25, signalStrength * 70 + 25)));
  }

  private static assessRisk(metrics: CoinMetrics): AiRecommendation['riskLevel'] {
    const riskScore = metrics.volatility * 0.4 + Math.abs(metrics.priceChange30d) * 0.3 + (100 - metrics.sentimentScore) * 0.003;
    if (riskScore < 3) return 'LOW';
    if (riskScore < 6) return 'MEDIUM';
    if (riskScore < 10) return 'HIGH';
    return 'VERY_HIGH';
  }

  private static calculatePriceTarget(detail: CoinDetail, metrics: CoinMetrics) {
    const current = detail.market_data.current_price.usd;
    const momentum = metrics.momentumScore / 100;
    return {
      current,
      conservative: current * (1 + momentum * 0.5),
      optimistic: current * (1 + momentum * 1.5 + 0.1),
      timeline: '30 days',
    };
  }

  private static generateAnalysis(
    detail: CoinDetail,
    signals: Signal[],
    metrics: CoinMetrics,
    action: string
  ): string {
    const bullishSignals = signals.filter(s => s.type === 'BULLISH');
    const bearishSignals = signals.filter(s => s.type === 'BEARISH');

    let analysis = `${detail.name} (${detail.symbol.toUpperCase()}) analysis:\n\n`;

    if (bullishSignals.length > 0) {
      analysis += `Bullish factors: ${bullishSignals.map(s => s.name).join(', ')}.\n`;
    }
    if (bearishSignals.length > 0) {
      analysis += `Bearish factors: ${bearishSignals.map(s => s.name).join(', ')}.\n`;
    }

    analysis += `Momentum score: ${metrics.momentumScore.toFixed(1)}%. `;
    analysis += `Volume/MCap: ${(metrics.volumeToMcap * 100).toFixed(1)}%. `;
    analysis += `Risk assessment: ${metrics.volatility > 8 ? 'High volatility detected.' : 'Moderate volatility.'} `;
    analysis += `Recommendation: ${action.replace('_', ' ')}.`;

    return analysis;
  }

  private static determineMarketTrend(
    fearGreed: number,
    btcDominance: number,
    recommendations: AiRecommendation[]
  ): 'BULLISH' | 'BEARISH' | 'NEUTRAL' {
    const bullishCount = recommendations.filter(r => r.action.includes('BUY')).length;
    const bearishCount = recommendations.filter(r => r.action.includes('SELL')).length;

    if (fearGreed > 60 && bullishCount > bearishCount) return 'BULLISH';
    if (fearGreed < 40 && bearishCount > bullishCount) return 'BEARISH';
    return 'NEUTRAL';
  }

  /**
   * Generate market summary using Gemini AI
   */
  private static async generateMarketSummary(
    fearGreed: number,
    btcDominance: number,
    totalMarketCap: number,
    marketTrend: string,
    recommendations: AiRecommendation[],
    trending: TrendingCoin[]
  ): Promise<string> {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return this.generateLocalSummary(fearGreed, btcDominance, totalMarketCap, marketTrend, recommendations, trending);

      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const topRecs = recommendations.slice(0, 5).map(r =>
        `${r.coinName}: ${r.action} (${r.confidence}% confidence, ${r.riskLevel} risk)`
      ).join('\n');

      const trendingList = trending.slice(0, 5).map(t => t.item.name).join(', ');

      const prompt = `You are a senior crypto market analyst. Generate a concise market intelligence report.

MARKET DATA:
- Fear & Greed Index: ${fearGreed}/100 (${marketTrend})
- BTC Dominance: ${btcDominance.toFixed(1)}%
- Total Market Cap: $${(totalMarketCap / 1e12).toFixed(2)}T
- Market Trend: ${marketTrend}

TOP RECOMMENDATIONS:
${topRecs}

TRENDING COINS: ${trendingList}

Generate a 3-4 sentence executive summary covering:
1. Overall market sentiment and key driver
2. Top opportunity from the recommendations
3. Key risk to watch
4. Actionable insight for the next 7 days

Keep it data-driven and actionable. No disclaimers.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      return response.text || this.generateLocalSummary(fearGreed, btcDominance, totalMarketCap, marketTrend, recommendations, trending);
    } catch (error) {
      return this.generateLocalSummary(fearGreed, btcDominance, totalMarketCap, marketTrend, recommendations, trending);
    }
  }

  private static generateLocalSummary(
    fearGreed: number,
    btcDominance: number,
    totalMarketCap: number,
    marketTrend: string,
    recommendations: AiRecommendation[],
    trending: TrendingCoin[]
  ): string {
    const topBuy = recommendations.find(r => r.action.includes('BUY'));
    const sentiment = fearGreed > 60 ? 'bullish' : fearGreed < 40 ? 'bearish' : 'cautiously neutral';
    let summary = `Market sentiment is ${sentiment} with Fear & Greed at ${fearGreed}. BTC dominance stands at ${btcDominance.toFixed(1)}%. `;
    if (topBuy) {
      summary += `${topBuy.coinName} shows ${topBuy.action.replace('_', ' ').toLowerCase()} signal with ${topBuy.confidence}% confidence. `;
    }
    summary += `Watch for ${marketTrend.toLowerCase()} continuation over the next week.`;
    return summary;
  }
}
