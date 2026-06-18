import { useState } from 'react';
import { cn, formatCurrency } from '../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMetalsMarket } from '../hooks/useMetalsMarket';

export function MetalPrices() {
  const { goldPrices, silverPrices } = useMetalsMarket();
  const [activeMetal, setActiveMetal] = useState<'Gold' | 'Silver'>('Gold');

  const activePrices = activeMetal === 'Gold' ? goldPrices : silverPrices;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-full bg-surface">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className={cn("text-xl font-display font-bold", activeMetal === 'Gold' ? "text-gradient-gold" : "text-gray-300")}>
            Spot {activeMetal}
          </h2>
          <p className="text-sm text-on-surface-variant">Real-time {activeMetal === 'Gold' ? 'XAU' : 'XAG'} quotes</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveMetal('Gold')}
            className={cn("px-3 py-1 rounded text-xs font-bold transition-colors", activeMetal === 'Gold' ? "bg-primary/20 text-primary border border-primary/50" : "bg-surface-dim text-on-surface-variant hover:text-on-surface")}
          >
            GLD
          </button>
          <button 
            onClick={() => setActiveMetal('Silver')}
            className={cn("px-3 py-1 rounded text-xs font-bold transition-colors", activeMetal === 'Silver' ? "bg-gray-300/20 text-gray-300 border border-gray-300/50" : "bg-surface-dim text-on-surface-variant hover:text-on-surface")}
          >
            SLV
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-on-surface-variant text-sm font-medium mb-1">Per Ounce (USD)</div>
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-display font-bold text-on-background tracking-tighter">
            {formatCurrency(activePrices.ounce.price)}
          </span>
        </div>
        <div className={cn(
          "flex items-center gap-1 font-mono text-sm mt-2",
          activePrices.ounce.change >= 0 ? "text-success" : "text-danger"
        )}>
          {activePrices.ounce.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {activePrices.ounce.change >= 0 ? '+' : ''}{formatCurrency(activePrices.ounce.changeAmt)} ({activePrices.ounce.change.toFixed(2)}%)
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow">
        <div className="glass-panel bg-surface-dim rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs text-on-surface-variant mb-1">Per Gram</span>
          <span className="text-lg font-mono font-semibold text-on-surface">{formatCurrency(activePrices.gram.price)}</span>
        </div>
        <div className="glass-panel bg-surface-dim rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs text-on-surface-variant mb-1">Per Tola</span>
          <span className="text-lg font-mono font-semibold text-on-surface">{formatCurrency(activePrices.tola.price)}</span>
        </div>
        <div className="glass-panel bg-surface-dim text-on-surface-variant rounded-xl p-4 flex flex-col justify-center col-span-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-xs uppercase tracking-wider">Day Range</span>
          </div>
          <div className="flex items-center justify-between font-mono text-xs text-on-surface mt-2">
            <span>{formatCurrency(activePrices.ounce.low!)}</span>
            <div className="h-1 flex-grow mx-3 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-transparent via-primary to-transparent w-full opacity-50 relative">
                <div className="absolute top-0 right-[30%] w-2 h-full bg-primary overflow-hidden rounded-full"></div>
              </div>
            </div>
            <span>{formatCurrency(activePrices.ounce.high!)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
