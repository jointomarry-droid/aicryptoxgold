import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp } from 'lucide-react';

const GOLD_HERO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663742967331/jJivNg6rbcZxoQt5dAtQnD/gold-precious-metals-hero-RYkY8VgHurpxwNXLJJPuD3.webp';

export default function GoldPricePage() {
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('gram');

  const goldPrices = {
    gram: 67.50,
    tola: 787.50,
    ounce: 2087.50,
  };

  const calculatePrice = () => {
    const price = goldPrices[unit as keyof typeof goldPrices];
    return (parseFloat(amount) * price).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img
          src={GOLD_HERO}
          alt="Gold Prices"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Gold Price Today</h1>
            <p className="text-lg text-gray-200">Real-time gold rates with historical charts and analysis</p>
          </div>
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
              <p className="text-3xl font-bold text-accent mb-2">$67.50</p>
              <p className="text-sm text-green-400 font-semibold">+1.23% (24h)</p>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Per Tola</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-accent mb-2">$787.50</p>
              <p className="text-sm text-green-400 font-semibold">+1.23% (24h)</p>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Per Ounce</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-accent mb-2">$2,087.50</p>
              <p className="text-sm text-green-400 font-semibold">+1.23% (24h)</p>
            </Card>
          </div>

          {/* Calculator */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="bg-secondary border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Gold Calculator</h2>
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
            <h2 className="text-2xl font-bold text-foreground mb-6">About Gold Prices</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                Gold prices are determined by global market supply and demand. The price of gold is quoted in US dollars per troy ounce and is updated throughout the trading day based on activity in the spot market.
              </p>
              <p>
                Gold is typically measured in different units depending on the region and use case. The most common units are grams, tolas (used in South Asia), and troy ounces (used internationally).
              </p>
              <p>
                Our platform provides real-time gold prices sourced from major commodity exchanges and financial data providers. These prices reflect the current market value and are updated continuously during trading hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
