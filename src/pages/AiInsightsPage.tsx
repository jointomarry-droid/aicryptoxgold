import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';
import { BrainCircuit, RefreshCw, TrendingUp, TrendingDown, Zap, Shield, AlertTriangle, BarChart3, Target, Sparkles } from 'lucide-react';
import { formatCurrency, formatNumber, cn } from '../lib/utils';

interface Insight {
  title: string;
  description: string;
  type: 'bullish' | 'bearish' | 'neutral' | 'warning';
  metric?: string;
  value?: string;
}

interface MarketData {
  btc: { price: number; change24h: number; change7d: number; volume: number; marketCap: number };
  eth: { price: number; change24h: number; change7d: number };
  fearGreed: { value: number; classification: string };
  global: { totalMarketCap: number; btcDominance: number; totalVolume: number };
}

export function AiInsightsPage() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchData = async () => {
    try {
      const [markets, fearGreed, global] = await Promise.allSettled([
        axios.get('/api/coingecko/markets', { params: { vs_currency: 'usd', per_page: '2' }, timeout: 10000 }),
        axios.get('/api/coingecko/fear-greed', { timeout: 10000 }),
        axios.get('/api/coingecko/global', { timeout: 10000 }),
      ]);

      const coins = markets.status === 'fulfilled' ? markets.value.data : [];
      const btc = coins[0] || {};
      const eth = coins[1] || {};
      const fg = fearGreed.status === 'fulfilled' ? fearGreed.value.data : { value: '50', classification: 'Neutral' };
      const gl = global.status === 'fulfilled' ? global.value.data?.data : {};

      setData({
        btc: { price: btc.current_price || 65000, change24h: btc.price_change_percentage_24h || 0, change7d: btc.price_change_percentage_7d_in_currency || 0, volume: btc.total_volume || 0, marketCap: btc.market_cap || 0 },
        eth: { price: eth.current_price || 3500, change24h: eth.price_change_percentage_24h || 0, change7d: eth.price_change_percentage_7d_in_currency || 0 },
        fearGreed: { value: parseInt(fg.value || '50'), classification: fg.classification || 'Neutral' },
        global: { totalMarketCap: gl?.total_market_cap?.usd || 0, btcDominance: gl?.market_cap_percentage?.btc || 50, totalVolume: gl?.total_volume?.usd || 0 },
      });
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Insights fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateInsights = (d: MarketData): Insight[] => {
    const insights: Insight[] = [];

    if (d.fearGreed.value < 25) insights.push({ title: 'Extreme Fear Detected', description: `Fear & Greed Index at ${d.fearGreed.value} (${d.fearGreed.classification}). Historically, extreme fear has been a strong accumulation signal for long-term investors.`, type: 'bullish', metric: 'Fear & Greed', value: `${d.fearGreed.value} — ${d.fearGreed.classification}` });
    else if (d.fearGreed.value > 75) insights.push({ title: 'Extreme Greed Warning', description: `Fear & Greed at ${d.fearGreed.value} (${d.fearGreed.classification}). Markets may be overheated — consider taking partial profits or tightening stop-losses.`, type: 'warning', metric: 'Fear & Greed', value: `${d.fearGreed.value} — ${d.fearGreed.classification}` });
    else insights.push({ title: 'Market Sentiment Neutral', description: `Fear & Greed at ${d.fearGreed.value} (${d.fearGreed.classification}). Markets are balanced — good for range-bound strategies.`, type: 'neutral', metric: 'Fear & Greed', value: `${d.fearGreed.value} — ${d.fearGreed.classification}` });

    if (d.btc.change7d > 10) insights.push({ title: 'BTC Strong Weekly Momentum', description: `Bitcoin up ${d.btc.change7d.toFixed(1)}% this week. Strong momentum suggests continuation, but watch for pullbacks to key support.`, type: 'bullish', metric: 'BTC 7d Change', value: `+${d.btc.change7d.toFixed(1)}%` });
    else if (d.btc.change7d < -10) insights.push({ title: 'BTC Under Heavy Selling Pressure', description: `Bitcoin down ${Math.abs(d.btc.change7d).toFixed(1)}% this week. Consider reducing exposure and waiting for stabilization signals.`, type: 'bearish', metric: 'BTC 7d Change', value: `${d.btc.change7d.toFixed(1)}%` });
    else insights.push({ title: 'BTC Consolidating', description: `Bitcoin showing ${d.btc.change7d >= 0 ? 'modest gains' : 'slight losses'} of ${d.btc.change7d.toFixed(1)}% this week. Key breakout/breakdown levels to watch.`, type: 'neutral', metric: 'BTC 7d Change', value: `${d.btc.change7d >= 0 ? '+' : ''}${d.btc.change7d.toFixed(1)}%` });

    if (d.eth.change24h > d.btc.change24h + 2) insights.push({ title: 'ETH Outperforming BTC', description: `Ethereum gaining ${d.eth.change24h.toFixed(1)}% vs BTC's ${d.btc.change24h.toFixed(1)}% today. Potential alt-season rotation signal.`, type: 'bullish', metric: 'ETH vs BTC', value: `ETH +${d.eth.change24h.toFixed(1)}% / BTC +${d.btc.change24h.toFixed(1)}%` });

    if (d.global.btcDominance > 58) insights.push({ title: 'High BTC Dominance', description: `BTC dominance at ${d.global.btcDominance.toFixed(1)}%. Capital flowing into Bitcoin — altcoins may underperform until dominance peaks.`, type: 'neutral', metric: 'BTC Dominance', value: `${d.global.btcDominance.toFixed(1)}%` });
    else if (d.global.btcDominance < 45) insights.push({ title: 'Low BTC Dominance — Alt Season?', description: `BTC dominance at ${d.global.btcDominance.toFixed(1)}%. Capital rotating into altcoins — look for quality projects with strong fundamentals.`, type: 'bullish', metric: 'BTC Dominance', value: `${d.global.btcDominance.toFixed(1)}%` });

    const mcapT = d.global.totalMarketCap / 1e12;
    insights.push({ title: 'Global Market Overview', description: `Total crypto market cap stands at $${mcapT.toFixed(2)}T with 24h volume of $${formatNumber(d.global.totalVolume)}.`, type: 'neutral', metric: 'Market Cap', value: `$${mcapT.toFixed(2)}T` });

    if (d.btc.change7d > 5 && d.eth.change7d > 8) insights.push({ title: 'Risk-On Environment', description: 'Both BTC and ETH showing strong weekly gains. Market conditions favor risk-on positioning with selective altcoin exposure.', type: 'bullish' });
    else if (d.btc.change7d < -5 && d.eth.change7d < -8) insights.push({ title: 'Risk-Off Signal', description: 'Broad market decline across major assets. Consider defensive positioning, stablecoins, or hedging strategies.', type: 'bearish' });

    return insights;
  };

  const insights = data ? generateInsights(data) : [];

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'bullish': return 'border-emerald-500/30 bg-emerald-500/5';
      case 'bearish': return 'border-red-500/30 bg-red-500/5';
      case 'warning': return 'border-orange-500/30 bg-orange-500/5';
      default: return 'border-outline bg-surface-dim/50';
    }
  };
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp size={18} className="text-emerald-400" />;
      case 'bearish': return <TrendingDown size={18} className="text-red-400" />;
      case 'warning': return <AlertTriangle size={18} className="text-orange-400" />;
      default: return <Zap size={18} className="text-blue-400" />;
    }
  };

  return (
    <Layout>
      <SEO title="AI Insights" />
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-xl"><BrainCircuit className="text-purple-400" size={24} /></div>
              <div>
                <h1 className="text-2xl font-display font-bold text-on-background">AI Insights</h1>
                <p className="text-sm text-on-surface-variant">Intelligent market analysis — {lastUpdate && `Updated ${lastUpdate}`}</p>
              </div>
            </div>
            <button onClick={fetchData} className="p-2 rounded-lg hover:bg-surface-highlight transition-colors">
              <RefreshCw size={16} className={cn("text-on-surface-variant", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {loading && !data ? (
          <div className="glass-panel rounded-2xl p-16 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant">Analyzing market data...</p>
          </div>
        ) : data && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="BTC Price" value={formatCurrency(data.btc.price)} change={data.btc.change24h} />
              <StatCard label="ETH Price" value={formatCurrency(data.eth.price)} change={data.eth.change24h} />
              <StatCard label="Market Cap" value={`$${(data.global.totalMarketCap / 1e12).toFixed(2)}T`} />
              <StatCard label="Fear & Greed" value={`${data.fearGreed.value}`} extra={data.fearGreed.classification} />
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-purple-400" />
                <h2 className="text-lg font-display font-bold text-on-background">Market Intelligence</h2>
              </div>
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className={cn("p-4 rounded-xl border transition-all", getInsightStyle(insight.type))}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-on-background text-sm">{insight.title}</h4>
                          {insight.value && <span className="text-xs font-mono text-on-surface-variant shrink-0">{insight.value}</span>}
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4"><Target size={16} className="text-primary" /><h3 className="text-lg font-display font-bold text-on-background">Key Levels — BTC</h3></div>
                <div className="space-y-3">
                  {[
                    { label: 'Resistance 3', price: data.btc.price * 1.15, color: 'text-red-400' },
                    { label: 'Resistance 2', price: data.btc.price * 1.10, color: 'text-red-400' },
                    { label: 'Resistance 1', price: data.btc.price * 1.05, color: 'text-red-300' },
                    { label: 'Current Price', price: data.btc.price, color: 'text-primary font-bold' },
                    { label: 'Support 1', price: data.btc.price * 0.95, color: 'text-emerald-300' },
                    { label: 'Support 2', price: data.btc.price * 0.90, color: 'text-emerald-400' },
                    { label: 'Support 3', price: data.btc.price * 0.85, color: 'text-emerald-400' },
                  ].map((lvl) => (
                    <div key={lvl.label} className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">{lvl.label}</span>
                      <span className={cn("font-mono text-sm", lvl.color)}>{formatCurrency(lvl.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4"><Shield size={16} className="text-primary" /><h3 className="text-lg font-display font-bold text-on-background">Market Summary</h3></div>
                <div className="space-y-3">
                  {[
                    { label: 'BTC Dominance', value: `${data.global.btcDominance.toFixed(1)}%` },
                    { label: '24h Global Volume', value: `$${formatNumber(data.global.totalVolume)}` },
                    { label: 'BTC 24h Change', value: `${data.btc.change24h >= 0 ? '+' : ''}${data.btc.change24h.toFixed(2)}%`, color: data.btc.change24h >= 0 ? 'text-emerald-400' : 'text-red-400' },
                    { label: 'BTC 7d Change', value: `${data.btc.change7d >= 0 ? '+' : ''}${data.btc.change7d.toFixed(2)}%`, color: data.btc.change7d >= 0 ? 'text-emerald-400' : 'text-red-400' },
                    { label: 'ETH 24h Change', value: `${data.eth.change24h >= 0 ? '+' : ''}${data.eth.change24h.toFixed(2)}%`, color: data.eth.change24h >= 0 ? 'text-emerald-400' : 'text-red-400' },
                    { label: 'ETH 7d Change', value: `${data.eth.change7d >= 0 ? '+' : ''}${data.eth.change7d.toFixed(2)}%`, color: data.eth.change7d >= 0 ? 'text-emerald-400' : 'text-red-400' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">{item.label}</span>
                      <span className={cn("font-mono text-sm", item.color || "text-on-background")}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

function StatCard({ label, value, change, extra }: { label: string; value: string; change?: number; extra?: string }) {
  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="text-xs text-on-surface-variant mb-1">{label}</div>
      <div className="text-xl font-mono font-bold text-on-background">{value}</div>
      {change !== undefined && (
        <div className={cn("text-xs font-mono mt-1 flex items-center gap-1", change >= 0 ? "text-emerald-400" : "text-red-400")}>
          {change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </div>
      )}
      {extra && <div className="text-xs text-on-surface-variant mt-1">{extra}</div>}
    </div>
  );
}
