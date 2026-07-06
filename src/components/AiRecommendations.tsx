import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrency, cn } from '../lib/utils';
import {
  BrainCircuit, TrendingUp, TrendingDown, Shield, AlertTriangle,
  Target, Zap, ChevronDown, ChevronUp, RefreshCw, BarChart3
} from 'lucide-react';

interface Recommendation {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  action: string;
  confidence: number;
  riskLevel: string;
  metrics: {
    priceChange24h: number;
    priceChange7d: number;
    priceChange30d: number;
    volumeToMcap: number;
    athDrop: number;
    momentumScore: number;
    priceVariance: number;
    volumeSurge: number;
  };
  prices: {
    coingecko: number;
    binance: number | null;
    average: number;
  };
  priceTarget: {
    current: number;
    conservative: number;
    moderate: number;
    optimistic: number;
    timeline: string;
  };
  signals: {
    momentum: string;
    volume: string;
    volatility: string;
    sentiment: string;
  };
}

interface MarketData {
  fearGreedIndex: { value: number; classification: string };
  btcDominance: number;
  totalMarketCap: number;
  totalVolume24h: number;
  recommendations: Recommendation[];
  timestamp: string;
}

const ACTION_COLORS: Record<string, string> = {
  STRONG_BUY: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  BUY: 'text-green-400 bg-green-500/10 border-green-500/30',
  HOLD: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  SELL: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  STRONG_SELL: 'text-red-400 bg-red-500/10 border-red-500/30',
};

const RISK_COLORS: Record<string, string> = {
  LOW: 'text-emerald-400',
  MEDIUM: 'text-yellow-400',
  HIGH: 'text-orange-400',
  VERY_HIGH: 'text-red-400',
};

const SIGNAL_COLORS: Record<string, string> = {
  BULLISH: 'text-emerald-400',
  BEARISH: 'text-red-400',
  NEUTRAL: 'text-gray-400',
  HIGH: 'text-orange-400',
  NORMAL: 'text-gray-400',
  LOW: 'text-blue-400',
  GREEDY: 'text-orange-400',
  FEARFUL: 'text-blue-400',
};

