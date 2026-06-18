import { formatCurrency } from '../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMetalsMarket } from '../hooks/useMetalsMarket';

export function MarketTicker() {
  const { tickerData } = useMetalsMarket();

  return (
    <div className="w-full bg-surface-dim border border-outline rounded-xl h-12 mb-6 overflow-hidden relative flex items-center shadow-sm">
      <div className="px-4 flex items-center h-full text-xs font-bold bg-primary text-black uppercase tracking-wider whitespace-nowrap z-20 shadow-md">
        Live Updates
      </div>
      <div className="absolute left-[120px] top-0 bottom-0 w-8 bg-gradient-to-r from-surface-dim to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface-dim to-transparent z-10 pointer-events-none" />
      
      <div className="flex animate-ticker items-center h-full">
        <div className="flex flex-nowrap items-center min-w-max">
          {[...tickerData, ...tickerData, ...tickerData].map((item, idx) => {
            const isPositive = item.change >= 0;
            return (
              <div key={idx} className="flex-shrink-0 flex items-center px-6 gap-2 text-sm font-medium border-r border-outline last:border-r-0">
                <span className="text-on-surface-variant font-bold">{item.symbol}</span>
                <span className="text-on-background font-mono">{formatCurrency(item.price)}</span>
                <span className={`text-xs flex items-center gap-0.5 ${isPositive ? "text-success" : "text-danger"}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(item.change)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
