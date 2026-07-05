import { cn, formatNumber } from '../lib/utils';
import { Activity, Coins, DollarSign, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface GlobalMetrics {
  marketCap: number;
  marketCapChange: number;
  volume24h: number;
  btcDominance: number;
  activeCoins: number;
}

export function MarketOverview() {
  const [metrics, setMetrics] = useState<GlobalMetrics>({
    marketCap: 2450000000000,
    marketCapChange: 2.4,
    volume24h: 85000000000,
    btcDominance: 52.3,
    activeCoins: 12847
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const response = await axios.get('/api/coingecko/global');
        const data = response.data;
        
        if (data && data.data) {
          setMetrics({
            marketCap: data.data.total_market_cap?.usd || 2450000000000,
            marketCapChange: data.data.market_cap_change_percentage_24h_usd || 2.4,
            volume24h: data.data.total_volume?.usd || 85000000000,
            btcDominance: data.data.market_cap_percentage?.btc || 52.3,
            activeCoins: data.data.active_cryptocurrencies || 12847
          });
        }
      } catch (error) {
        console.error('Failed to fetch global data:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
    const interval = setInterval(fetchGlobalData, 300000); // Update every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel rounded-xl p-5 animate-pulse">
            <div className="h-4 bg-surface-highlight rounded w-20 mb-3"></div>
            <div className="h-8 bg-surface-highlight rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard 
        title="Global Market Cap" 
        value={`$${formatNumber(metrics.marketCap)}`}
        change={metrics.marketCapChange}
        icon={<Activity size={20} className="text-primary"/>}
      />
      <MetricCard 
        title="24h Volume" 
        value={`$${formatNumber(metrics.volume24h)}`}
        icon={<TrendingUp size={20} className="text-primary"/>}
      />
      <MetricCard 
        title="BTC Dominance" 
        value={`${metrics.btcDominance.toFixed(1)}%`}
        icon={<PieChart size={20} className="text-primary"/>}
      />
      <MetricCard 
        title="Active Coins" 
        value={formatNumber(metrics.activeCoins)}
        icon={<Coins size={20} className="text-primary"/>}
      />
    </div>
  );
}

function MetricCard({ title, value, change, icon }: { title: string, value: string, change?: number, icon: ReactNode }) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col gap-3 group hover:border-outline transition-colors overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-on-surface-variant whitespace-nowrap overflow-hidden text-ellipsis mr-2">{title}</span>
        <div className="p-2 rounded-lg bg-surface-highlight group-hover:bg-primary-dim transition-colors shrink-0">
          {icon}
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-display font-bold text-on-background tracking-tight truncate" title={value}>{value}</div>
        {change !== undefined && (
          <div className={cn(
            "text-xs font-medium flex items-center gap-1 mt-1",
            isPositive ? "text-success" : "text-danger"
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change).toFixed(1)}% (24h)
          </div>
        )}
      </div>
    </div>
  );
}