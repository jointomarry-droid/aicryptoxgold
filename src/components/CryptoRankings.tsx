import { useMetalsMarket } from '../hooks/useMetalsMarket';
import { formatCurrency, formatNumber, cn } from '../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function CryptoRankings() {
  const { cryptoRankings, isLoading } = useMetalsMarket();

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-surface-highlight">
        <h2 className="text-xl font-display font-bold text-on-background">Top Crypto Assets</h2>
        <p className="text-sm text-on-surface-variant">Ranked by Market Capitalization</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface-dim/50 border-b border-surface-highlight text-on-surface-variant text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Asset</th>
              <th className="px-6 py-4 font-medium text-right">Price</th>
              <th className="px-6 py-4 font-medium text-right">24h Change</th>
              <th className="px-6 py-4 font-medium text-right hidden sm:table-cell">Market Cap</th>
              <th className="px-6 py-4 font-medium text-right hidden md:table-cell">Volume (24h)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-highlight/50">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center justify-center animate-pulse gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div>Loading real-time crypto prices...</div>
                  </div>
                </td>
              </tr>
            ) : cryptoRankings.map((crypto) => {
              const isPositive = crypto.change >= 0;
              return (
                <tr key={crypto.symbol} className="hover:bg-surface-highlight/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center font-bold text-xs text-on-surface group-hover:glow-gold transition-all shadow-inner">
                        {crypto.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-on-background flex items-center gap-2">
                          {crypto.name}
                        </div>
                        <div className="text-xs text-on-surface-variant font-mono">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-on-background">
                    {formatCurrency(crypto.price)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={cn(
                      "inline-flex items-center gap-1 font-medium font-mono text-xs px-2 py-1 rounded bg-opacity-10",
                      isPositive ? "text-success bg-success" : "text-danger bg-danger"
                    )}>
                      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {Math.abs(crypto.change)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-on-surface hidden sm:table-cell">
                    ${formatNumber(crypto.marketCap)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-on-surface-variant hidden md:table-cell">
                    ${formatNumber(crypto.volume)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
