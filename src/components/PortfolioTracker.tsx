import React, { useState, useEffect } from 'react';
import { useMetalsMarket } from '../hooks/useMetalsMarket';
import { formatCurrency } from '../lib/utils';
import { Wallet, Coins } from 'lucide-react';
import { cn } from '../lib/utils';

interface Holdings {
  gold: number;
  silver: number;
}

export function PortfolioTracker() {
  const { goldPrices, silverPrices, isLoading } = useMetalsMarket();
  
  const [holdings, setHoldings] = useState<Holdings>(() => {
    try {
      const saved = localStorage.getItem('portfolioTrackerHoldings');
      return saved ? JSON.parse(saved) : { gold: 0, silver: 0 };
    } catch {
      return { gold: 0, silver: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem('portfolioTrackerHoldings', JSON.stringify(holdings));
  }, [holdings]);

  const goldValue = holdings.gold * (goldPrices?.ounce?.price || 0);
  const silverValue = holdings.silver * (silverPrices?.ounce?.price || 0);
  const totalValue = goldValue + silverValue;

  return (
    <div className="glass-panel p-6 rounded-2xl bg-surface relative overflow-hidden flex flex-col h-full border border-outline shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Wallet size={20} />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-on-background">Portfolio Tracker</h2>
          <p className="text-sm text-on-surface-variant">Live asset valuation</p>
        </div>
      </div>

      <div className="mb-8 p-5 bg-surface-dim border border-outline rounded-xl flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-on-surface-variant mb-1">Total Balance (USD)</div>
          <div className="text-3xl font-display font-bold text-on-background tracking-tighter">
            {isLoading ? <span className="animate-pulse w-32 h-8 bg-surface-highlight rounded inline-block"></span> : formatCurrency(totalValue)}
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-outline focus-within:border-primary/50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0 border border-yellow-500/20">
            <Coins size={20} />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-on-background">Gold Value</span>
              <span className="text-sm font-mono font-medium text-on-surface">{isLoading ? '---' : formatCurrency(goldValue)}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={holdings.gold || ''}
                onChange={(e) => setHoldings({ ...holdings, gold: parseFloat(e.target.value) || 0 })}
                className="w-full bg-surface-dim border border-outline rounded-lg px-3 py-2 text-sm text-on-background focus:outline-none focus:border-primary transition-colors font-mono"
                placeholder="0.00"
              />
              <span className="text-xs font-bold text-on-surface-variant uppercase w-8">oz</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-outline focus-within:border-gray-400/50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-gray-400/10 flex items-center justify-center text-gray-400 shrink-0 border border-gray-400/20">
            <Coins size={20} />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-on-background">Silver Value</span>
              <span className="text-sm font-mono font-medium text-on-surface">{isLoading ? '---' : formatCurrency(silverValue)}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={holdings.silver || ''}
                onChange={(e) => setHoldings({ ...holdings, silver: parseFloat(e.target.value) || 0 })}
                className="w-full bg-surface-dim border border-outline rounded-lg px-3 py-2 text-sm text-on-background focus:outline-none focus:border-gray-400 transition-colors font-mono"
                placeholder="0.00"
              />
              <span className="text-xs font-bold text-on-surface-variant uppercase w-8">oz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
