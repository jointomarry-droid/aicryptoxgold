import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Coins, Gem, Droplets } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface HeroData {
  btc: { price: number; change: number };
  gold: { price: number; change: number };
  silver: { price: number; change: number };
  fearGreed: number;
}

export function Hero() {
  const [data, setData] = useState<HeroData | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [metalsRes, btcRes, fgRes] = await Promise.allSettled([
        axios.get('/api/metals', { timeout: 8000 }),
        axios.get('/api/coingecko/markets', { params: { vs_currency: 'usd', per_page: '1' }, timeout: 8000 }),
        axios.get('/api/coingecko/fear-greed', { timeout: 8000 }),
      ]);

      const metals = metalsRes.status === 'fulfilled' ? metalsRes.value.data.rates : {};
      const btc = btcRes.status === 'fulfilled' ? btcRes.value.data[0] : null;
      const fg = fgRes.status === 'fulfilled' ? parseInt(fgRes.value.data?.value || '50') : 50;

      setData({
        btc: { price: btc?.current_price || metals.USDBTC || 65000, change: btc?.price_change_percentage_24h || 0 },
        gold: { price: metals.USDXAU || 2350, change: 0.68 },
        silver: { price: metals.USDXAG || 29, change: 1.1 },
        fearGreed: fg,
      });
    } catch {}
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 p-6 rounded-2xl bg-surface border border-outline relative overflow-hidden shadow-lg flex flex-col justify-between">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary blur-[100px] opacity-20 pointer-events-none" />
      <div>
        <h1 className="text-3xl xl:text-[2.2rem] font-bold leading-[1.1] mb-2 text-on-background">
          AI-Powered <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">Market Intelligence</span>
        </h1>
        <p className="text-on-surface-variant text-xs mb-5 leading-relaxed">
          Real-time tracking of Crypto, Gold & Silver with neural network price predictions.
        </p>
      </div>

      {data ? (
        <div className="space-y-2.5 mb-5">
          <LiveRow icon={<Coins size={14} />} label="BTC" price={formatCurrency(data.btc.price)} change={data.btc.change} onClick={() => navigate('/crypto')} />
          <LiveRow icon={<Gem size={14} />} label="Gold" price={formatCurrency(data.gold.price)} change={data.gold.change} onClick={() => navigate('/gold')} />
          <LiveRow icon={<Droplets size={14} />} label="Silver" price={formatCurrency(data.silver.price)} change={data.silver.change} onClick={() => navigate('/silver')} />
          <div className="flex items-center justify-between px-3 py-2 bg-surface-dim rounded-lg">
            <span className="text-[11px] text-on-surface-variant">Fear & Greed</span>
            <span className={cn("text-sm font-bold font-mono", data.fearGreed > 60 ? 'text-orange-400' : data.fearGreed < 40 ? 'text-blue-400' : 'text-on-background')}>
              {data.fearGreed}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 mb-5">
          {[1, 2, 3].map(i => <div key={i} className="h-9 bg-surface-dim rounded-lg animate-pulse" />)}
        </div>
      )}

      <div className="flex flex-col gap-2 mt-auto">
        <button onClick={() => navigate('/insights')} className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-dark text-black text-sm font-bold rounded-xl shadow-[0_4px_14px_rgba(255,215,0,0.2)] hover:shadow-[0_6px_20px_rgba(255,215,0,0.3)] transition-all">
          Explore AI Insights
        </button>
        <button onClick={() => navigate('/crypto')} className="w-full py-2.5 bg-surface-dim border border-outline text-on-background text-sm font-bold rounded-xl hover:bg-surface-bright transition-colors">
          Live Rankings
        </button>
      </div>
    </div>
  );
}

function LiveRow({ icon, label, price, change, onClick }: { icon: React.ReactNode; label: string; price: string; change: number; onClick: () => void }) {
  const up = change >= 0;
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-3 py-2 bg-surface-dim rounded-lg hover:bg-surface-highlight transition-colors group">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <span className="text-[11px] font-medium text-on-surface-variant group-hover:text-on-background transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono font-bold text-on-background">{price}</span>
        <span className={cn("text-[10px] font-mono font-medium", up ? "text-emerald-400" : "text-red-400")}>
          {up ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
    </button>
  );
}
