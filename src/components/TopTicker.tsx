import { cn, formatCurrency } from '../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMetalsMarket } from '../hooks/useMetalsMarket';

export function TopTicker() {
  const { tickerData } = useMetalsMarket();

  return (
    <div className="flex items-center w-full bg-surface-dim border-b border-surface-highlight h-8 shrink-0 overflow-hidden relative z-40">
      <div className="px-4 py-1 flex items-center h-full text-[10px] font-bold bg-primary text-black uppercase tracking-widest whitespace-nowrap z-20 shadow-md">
        Market Status: Open
      </div>
      <div className="absolute left-[140px] top-0 bottom-0 w-8 bg-gradient-to-r from-surface-dim to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface-dim to-transparent z-10 pointer-events-none" />
      
      <div className="flex animate-ticker items-center h-full">
        <div className="flex flex-nowrap items-center min-w-max">
          {[...tickerData, ...tickerData, ...tickerData].map((item, idx) => {
            const isPositive = item.change >= 0;
            return (
              <div key={idx} className="flex-shrink-0 flex items-center px-4 gap-2 text-[11px] font-medium">
                <span className="text-on-surface-variant uppercase">{item.symbol}:</span>
                <span className={isPositive ? "text-success" : "text-danger"}>
                  {formatCurrency(item.price)} ({isPositive ? '+' : ''}{item.change}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
