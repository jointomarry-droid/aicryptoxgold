import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { Flame, TrendingUp } from 'lucide-react';

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    data: {
      price: number;
      price_change_percentage_24h: { usd: number };
      market_cap: string;
      total_volume: string;
    };
  };
}

export function TrendingCoins() {
  const [coins, setCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get('/api/coingecko/trending');
        setCoins(res.data?.coins || []);
      } catch (err) {
        console.error('Trending fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
    const interval = setInterval(fetchTrending, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-surface-highlight flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 rounded-lg">
          <Flame className="text-orange-400 h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold text-on-background">Trending Now</h2>
          <p className="text-xs text-on-surface-variant">Most searched on CoinGecko</p>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-surface-highlight rounded-lg animate-pulse" />
            ))}
          </div>
        ) : coins.length === 0 ? (
          <div className="text-center text-on-surface-variant text-sm py-4">No trending data</div>
        ) : (
          <div className="space-y-2">
            {coins.slice(0, 6).map((coin, idx) => {
              const change = coin.item.data?.price_change_percentage_24h?.usd || 0;
              return (
                <div
                  key={coin.item.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-highlight/30 transition-colors"
                >
                  <span className="text-xs font-mono text-on-surface-variant w-4">{idx + 1}</span>
                  <img src={coin.item.thumb} alt="" className="w-6 h-6 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-on-background truncate">{coin.item.name}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono">{coin.item.symbol.toUpperCase()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-medium text-on-background">
                      ${coin.item.data?.price?.toLocaleString(undefined, { maximumFractionDigits: coin.item.data?.price < 1 ? 6 : 2 })}
                    </div>
                    <div className={cn("text-[10px] font-mono flex items-center gap-0.5 justify-end", change >= 0 ? "text-emerald-400" : "text-red-400")}>
                      <TrendingUp size={8} />
                      {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
