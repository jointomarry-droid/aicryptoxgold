import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3, ArrowUpDown, Search, Coins } from 'lucide-react';
import { formatCurrency, formatNumber, cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  high_24h: number;
  low_24h: number;
  sparkline_in_7d: { price: number[] };
}

export function CryptoPage() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change24h' | 'volume'>('market_cap');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [lastUpdate, setLastUpdate] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  const fetchCoins = async () => {
    try {
      const res = await axios.get('/api/coingecko/markets', {
        params: { vs_currency: 'usd', per_page: '50', page: '1' },
        timeout: 15000,
      });
      setCoins(res.data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch coins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchChartData = async (coinId: string) => {
    if (selectedCoin === coinId) { setSelectedCoin(null); return; }
    setSelectedCoin(coinId);
    setChartLoading(true);
    try {
      const res = await axios.get(`/api/coingecko/chart/${coinId}`, {
        params: { vs_currency: 'usd', days: '7' },
        timeout: 10000,
      });
      const prices = res.data.prices || [];
      setChartData(prices.map((p: [number, number]) => ({
        time: new Date(p[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: p[1],
      })));
    } catch (err) {
      console.error('Chart fetch error:', err);
    } finally {
      setChartLoading(false);
    }
  };

  const sorted = [...coins]
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      switch (sortBy) {
        case 'price': return (a.current_price - b.current_price) * dir;
        case 'change24h': return ((a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)) * dir;
        case 'volume': return ((a.total_volume || 0) - (b.total_volume || 0)) * dir;
        default: return ((a.market_cap || 0) - (b.market_cap || 0)) * dir;
      }
    });

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const SortHeader = ({ col, children, className }: { col: typeof sortBy; children: React.ReactNode; className?: string }) => (
    <th
      className={cn("px-4 py-3 font-medium cursor-pointer hover:text-primary transition-colors select-none", className)}
      onClick={() => toggleSort(col)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortBy === col && <ArrowUpDown size={12} className="text-primary" />}
      </span>
    </th>
  );

  return (
    <Layout>
      <SEO title="Crypto Markets" />
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl glow-gold">
                <Coins className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-on-background">Crypto Markets</h1>
                <p className="text-sm text-on-surface-variant">Live prices from CoinGecko — {lastUpdate && `Updated ${lastUpdate}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-surface-dim border border-outline rounded-lg text-sm text-on-background placeholder-on-surface-variant/50 focus:outline-none focus:border-primary/50 w-48"
                />
              </div>
              <button onClick={fetchCoins} className="p-2 rounded-lg hover:bg-surface-highlight transition-colors" title="Refresh">
                <RefreshCw size={16} className={cn("text-on-surface-variant", loading && "animate-spin")} />
              </button>
            </div>
          </div>
        </div>

        {selectedCoin && (
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-on-background flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                {coins.find(c => c.id === selectedCoin)?.name} — 7 Day Chart
              </h3>
              <button onClick={() => setSelectedCoin(null)} className="text-xs text-on-surface-variant hover:text-primary">Close</button>
            </div>
            {chartLoading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${formatNumber(v)}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: number) => [`$${formatCurrency(value)}`, 'Price']}
                  />
                  <Area type="monotone" dataKey="price" stroke="#FFD700" strokeWidth={2} fill="url(#gold)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-dim/50 border-b border-surface-highlight text-on-surface-variant text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium w-12">#</th>
                  <th className="px-4 py-3 font-medium">Coin</th>
                  <SortHeader col="price" className="text-right">Price</SortHeader>
                  <SortHeader col="change24h" className="text-right">1h</SortHeader>
                  <SortHeader col="change24h" className="text-right">24h</SortHeader>
                  <th className="px-4 py-3 font-medium text-right hidden lg:table-cell">7d</th>
                  <SortHeader col="volume" className="text-right hidden md:table-cell">Volume 24h</SortHeader>
                  <SortHeader col="market_cap" className="text-right hidden lg:table-cell">Market Cap</SortHeader>
                  <th className="px-4 py-3 font-medium text-right hidden xl:table-cell">High 24h</th>
                  <th className="px-4 py-3 font-medium text-right hidden xl:table-cell">Low 24h</th>
                  <th className="px-4 py-3 font-medium text-center">7d Chart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-highlight/50">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-16 text-center text-on-surface-variant">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Loading crypto market data...</span>
                      </div>
                    </td>
                  </tr>
                ) : sorted.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-16 text-center text-on-surface-variant">No coins found matching "{search}"</td>
                  </tr>
                ) : (
                  sorted.map((coin, idx) => {
                    const c24 = coin.price_change_percentage_24h || 0;
                    const c7d = coin.price_change_percentage_7d_in_currency || 0;
                    const sparkline = coin.sparkline_in_7d?.price || [];
                    const minS = Math.min(...sparkline);
                    const maxS = Math.max(...sparkline);
                    const rangeS = maxS - minS || 1;
                    const points = sparkline.filter((_, i) => i % Math.max(1, Math.floor(sparkline.length / 40)) === 0)
                      .map((v, i, a) => `${(i / (a.length - 1)) * 100},${100 - ((v - minS) / rangeS) * 100}`)
                      .join(' ');

                    return (
                      <tr key={coin.id} className="hover:bg-surface-highlight/20 transition-colors cursor-pointer" onClick={() => fetchChartData(coin.id)}>
                        <td className="px-4 py-3 text-on-surface-variant font-mono text-xs">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                            <div>
                              <div className="font-semibold text-on-background">{coin.name}</div>
                              <div className="text-xs text-on-surface-variant font-mono uppercase">{coin.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-medium text-on-background">{formatCurrency(coin.current_price)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={cn("text-xs font-mono", c24 >= 0 ? "text-emerald-400" : "text-red-400")}>
                            {c24 >= 0 ? '+' : ''}{c24.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={cn("inline-flex items-center gap-0.5 text-xs font-mono px-2 py-0.5 rounded", c24 >= 0 ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10")}>
                            {c24 >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            {c24 >= 0 ? '+' : ''}{c24.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right hidden lg:table-cell">
                          <span className={cn("text-xs font-mono", c7d >= 0 ? "text-emerald-400" : "text-red-400")}>
                            {c7d >= 0 ? '+' : ''}{c7d.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant hidden md:table-cell">
                          ${formatNumber(coin.total_volume)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-on-surface hidden lg:table-cell">
                          ${formatNumber(coin.market_cap)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-emerald-400 hidden xl:table-cell">
                          {formatCurrency(coin.high_24h)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-red-400 hidden xl:table-cell">
                          {formatCurrency(coin.low_24h)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {sparkline.length > 0 ? (
                            <svg viewBox="0 0 100 100" className="w-20 h-8" preserveAspectRatio="none">
                              <polyline
                                points={points}
                                fill="none"
                                stroke={c7d >= 0 ? '#22c55e' : '#ef4444'}
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                              />
                            </svg>
                          ) : (
                            <span className="text-on-surface-variant text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
