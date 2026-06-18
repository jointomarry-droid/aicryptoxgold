import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'wouter';

interface MarketCard {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap?: string;
  volume?: string;
  icon?: string;
}

const cryptoData: MarketCard[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 67543.21,
    change24h: 3.45,
    marketCap: '$1.32T',
    volume: '$28.5B',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3521.87,
    change24h: 2.18,
    marketCap: '$423B',
    volume: '$15.2B',
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    price: 612.45,
    change24h: 1.92,
    marketCap: '$93.5B',
    volume: '$1.8B',
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    price: 178.32,
    change24h: 4.67,
    marketCap: '$82.1B',
    volume: '$3.2B',
  },
];

const preciousMetalsData: MarketCard[] = [
  {
    id: 'gold',
    name: 'Gold',
    symbol: 'AU',
    price: 2087.50,
    change24h: 1.23,
    marketCap: 'Per Oz',
    volume: 'High',
  },
  {
    id: 'silver',
    name: 'Silver',
    symbol: 'AG',
    price: 24.65,
    change24h: 0.87,
    marketCap: 'Per Oz',
    volume: 'Medium',
  },
];

function MarketCardComponent({ card }: { card: MarketCard }) {
  const isPositive = card.change24h >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="card-glass-dark group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{card.name}</h3>
          <p className="text-sm text-foreground/60">{card.symbol}</p>
        </div>
        <TrendIcon
          className={`w-5 h-5 ${isPositive ? 'text-green-400' : 'text-red-400'}`}
        />
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-accent mb-2">
          ${card.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p
          className={`text-sm font-semibold ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isPositive ? '+' : ''}{card.change24h.toFixed(2)}% (24h)
        </p>
      </div>

      {card.marketCap && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-foreground/70">
            <span>Market Cap</span>
            <span className="text-foreground">{card.marketCap}</span>
          </div>
          {card.volume && (
            <div className="flex justify-between text-foreground/70">
              <span>Volume</span>
              <span className="text-foreground">{card.volume}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LiveMarketDashboard() {
  return (
    <section className="section-spacing bg-background">
      <div className="container">
        {/* Crypto Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Cryptocurrency Market
              </h2>
              <p className="text-foreground/70">
                Real-time prices and market data for top cryptocurrencies
              </p>
            </div>
            <Link href="/crypto">
              <a className="text-accent hover:text-accent/80 font-semibold transition-colors">
                View All →
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cryptoData.map((card) => (
              <MarketCardComponent key={card.id} card={card} />
            ))}
          </div>
        </div>

        {/* Precious Metals Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Precious Metals
              </h2>
              <p className="text-foreground/70">
                Current gold and silver rates with market trends
              </p>
            </div>
            <Link href="/gold-price">
              <a className="text-accent hover:text-accent/80 font-semibold transition-colors">
                View Details →
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preciousMetalsData.map((card) => (
              <MarketCardComponent key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
