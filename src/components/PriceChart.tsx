import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MARKET_DATA } from '../lib/data';
import { formatCurrency } from '../lib/utils';
import { useState } from 'react';

export function PriceChart() {
  const [asset, setAsset] = useState<'btc' | 'gold' | 'silver'>('btc');
  
  const data = asset === 'btc' ? MARKET_DATA.chartData.btc1D : asset === 'gold' ? MARKET_DATA.chartData.gold1D : MARKET_DATA.chartData.silver1D;
  const gradientId = `colorPrice-${asset}`;
  const color = asset === 'btc' ? '#FFD700' : asset === 'gold' ? '#E8B923' : '#C0C0C0';

  return (
    <div className="glass-panel p-6 rounded-2xl w-full h-full min-h-[400px] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 chart-grid-bg opacity-40 z-0"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 z-10 relative">
        <div>
          <h2 className="text-xl font-display font-bold text-on-background">Market Performance</h2>
          <p className="text-sm text-on-surface-variant">Real-time valuation index</p>
        </div>
        
        <div className="flex flex-wrap mt-4 sm:mt-0 glass-panel p-1 rounded-lg gap-1">
          <button 
            onClick={() => setAsset('btc')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${asset === 'btc' ? 'bg-primary text-black' : 'text-on-surface hover:text-on-background hover:bg-surface-highlight'}`}
          >
            Bitcoin (BTC)
          </button>
          <button 
            onClick={() => setAsset('gold')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${asset === 'gold' ? 'bg-primary text-black' : 'text-on-surface hover:text-on-background hover:bg-surface-highlight'}`}
          >
            Gold (XAU)
          </button>
          <button 
            onClick={() => setAsset('silver')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${asset === 'silver' ? 'bg-primary text-black' : 'text-on-surface hover:text-on-background hover:bg-surface-highlight'}`}
          >
            Silver (XAG)
          </button>
        </div>
      </div>

      <div className="flex-grow w-full z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              tickFormatter={(val) => `$${val.toLocaleString()}`}
              width={70}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0a0a0a', 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#ffffff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ color: '#FFD700', fontWeight: 'bold' }}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              formatter={(value: number) => [formatCurrency(value), 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#${gradientId})`} 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
