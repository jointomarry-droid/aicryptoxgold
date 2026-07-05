import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { Flame, RefreshCw } from 'lucide-react';

interface HeatmapAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  sentiment: string;
  intensity: number;
  volumeRatio: string;
  marketCap: number;
}

export function SentimentHeatmap() {
  const [assets, setAssets] = useState<HeatmapAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/sentiment/heatmap');
      setAssets(res.data.assets || []);
    } catch (err) {
      console.error('Heatmap error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (sentiment: string, intensity: number) => {
    const opacity = Math.min(0.9, 0.3 + (intensity / 100) * 0.6);
    if (sentiment === 'BULLISH') return `rgba(34, 197, 94, ${opacity})`;
    if (sentiment === 'BEARISH') return `rgba(239, 68, 68, ${opacity})`;
    return `rgba(156, 163, 175, ${opacity * 0.5})`;
  };

  const getTextColor = (sentiment: string) => {
    if (sentiment === 'BULLISH') return 'text-emerald-400';
    if (sentiment === 'BEARISH') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-surface border border-outline">
      <div className="p-6 border-b border-surface-highlight">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Flame size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-on-background">Sentiment Heatmap</h2>
              <p className="text-xs text-orange-400 font-mono uppercase tracking-widest">Real-Time Market Mood</p>
            </div>
          </div>
          <button onClick={fetchData} className="p-2 rounded-lg hover:bg-surface-highlight transition-colors">
            <RefreshCw size={16} className={cn("text-on-surface-variant", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {loading && assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 animate-pulse gap-3">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant text-xs">Loading sentiment data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-xl p-3 border border-outline transition-all hover:scale-105 hover:border-primary/50 cursor-default"
                style={{ backgroundColor: getColor(asset.sentiment, asset.intensity) }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={asset.image} alt={asset.name} className="w-5 h-5 rounded-full" />
                  <span className="font-bold text-xs text-white">{asset.symbol}</span>
                </div>
                <div className="text-[10px] text-white/80 font-mono mb-1">${asset.price.toLocaleString()}</div>
                <div className={cn("text-[10px] font-bold", getTextColor(asset.sentiment))}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                </div>
                <div className="text-[8px] text-white/60 mt-1">
                  Vol: {asset.volumeRatio}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-surface-highlight flex items-center justify-center gap-4 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500/70" />
          <span className="text-on-surface-variant">Bullish</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-500/50" />
          <span className="text-on-surface-variant">Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500/70" />
          <span className="text-on-surface-variant">Bearish</span>
        </div>
      </div>
    </div>
  );
}
