import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { Grid3x3, RefreshCw } from 'lucide-react';

interface CorrelationData {
  matrix: Record<string, Record<string, number>>;
  assets: string[];
}

export function CorrelationMatrix() {
  const [data, setData] = useState<CorrelationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{ a: string; b: string; value: number } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/correlation/matrix');
      setData(res.data);
    } catch (err) {
      console.error('Correlation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, []);

  const getCorrelationColor = (value: number) => {
    if (value >= 0.7) return 'bg-emerald-500/80';
    if (value >= 0.3) return 'bg-emerald-500/40';
    if (value >= -0.3) return 'bg-gray-500/30';
    if (value >= -0.7) return 'bg-red-500/40';
    return 'bg-red-500/80';
  };

  const getCorrelationLabel = (value: number) => {
    if (value >= 0.7) return 'Strong +';
    if (value >= 0.3) return 'Moderate +';
    if (value >= -0.3) return 'Weak';
    if (value >= -0.7) return 'Moderate -';
    return 'Strong -';
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-surface border border-outline">
      <div className="p-6 border-b border-surface-highlight">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Grid3x3 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-on-background">Correlation Matrix</h2>
              <p className="text-xs text-indigo-400 font-mono uppercase tracking-widest">30-Day Cross-Asset</p>
            </div>
          </div>
          <button onClick={fetchData} className="p-2 rounded-lg hover:bg-surface-highlight transition-colors">
            <RefreshCw size={16} className={cn("text-on-surface-variant", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-4">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center h-48 animate-pulse gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant text-xs">Calculating correlations...</p>
          </div>
        ) : data ? (
          <div>
            {/* Matrix Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th className="p-1"></th>
                    {data.assets.map(a => (
                      <th key={a} className="p-1 text-[10px] font-bold text-on-surface-variant uppercase">{a.slice(0, 3)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.assets.map(rowAsset => (
                    <tr key={rowAsset}>
                      <td className="p-1 text-[10px] font-bold text-on-surface-variant uppercase text-right pr-2">{rowAsset.slice(0, 3)}</td>
                      {data.assets.map(colAsset => {
                        const value = data.matrix[rowAsset]?.[colAsset] || 0;
                        const isDiagonal = rowAsset === colAsset;
                        return (
                          <td
                            key={colAsset}
                            className={cn(
                              "p-1 cursor-default transition-transform hover:scale-110",
                              isDiagonal ? "bg-primary/20" : getCorrelationColor(value)
                            )}
                            onMouseEnter={() => !isDiagonal && setHoveredCell({ a: rowAsset, b: colAsset, value })}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <div className={cn(
                              "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded text-[10px] font-mono font-bold",
                              isDiagonal ? "text-primary" : "text-white"
                            )}>
                              {isDiagonal ? '1.00' : value.toFixed(2)}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hover Tooltip */}
            {hoveredCell && (
              <div className="mt-3 bg-surface-dim p-3 rounded-xl border border-outline text-center">
                <span className="text-xs text-on-surface-variant">{hoveredCell.a.toUpperCase()} ↔ {hoveredCell.b.toUpperCase()}: </span>
                <span className={cn("text-sm font-bold ml-1", hoveredCell.value > 0.3 ? "text-emerald-400" : hoveredCell.value < -0.3 ? "text-red-400" : "text-gray-400")}>
                  {hoveredCell.value.toFixed(3)}
                </span>
                <span className="text-[10px] text-on-surface-variant ml-2">({getCorrelationLabel(hoveredCell.value)})</span>
              </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-3 text-[10px]">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500/80" /><span className="text-on-surface-variant">Strong -</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-500/30" /><span className="text-on-surface-variant">Weak</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500/80" /><span className="text-on-surface-variant">Strong +</span></div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
