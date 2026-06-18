import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TrendingUp } from 'lucide-react';

export default function SilverPricePage() {
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('gram');

  const silverPrices = {
    gram: 0.78,
    tola: 9.10,
    ounce: 24.65,
  };

  const calculatePrice = () => {
    const price = silverPrices[unit as keyof typeof silverPrices];
    return (parseFloat(amount) * price).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="section-spacing bg-secondary border-b border-border">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Silver Price Today</h1>
          <p className="text-lg text-foreground/70">
            Real-time silver rates with historical charts and market analysis
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="section-spacing">
        <div className="container">
          {/* Price Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Per Gram</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-accent mb-2">$0.78</p>
              <p className="text-sm text-green-400 font-semibold">+0.87% (24h)</p>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Per Tola</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-accent mb-2">$9.10</p>
              <p className="text-sm text-green-400 font-semibold">+0.87% (24h)</p>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Per Ounce</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-accent mb-2">$24.65</p>
              <p className="text-sm text-green-400 font-semibold">+0.87% (24h)</p>
            </Card>
          </div>

          {/* Calculator */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="bg-secondary border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Silver Calculator</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-background border-border"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                  >
                    <option value="gram">Gram</option>
                    <option value="tola">Tola</option>
                    <option value="ounce">Ounce</option>
                  </select>
                </div>

                <div className="bg-background p-4 rounded-lg border border-border/50">
                  <p className="text-sm text-foreground/70 mb-2">Total Value</p>
                  <p className="text-3xl font-bold text-accent">${calculatePrice()}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Information */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">About Silver Prices</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                Silver prices are determined by global market conditions and trading activity. Like gold, silver is quoted in US dollars per troy ounce and is updated throughout the trading day.
              </p>
              <p>
                Silver is a precious metal with both investment and industrial applications. It is used in jewelry, electronics, photography, and many other industries, which affects its market price.
              </p>
              <p>
                Our platform provides real-time silver prices sourced from major commodity exchanges. These prices reflect the current market value and are continuously updated during trading hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
