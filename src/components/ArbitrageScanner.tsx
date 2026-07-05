import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { ArrowLeftRight, RefreshCw, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface ArbitrageOpportunity {
  symbol: string;
  prices: Record<string, number>;
  spread: string;
  profitPer1000: string;
  buyOn: string;
  sellOn: string;
  action: string;
}

export function ArbitrageScanner() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchArbitrage = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/arbitrage/scanner');
      setOpportunities(res.data.opportunities || []);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Arbitrage error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArbitrage();
    const interval = setInterval(fetchArbitrage, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-surface border border-outline">
      <div className="p-6 border-b border-surface-highlight">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <ArrowLeftRight size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-on-background">Arbitrage Scanner</h2>
              <p className="text-xs text-cyan-400 font-mono uppercase tracking-widest">Cross-Exchange Profits</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdate && <span className="text-[10px] text-on-surface-variant">{lastUpdate}</span>}
            <button onClick={fetchArbitrage} className="p-2 rounded-lg hover:bg-surface-highlight transition-colors">
              <RefreshCw size={16} className={cn("text-on-surface-variant", loading && "animate-spin")} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading && opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 animate-pulse gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant text-xs">Scanning exchanges...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant">
            <ArrowLeftRight size={32} className="opacity-20 mb-3" />
            <p className="text-xs">No data available</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-highlight/50">
            {opportunities.map((opp) => (
              <div key={opp.symbol} className="p-4 hover:bg-surface-highlight/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-background">{opp.symbol}</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded",
                      opp.action === 'OPPORTUNITY' ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"
                    )}>
                      {opp.action === 'OPPORTUNITY' ? <Zap size={10} className="inline mr-1" /> : null}
                      {opp.action === 'OPPORTUNITY' ? 'ARB FOUND' : 'NO ARB'}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    Spread: <span className={cn("font-mono font-bold", parseFloat(opp.spread) > 0.1 ? "text-emerald-400" : "text-on-background")}>{opp.spread}%</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-surface-dim p-2 rounded">
                    <div className="text-on-surface-variant mb-0.5">Buy on {opp.buyOn}</div>
                    <div className="font-mono font-bold text-on-background">
                      {(() => { const p = Object.entries(opp.prices).find(([k]) => k === opp.buyOn)?.[1]; return p ? '$' + p.toLocaleString() : 'N/A'; })()}
                    </div>
                  </div>
                  <div className="bg-surface-dim p-2 rounded">
                    <div className="text-on-surface-variant mb-0.5">Sell on {opp.sellOn}</div>
                    <div className="font-mono font-bold text-on-background">
                      {(() => { const p = Object.entries(opp.prices).find(([k]) => k === opp.sellOn)?.[1]; return p ? '$' + p.toLocaleString() : 'N/A'; })()}
                    </div>
                  </div>
                </div>

                {opp.action === 'OPPORTUNITY' && (
                  <div className="mt-2 text-[10px] text-emerald-400 font-medium">
                    {'Profit per $1,000: $' + opp.profitPer1000}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