export function AiRecommendations() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/coingecko/recommendations', {
        coinIds: ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano', 'dogecoin', 'polkadot'],
      });
      setData(response.data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    const interval = setInterval(fetchRecommendations, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-surface-highlight flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg glow-gold">
            <BrainCircuit className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-on-background">AI Trade Signals</h2>
            <p className="text-xs text-primary font-mono opacity-80 uppercase tracking-widest">Multi-Source Analysis</p>
          </div>
        </div>
        <div className="p-12 flex flex-col items-center justify-center animate-pulse gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-on-surface-variant text-sm">Analyzing market data from CoinGecko + Binance...</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary blur-[100px] opacity-10 pointer-events-none" />
      <div className="p-6 border-b border-surface-highlight flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg glow-gold">
            <BrainCircuit className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-on-background tracking-tight">AI Trade Signals</h2>
            <p className="text-xs text-primary font-mono opacity-80 uppercase tracking-widest">Multi-Source Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && <span className="text-[10px] text-on-surface-variant">Updated {lastUpdate}</span>}
          <button onClick={fetchRecommendations} className="p-2 rounded-lg hover:bg-surface-highlight transition-colors" title="Refresh">
            <RefreshCw size={16} className={cn("text-on-surface-variant", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Market Summary Bar */}
      <div className="px-6 py-3 bg-surface-dim/50 border-b border-surface-highlight flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant">Fear/Greed:</span>
          <span className={cn("font-bold", data.fearGreedIndex.value > 60 ? 'text-orange-400' : data.fearGreedIndex.value < 40 ? 'text-blue-400' : 'text-gray-400')}>
            {data.fearGreedIndex.value} {data.fearGreedIndex.classification}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant">BTC Dom:</span>
          <span className="font-mono font-bold text-on-background">{data.btcDominance?.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant">Mkt Cap:</span>
          <span className="font-mono font-bold text-on-background">${(data.totalMarketCap / 1e12).toFixed(2)}T</span>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[200px]">
        {data.recommendations.map((rec) => (
          <div key={rec.coinId} className="border-b border-surface-highlight/50 last:border-0">
            {/* Main Row */}
            <button
              onClick={() => setExpanded(expanded === rec.coinId ? null : rec.coinId)}
              className="w-full px-6 py-4 flex items-center gap-4 hover:bg-surface-highlight/20 transition-colors text-left"
            >
              <img src={rec.coinImage} alt={rec.coinName} className="w-8 h-8 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-on-background">{rec.coinName}</span>
                  <span className="text-xs text-on-surface-variant font-mono">{rec.coinSymbol}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="font-mono font-medium text-on-background">{formatCurrency(rec.prices.average)}</span>
                  <span className={cn("text-xs font-mono", rec.metrics.priceChange24h >= 0 ? "text-emerald-400" : "text-red-400")}>
                    {rec.metrics.priceChange24h >= 0 ? '+' : ''}{rec.metrics.priceChange24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className={cn("px-3 py-1.5 rounded-lg border text-xs font-bold", ACTION_COLORS[rec.action])}>
                {rec.action.replace('_', ' ')}
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-on-surface-variant">Confidence</div>
                <div className="font-mono font-bold text-on-background">{rec.confidence}%</div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-on-surface-variant">Risk</div>
                <div className={cn("font-bold text-xs", RISK_COLORS[rec.riskLevel])}>{rec.riskLevel}</div>
              </div>
              {expanded === rec.coinId ? <ChevronUp size={16} className="text-on-surface-variant" /> : <ChevronDown size={16} className="text-on-surface-variant" />}
            </button>

            {/* Expanded Details */}
            {expanded === rec.coinId && (
              <div className="px-6 pb-4 bg-surface-dim/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Signals */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                      <Zap size={12} /> Signals
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-on-surface-variant">Momentum: </span><span className={cn("font-bold", SIGNAL_COLORS[rec.signals.momentum])}>{rec.signals.momentum}</span></div>
                      <div><span className="text-on-surface-variant">Volume: </span><span className={cn("font-bold", SIGNAL_COLORS[rec.signals.volume])}>{rec.signals.volume}</span></div>
                      <div><span className="text-on-surface-variant">Volatility: </span><span className={cn("font-bold", SIGNAL_COLORS[rec.signals.volatility])}>{rec.signals.volatility}</span></div>
                      <div><span className="text-on-surface-variant">Sentiment: </span><span className={cn("font-bold", SIGNAL_COLORS[rec.signals.sentiment])}>{rec.signals.sentiment}</span></div>
                    </div>
                  </div>

                  {/* Price Targets */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                      <Target size={12} /> Price Targets ({rec.priceTarget.timeline})
                    </h4>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className="flex justify-between"><span className="text-on-surface-variant">Conservative:</span><span className="font-mono text-blue-400">{formatCurrency(rec.priceTarget.conservative)}</span></div>
                      <div className="flex justify-between"><span className="text-on-surface-variant">Moderate:</span><span className="font-mono text-yellow-400">{formatCurrency(rec.priceTarget.moderate)}</span></div>
                      <div className="flex justify-between"><span className="text-on-surface-variant">Optimistic:</span><span className="font-mono text-emerald-400">{formatCurrency(rec.priceTarget.optimistic)}</span></div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                      <BarChart3 size={12} /> Metrics
                    </h4>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className="flex justify-between"><span className="text-on-surface-variant">7d Change:</span><span className={cn("font-mono font-bold", rec.metrics.priceChange7d >= 0 ? "text-emerald-400" : "text-red-400")}>{rec.metrics.priceChange7d.toFixed(2)}%</span></div>
                      <div className="flex justify-between"><span className="text-on-surface-variant">30d Change:</span><span className={cn("font-mono", rec.metrics.priceChange30d >= 0 ? "text-emerald-400" : "text-red-400")}>{rec.metrics.priceChange30d.toFixed(2)}%</span></div>
                      <div className="flex justify-between"><span className="text-on-surface-variant">From ATH:</span><span className="font-mono text-on-background">{rec.metrics.athDrop.toFixed(1)}%</span></div>
                      <div className="flex justify-between"><span className="text-on-surface-variant">Vol/MCap:</span><span className="font-mono text-on-background">{(rec.metrics.volumeToMcap * 100).toFixed(1)}%</span></div>
                      {rec.prices.binance && (
                        <div className="flex justify-between"><span className="text-on-surface-variant">Binance:</span><span className="font-mono text-yellow-400">{formatCurrency(rec.prices.binance)}</span></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
