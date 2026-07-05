import { useState } from 'react';
import axios from 'axios';
import { formatCurrency, cn } from '../lib/utils';
import { Sparkles, Target, Shield, TrendingUp, TrendingDown, Zap, RefreshCw, ChevronDown, BarChart3 } from 'lucide-react';

interface OracleResult {
  price_prediction: { conservative: number; moderate: number; aggressive: number };
  confidence_score: number;
  risk_assessment: string;
  key_levels: { support: number[]; resistance: number[] };
  trading_strategy: string;
  catalysts: string[];
  probability_analysis: { bull: number; bear: number; neutral: number };
  news_summary: string;
}

const COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
];

export function AiOracle() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('7d');
  const [result, setResult] = useState<OracleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/oracle', { asset: selectedCoin, timeframe });
      setResult(res.data);
    } catch (err) {
      console.error('Oracle error:', err);
    } finally {
      setLoading(false);
    }
  };

  const coin = COINS.find(c => c.id === selectedCoin);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-surface border border-outline">
      <div className="p-6 border-b border-surface-highlight">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-on-background">AI Market Oracle</h2>
            <p className="text-xs text-purple-400 font-mono uppercase tracking-widest">Gemini-Powered Prediction</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Coin Selector */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-4 py-2 bg-surface-dim border border-outline rounded-lg text-sm font-medium text-on-background flex items-center gap-2 hover:border-primary/50 transition-colors"
            >
              {coin?.name} ({coin?.symbol})
              <ChevronDown size={14} />
            </button>
            {showDropdown && (
              <div className="absolute z-50 mt-1 w-48 bg-surface-dim border border-outline rounded-lg shadow-xl overflow-hidden">
                {COINS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCoin(c.id); setShowDropdown(false); }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm hover:bg-surface-highlight transition-colors",
                      selectedCoin === c.id ? "text-primary bg-primary/10" : "text-on-background"
                    )}
                  >
                    {c.name} ({c.symbol})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Timeframe */}
          <div className="flex bg-surface-dim p-1 rounded-lg border border-outline">
            {['24h', '7d', '30d'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-md transition-colors",
                  timeframe === tf ? "bg-primary text-black" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={analyze}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loading ? 'Analyzing...' : 'Predict'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {loading && !result ? (
          <div className="flex flex-col items-center justify-center h-64 animate-pulse gap-4">
            <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant text-sm">Querying Gemini AI Oracle...</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Confidence & Risk */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-dim p-4 rounded-xl border border-outline">
                <div className="text-xs text-on-surface-variant mb-1">Confidence</div>
                <div className="text-3xl font-display font-bold text-on-background">{result.confidence_score}%</div>
                <div className="h-1.5 bg-surface-highlight rounded-full mt-2 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", result.confidence_score > 70 ? "bg-emerald-400" : result.confidence_score > 40 ? "bg-yellow-400" : "bg-red-400")}
                    style={{ width: `${result.confidence_score}%` }}
                  />
                </div>
              </div>
              <div className="bg-surface-dim p-4 rounded-xl border border-outline">
                <div className="text-xs text-on-surface-variant mb-1">Risk Level</div>
                <div className={cn(
                  "text-2xl font-display font-bold",
                  result.risk_assessment === 'LOW' ? "text-emerald-400" :
                  result.risk_assessment === 'MEDIUM' ? "text-yellow-400" :
                  result.risk_assessment === 'HIGH' ? "text-orange-400" : "text-red-400"
                )}>
                  {result.risk_assessment}
                </div>
              </div>
            </div>

            {/* Price Predictions */}
            {result.price_prediction && result.price_prediction.moderate > 0 && (
              <div className="bg-surface-dim p-4 rounded-xl border border-outline">
                <h3 className="text-sm font-bold text-on-surface-variant mb-3 flex items-center gap-2"><Target size={14} /> Price Targets</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-[10px] text-on-surface-variant uppercase">Conservative</div>
                    <div className="text-lg font-mono font-bold text-blue-400">{formatCurrency(result.price_prediction.conservative)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-on-surface-variant uppercase">Moderate</div>
                    <div className="text-lg font-mono font-bold text-yellow-400">{formatCurrency(result.price_prediction.moderate)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-on-surface-variant uppercase">Aggressive</div>
                    <div className="text-lg font-mono font-bold text-emerald-400">{formatCurrency(result.price_prediction.aggressive)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Probability Analysis */}
            {result.probability_analysis && (
              <div className="bg-surface-dim p-4 rounded-xl border border-outline">
                <h3 className="text-sm font-bold text-on-surface-variant mb-3 flex items-center gap-2"><BarChart3 size={14} /> Probability</h3>
                <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
                  <div className="bg-emerald-500/80 flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${result.probability_analysis.bull}%` }}>
                    {result.probability_analysis.bull}%
                  </div>
                  <div className="bg-gray-500/80 flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${result.probability_analysis.neutral}%` }}>
                    {result.probability_analysis.neutral}%
                  </div>
                  <div className="bg-red-500/80 flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${result.probability_analysis.bear}%` }}>
                    {result.probability_analysis.bear}%
                  </div>
                </div>
              </div>
            )}

            {/* Trading Strategy */}
            <div className="bg-surface-dim p-4 rounded-xl border border-outline">
              <h3 className="text-sm font-bold text-on-surface-variant mb-2 flex items-center gap-2"><Zap size={14} /> AI Strategy</h3>
              <p className="text-sm text-on-background leading-relaxed">{result.trading_strategy}</p>
            </div>

            {/* Catalysts */}
            {result.catalysts && result.catalysts.length > 0 && (
              <div className="bg-surface-dim p-4 rounded-xl border border-outline">
                <h3 className="text-sm font-bold text-on-surface-variant mb-2">Key Catalysts</h3>
                <ul className="space-y-1">
                  {result.catalysts.map((c, i) => (
                    <li key={i} className="text-xs text-on-background flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* News Summary */}
            {result.news_summary && (
              <div className="bg-surface-dim p-4 rounded-xl border border-outline">
                <h3 className="text-sm font-bold text-on-surface-variant mb-2">News Summary</h3>
                <p className="text-xs text-on-surface leading-relaxed">{result.news_summary}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant">
            <Sparkles size={40} className="opacity-20 mb-4" />
            <p className="text-sm">Select an asset and timeframe to get AI predictions</p>
          </div>
        )}
      </div>
    </div>
  );
}
