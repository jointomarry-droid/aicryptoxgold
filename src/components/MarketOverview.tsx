import { MARKET_DATA } from '../lib/data';
import { cn, formatNumber } from '../lib/utils';
import { Activity, Coins, DollarSign, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';

export function MarketOverview() {
  const { globalMetrics } = MARKET_DATA;
  const isPositive = globalMetrics.marketCapChange >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard 
        title="Global Market Cap" 
        value={`$${formatNumber(globalMetrics.marketCap)}`}
        change={globalMetrics.marketCapChange}
        icon={<Activity size={20} className="text-primary"/>}
      />
      <MetricCard 
        title="24h Volume" 
        value={`$${formatNumber(globalMetrics.volume24h)}`}
        icon={<TrendingUp size={20} className="text-primary"/>}
      />
      <MetricCard 
        title="BTC Dominance" 
        value={`${globalMetrics.btcDominance}%`}
        icon={<PieChart size={20} className="text-primary"/>}
      />
      <MetricCard 
        title="DeFi TVL (Est)" 
        value="$85.2B"
        change={2.4}
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
            {Math.abs(change)}% (24h)
          </div>
        )}
      </div>
    </div>
  );
}
