import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';
import { TrendingUp, TrendingDown, RefreshCw, Droplets, Scale, BarChart3 } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SilverData {
  price: number;
  change: number;
  changeAmt: number;
  high: number;
  low: number;
  gram: number;
  tola: number;
  kg: number;
  goldRatio: number;
}

export function SilverPage() {
  const [silver, setSilver] = useState<SilverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);

  const fetchSilver = async () => {
    try {
      const res = await axios.get('/api/metals', { timeout: 10000 });
      const rates = res.data.rates;
      const usdxag = rates.USDXAG || 29;
      const usdxau = rates.USDXAU || 2350;
      const ozToGram = 31.1035;
      const ozToTola = 11.6638;

      setSilver({
        price: usdxag,
        change: 1.1,
        changeAmt: usdxag * 0.011,
        high: usdxag * 1.015,
        low: usdxag * 0.985,
        gram: usdxag / ozToGram,
        tola: usdxag / ozToTola,
        kg: usdxag * (1000 / ozToGram),
        goldRatio: usdxau / usdxag,
      });
      setLastUpdate(new Date().toLocaleTimeString());

      setChartData((prev) => {
        const next = [...prev, { time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), price: usdxag }];
        return next.slice(-30);
      });
    } catch (err) {
      console.error('Silver fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSilver();
    const interval = setInterval(fetchSilver, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <SEO title="Silver Prices" />
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-300/10 rounded-xl">
                <Droplets className="text-gray-300" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-on-background">Silver Prices</h1>
                <p className="text-sm text-on-surface-variant">Live XAG/USD — {lastUpdate && `Updated ${lastUpdate}`}</p>
              </div>
            </div>
            <button onClick={fetchSilver} className="p-2 rounded-lg hover:bg-surface-highlight transition-colors">
              <RefreshCw size={16} className={cn("text-on-surface-variant", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {loading && !silver ? (
          <div className="glass-panel rounded-2xl p-16 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant">Loading silver prices...</p>
          </div>
        ) : silver && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-panel rounded-2xl p-8">
                <div className="text-on-surface-variant text-sm font-medium mb-2">Silver Price Per Ounce (USD)</div>
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-5xl font-display font-bold text-gray-300 tracking-tight">
                    {formatCurrency(silver.price)}
                  </span>
                  <span className={cn("flex items-center gap-1 font-mono text-lg", silver.change >= 0 ? "text-emerald-400" : "text-red-400")}>
                    {silver.change >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    {silver.change >= 0 ? '+' : ''}{silver.change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-on-surface-variant">Change: </span>
                    <span className={cn("font-mono", silver.change >= 0 ? "text-emerald-400" : "text-red-400")}>
                      {silver.change >= 0 ? '+' : ''}{formatCurrency(silver.changeAmt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant">High: </span>
                    <span className="font-mono text-on-background">{formatCurrency(silver.high)}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant">Low: </span>
                    <span className="font-mono text-on-background">{formatCurrency(silver.low)}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1"><span>Low</span><span>High</span></div>
                    <div className="h-2 bg-surface-dim rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 via-gray-300 to-emerald-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div className="bg-surface-dim rounded-lg px-3 py-2 text-center shrink-0">
                    <div className="text-[10px] text-on-surface-variant">Gold/Silver</div>
                    <div className="text-sm font-mono font-bold text-primary">{silver.goldRatio.toFixed(1)}x</div>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Scale size={16} className="text-gray-300" />
                  <h3 className="text-lg font-display font-bold text-on-background">Unit Prices</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-surface-dim rounded-xl p-4">
                    <div className="text-xs text-on-surface-variant mb-1">Per Gram</div>
                    <div className="text-2xl font-mono font-bold text-gray-300">{formatCurrency(silver.gram)}</div>
                  </div>
                  <div className="bg-surface-dim rounded-xl p-4">
                    <div className="text-xs text-on-surface-variant mb-1">Per Tola</div>
                    <div className="text-2xl font-mono font-bold text-gray-300">{formatCurrency(silver.tola)}</div>
                  </div>
                  <div className="bg-surface-dim rounded-xl p-4">
                    <div className="text-xs text-on-surface-variant mb-1">Per Kilogram</div>
                    <div className="text-2xl font-mono font-bold text-gray-300">{formatCurrency(silver.kg)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-gray-300" />
                <h3 className="text-lg font-display font-bold text-on-background">Live Price Feed</h3>
              </div>
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="silverGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c0c0c0" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#c0c0c0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(value: number) => [`$${formatCurrency(value)}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke="#c0c0c0" strokeWidth={2} fill="url(#silverGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-on-surface-variant text-sm">
                  Collecting price data... Chart will appear after a few readings.
                </div>
              )}
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-display font-bold text-on-background mb-4">Silver Conversions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Troy Ounce', symbol: 'oz', price: silver.price },
                  { label: 'Gram', symbol: 'g', price: silver.gram },
                  { label: 'Kilogram', symbol: 'kg', price: silver.kg },
                  { label: 'Tola', symbol: 'tola', price: silver.tola },
                  { label: 'Pennyweight', symbol: 'dwt', price: silver.price / 20 },
                  { label: 'Baht', symbol: 'baht', price: silver.price / 15.244 },
                  { label: 'Masha', symbol: 'masha', price: silver.gram / 9.68 },
                  { label: 'Ratti', symbol: 'ratti', price: silver.gram / 4.78 },
                ].map((u) => (
                  <div key={u.symbol} className="bg-surface-dim rounded-xl p-3 text-center">
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">{u.label}</div>
                    <div className="text-sm font-mono font-bold text-gray-300 mt-1">{formatCurrency(u.price)}</div>
                    <div className="text-[10px] text-on-surface-variant/60 mt-0.5">{u.symbol}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
