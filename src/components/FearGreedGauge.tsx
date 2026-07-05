import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { Gauge } from 'lucide-react';

interface FearGreedData {
  value: number;
  classification: string;
}

export function FearGreedGauge() {
  const [data, setData] = useState<FearGreedData>({ value: 50, classification: 'Neutral' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/coingecko/fear-greed');
        setData({ value: parseInt(res.data.value), classification: res.data.value_classification });
      } catch (err) {
        console.error('Fear & Greed fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    const interval = setInterval(fetch, 600000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (v: number) => {
    if (v <= 20) return 'text-red-500';
    if (v <= 40) return 'text-orange-400';
    if (v <= 60) return 'text-yellow-400';
    if (v <= 80) return 'text-green-400';
    return 'text-emerald-500';
  };

  const getBgGradient = (v: number) => {
    if (v <= 20) return 'from-red-500 to-red-600';
    if (v <= 40) return 'from-orange-400 to-orange-500';
    if (v <= 60) return 'from-yellow-400 to-yellow-500';
    if (v <= 80) return 'from-green-400 to-green-500';
    return 'from-emerald-400 to-emerald-500';
  };

  const rotation = -90 + (data.value / 100) * 180;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-surface-highlight flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Gauge className="text-primary h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold text-on-background">Fear & Greed Index</h2>
          <p className="text-xs text-on-surface-variant">Real-time market sentiment</p>
        </div>
      </div>
      <div className="p-6 flex flex-col items-center">
        {loading ? (
          <div className="w-32 h-16 bg-surface-highlight rounded-full animate-pulse" />
        ) : (
          <>
            <div className="relative w-48 h-24 overflow-hidden mb-4">
              {/* Gauge background arc */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-t-full bg-surface-highlight overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500 opacity-20" />
              </div>
              {/* Needle */}
              <div
                className="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-1000"
                style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
              >
                <div className="w-1 h-20 bg-on-background rounded-full" />
                <div className="w-3 h-3 rounded-full bg-primary -mt-1 -ml-1 glow-gold" />
              </div>
              {/* Center dot */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-surface border-2 border-primary z-10" />
            </div>
            <div className={cn("text-5xl font-display font-bold", getColor(data.value))}>{data.value}</div>
            <div className={cn("text-sm font-bold uppercase tracking-wider mt-1", getColor(data.value))}>{data.classification}</div>
            <div className="flex gap-6 mt-4 text-xs text-on-surface-variant">
              <span className="text-red-500">Fear</span>
              <span className="text-emerald-500">Greed</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
