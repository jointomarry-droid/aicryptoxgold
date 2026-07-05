import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { AlertTriangle, Shield, RefreshCw, TrendingDown, Activity } from 'lucide-react';

interface CrashData {
  riskScore: number;
  riskLevel: string;
  prediction: string;
  indicators: {
    fearGreedExtreme: boolean;
    highVolatility: boolean;
    volumeSpike: boolean;
    ATHDistance: number;
    btcDominance: number;
    marketCapDrop: number;
  };
  fearGreedIndex: number;
  btcPrice: number;
  btcChange7d: number;
  recommendations: string[];
}

export function CrashPredictor() {
  const [data, setData] = useState<CrashData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/ai/crash-predictor');
      setData(res.data);
    } catch (err) {
      console.error('Crash predictor error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'EXTREME': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'MODERATE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-surface border border-outline">
      <div className="p-6 border-b border-surface-highlight">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-on-background">Crash Predictor</h2>
              <p className="text-xs text-red-400 font-mono uppercase tracking-widest">AI Risk Detection</p>
            </div>
          </div>
          <button onClick={fetchData} className="p-2 rounded-lg hover:bg-surface-highlight transition-colors">
            <RefreshCw size={16} className={cn("text-on-surface-variant", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center h-48 animate-pulse gap-3">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant text-xs">Analyzing market risk...</p>
          </div>
        ) : data ? (
          <div className="space-y-4">
            {/* Risk Score Gauge */}
            <div className="bg-surface-dim p-4 rounded-xl border border-outline text-center">
              <div className="text-xs text-on-surface-variant mb-2">Market Risk Score</div>
              <div className="relative w-32 h-16 mx-auto mb-2">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#333" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="url(#riskGradient)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${data.riskScore * 1.26} 126`} />
                  <defs>
                    <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-3xl font-display font-bold text-on-background">{data.riskScore}/100</div>
              <div className={cn("inline-block px-3 py-1 rounded-lg border text-sm font-bold mt-2", getRiskColor(data.riskLevel))}>
                {data.riskLevel} RISK
              </div>
            </div>

            {/* Prediction */}
            <div className="bg-surface-dim p-4 rounded-xl border border-outline">
              <div className="text-xs text-on-surface-variant mb-1">AI Prediction</div>
              <p className="text-sm text-on-background">{data.prediction}</p>
            </div>

            {/* Indicators */}
            <div className="bg-surface-dim p-4 rounded-xl border border-outline">
              <div className="text-xs text-on-surface-variant mb-3 flex items-center gap-1"><Activity size={12} /> Indicators</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Fear/Greed:</span>
                  <span className={cn("font-bold", data.fearGreedIndex > 70 ? "text-orange-400" : data.fearGreedIndex < 30 ? "text-blue-400" : "text-gray-400")}>
                    {data.fearGreedIndex}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">BTC Dom:</span>
                  <span className="font-mono text-on-background">{data.indicators.btcDominance.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">7d Change:</span>
                  <span className={cn("font-mono", data.btcChange7d >= 0 ? "text-emerald-400" : "text-red-400")}>
                    {data.btcChange7d?.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">From ATH:</span>
                  <span className="font-mono text-on-background">{data.indicators.ATHDistance.toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {data.indicators.fearGreedExtreme && <div className="text-[10px] text-red-400">⚠ Extreme Fear/Greed detected</div>}
                {data.indicators.highVolatility && <div className="text-[10px] text-orange-400">⚠ High volatility warning</div>}
                {data.indicators.volumeSpike && <div className="text-[10px] text-yellow-400">⚠ Abnormal volume spike</div>}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-surface-dim p-4 rounded-xl border border-outline">
              <div className="text-xs text-on-surface-variant mb-2 flex items-center gap-1"><Shield size={12} /> Recommendations</div>
              <ul className="space-y-1">
                {data.recommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-on-background flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
