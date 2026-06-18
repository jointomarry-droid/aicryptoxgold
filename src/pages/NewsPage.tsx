import { Layout } from '../components/Layout';
import { Globe } from 'lucide-react';
import { SEO } from '../components/SEO';

export function NewsPage() {
  const news = [
    { source: "Bloomberg", time: "2 hours ago", title: "Global Markets React to New AI Regulatory Frameworks", tag: "Macro" },
    { source: "CoinDesk", time: "4 hours ago", title: "Bitcoin Surges Past $64k Resistance on Institutional Buying", tag: "Crypto" },
    { source: "Reuters", time: "6 hours ago", title: "Gold Prices Stabilize Following Central Bank Announcements", tag: "Metals" },
    { source: "TechCrunch", time: "10 hours ago", title: "Decentralized Exchanges See Record Volume Amid CeFi Worries", tag: "DeFi" },
    { source: "Wall Street Journal", time: "12 hours ago", title: "Tech Stocks Rally as AI Market Penetration Reaches New Highs", tag: "Equities" },
    { source: "CNBC", time: "1 day ago", title: "Why Silver is Outperforming Other Precious Metals This Quarter", tag: "Metals" }
  ];

  return (
    <Layout>
      <SEO title="Financial News" />
      <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[60vh]">
        <div className="flex items-center gap-3 mb-8 border-b border-outline pb-6">
          <div className="p-3 bg-surface-highlight rounded-xl">
            <Globe className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-on-background">Financial News</h1>
            <p className="text-on-surface-variant text-sm mt-1">Real-time aggregated global financial headlines.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, idx) => (
            <div key={idx} className="p-5 bg-surface-dim rounded-xl border border-outline hover:bg-surface-highlight hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-on-surface-variant">{item.source} • {item.time}</span>
                <span className="text-[10px] uppercase tracking-wider bg-surface px-2 py-1 rounded text-primary">{item.tag}</span>
              </div>
              <h3 className="text-lg font-bold text-on-background group-hover:text-primary transition-colors leading-tight">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
