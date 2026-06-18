import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

interface Crypto {
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume: string;
}

const cryptoList: Crypto[] = [
  { rank: 1, name: 'Bitcoin', symbol: 'BTC', price: 67543.21, change24h: 3.45, marketCap: '$1.32T', volume: '$28.5B' },
  { rank: 2, name: 'Ethereum', symbol: 'ETH', price: 3521.87, change24h: 2.18, marketCap: '$423B', volume: '$15.2B' },
  { rank: 3, name: 'BNB', symbol: 'BNB', price: 612.45, change24h: 1.92, marketCap: '$93.5B', volume: '$1.8B' },
  { rank: 4, name: 'Solana', symbol: 'SOL', price: 178.32, change24h: 4.67, marketCap: '$82.1B', volume: '$3.2B' },
  { rank: 5, name: 'XRP', symbol: 'XRP', price: 2.45, change24h: -1.23, marketCap: '$132B', volume: '$2.1B' },
  { rank: 6, name: 'Cardano', symbol: 'ADA', price: 0.98, change24h: 2.34, marketCap: '$35B', volume: '$850M' },
  { rank: 7, name: 'Polkadot', symbol: 'DOT', price: 8.23, change24h: 1.56, marketCap: '$12.5B', volume: '$420M' },
  { rank: 8, name: 'Litecoin', symbol: 'LTC', price: 89.45, change24h: 0.87, marketCap: '$14.2B', volume: '$1.2B' },
];

export default function CryptoPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = cryptoList.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="section-spacing bg-secondary border-b border-border">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cryptocurrency Rankings
          </h1>
          <p className="text-lg text-foreground/70 mb-8">
            Track the top 50+ cryptocurrencies with real-time prices and market data
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <Input
              placeholder="Search by name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="section-spacing">
        <div className="container">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground/70">Rank</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground/70">Name</th>
                  <th className="text-right py-4 px-4 font-semibold text-foreground/70">Price</th>
                  <th className="text-right py-4 px-4 font-semibold text-foreground/70">24h Change</th>
                  <th className="text-right py-4 px-4 font-semibold text-foreground/70">Market Cap</th>
                  <th className="text-right py-4 px-4 font-semibold text-foreground/70">Volume</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((crypto) => {
                  const isPositive = crypto.change24h >= 0;
                  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

                  return (
                    <tr
                      key={crypto.rank}
                      className="border-b border-border/50 hover:bg-secondary/50 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-foreground font-semibold">#{crypto.rank}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-foreground">{crypto.name}</p>
                          <p className="text-sm text-foreground/60">{crypto.symbol}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-accent">
                        ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TrendIcon className={`w-4 h-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
                          <span className={isPositive ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                            {isPositive ? '+' : ''}{crypto.change24h.toFixed(2)}%
                          </span>
                        </div>
                      </td>\n                      <td className="py-4 px-4 text-right text-foreground/80">{crypto.marketCap}</td>
                      <td className="py-4 px-4 text-right text-foreground/80">{crypto.volume}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/70 mb-4">No cryptocurrencies found matching your search.</p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className="border-accent text-accent hover:bg-accent/10"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
