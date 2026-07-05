import { useState } from 'react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { Zap, Target, Shield, TrendingUp, TrendingDown, RefreshCw, ChevronDown } from 'lucide-react';

interface SignalResult {
  signal: string;
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number;
  risk_reward_ratio: number;
  timeframe: string;
  indicators: {
    rsi_signal: string;
    macd_signal: string;
    trend: string;
  };
  confidence: number;
  reasoning: string;
}

const COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
];

const SIGNAL_STYLES: Record<string, string> = {
  STRONG_BUY: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  BUY: 'text-green-400 bg-green-500/10 border-green-500/30',
  HOLD: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  SELL: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  STRONG_SELL: 'text-red-400 bg-red-500/10 border-red-500/30',
};

export function AiTradingSignals() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [result, setResult] = useState<SignalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/trading-signals', { asset: selectedCoin });
      setResult(res.data);
    } catch (err) {
      console.error('Signal error:', err);
    } finally {
      setLoading(false);
    }
  };

  const coin = COINS.find(c => c.id === selectedCoin);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-surface border border-outline">
      <div className="p-6 border-b border-surface-highlight">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-on-background">Trading Signals</h2>
              <p className="text-xs text-yellow-400 font-mono uppercase tracking-widest">AI Entry/Exit Points</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-4 py-2 bg-surface-dim border border-outline rounded-lg text-sm font-medium text-on-background flex items-center gap-2 hover:border-primary/50 transition-colors"
            >
              {coin?.name}
              <ChevronDown size={14} />
            </button>
            {showDropdown && (
              <div className="absolute z-50 mt-1 w-40 bg-surface-dim border border-outline rounded-lg shadow-xl overflow-hidden">
                {COINS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCoin(c.id); setShowDropdown(false); }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-surface-highlight transition-colors",
                      selectedCoin === c.id ? "text-primary bg-primary/10" : "text-on-background"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={analyze}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
            {loading ? 'Analyzing...' : 'Get Signal'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {loading && !result ? (
          <div className="flex flex-col items-center justify-center h-48 animate-pulse gap-3">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant text-xs">Generating trading signal...</p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            {/* Signal Badge */}
            <div className="text-center">
              <div className={cn(
                "inline-block px-6 py-3 rounded-xl border text-xl font-display font-bold",
                SIGNAL_STYLES[result.signal] || SIGNAL_STYLES.HOLD
              )}>
                {result.signal.replace('_', ' ')}
              </div>
              <div className="text-xs text-on-surface-variant mt-2">Confidence: {result.confidence}%</div>
            </div>

            {/* Entry/Exit Levels */}
            <div className="bg-surface-dim p-4 rounded-xl border border-outline">
              <h3 className="text-xs font-bold text-on-surface-variant mb-3 flex items-center gap-1"><Target size={12} /> Trade Levels</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-background p-2 rounded">
                  <div className="text-on-surface-variant">Entry Price</div>
                  <div className="font-mono font-bold text-on-background">${result.entry_price?.toLocaleString()}</div>
                </div>
                <div className="bg-background p-2 rounded">
                  <div className="text-on-surface-variant">Stop Loss</div>
                  <div className="font-mono font-bold text-red-400">${result.stop_loss?.toLocaleString()}</div>
                </div>
                <div className="bg-background p-2 rounded">
                  <div className="text-on-surface-variant">Take Profit 1</div>
                  <div className="font-mono font-bold text-emerald-400">${result.take_profit_1?.toLocaleString()}</div>
                </div>
                <div className="bg-background p-2 rounded">
                  <div className="text-on-surface-variant">Take Profit 2</div>
                  <div className="font-mono font-bold text-emerald-400">${result.take_profit_2?.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-on-surface-variant">Risk/Reward:</span>
                <span className="font-bold text-yellow-400">1:{result.risk_reward_ratio?.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Timeframe:</span>
                <span className="font-bold text-on-background">{result.timeframe}</span>
              </div>
            </div>

            {/* Indicators */}
            {result.indicators && (
              <div className="bg-surface-dim p-4 rounded-xl border border-outline">
                <h3 className="text-xs font-bold text-on-surface-variant mb-2">Technical Indicators</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-on-surface-variant mb-1">RSI</div>
                    <div className={cn("font-bold", result.indicators.rsi_signal === 'oversold' ? 'text-emerald-400' : result.indicators.rsi_signal === 'overbought' ? 'text-red-400' : 'text-gray-400')}>
                      {result.indicators.rsi_signal}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-on-surface-variant mb-1">MACD</div>
                    <div className={cn("font-bold", result.indicators.macd_signal === 'bullish' ? 'text-emerald-400' : result.indicators.macd_signal === 'bearish' ? 'text-red-400' : 'text-gray-400')}>
                      {result.indicators.macd_signal}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-on-surface-variant mb-1">Trend</div>
                    <div className={cn("font-bold", result.indicators.trend === 'uptrend' ? 'text-emerald-400' : result.indicators.trend === 'downtrend' ? 'text-red-400' : 'text-gray-400')}>
                      {result.indicators.trend}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reasoning */}
            <div className="bg-surface-dim p-4 rounded-xl border border-outline">
              <h3 className="text-xs font-bold text-on-surface-variant mb-2">AI Reasoning</h3>
              <p className="text-sm text-on-background leading-relaxed">{result.reasoning}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant">
            <Zap size={32} className="opacity-20 mb-3" />
            <p className="text-xs">Select an asset and click Get Signal</p>
          </div>
        )}
      </div>
    </div>
  );
}
