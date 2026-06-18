import { Layout } from '../components/Layout';
import { Newspaper } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

export function BlogPage() {
  const posts = [
    { title: "The Future of AI in Market Prediction", date: "June 12, 2026", snippet: "How quantum neural networks are reshaping algorithmic trading and what it means for retail investors.", link: "/blog/future-of-ai-in-market-prediction" },
    { title: "Gold vs. Bitcoin: The Inflation Hedge Debate", date: "June 5, 2026", snippet: "An in-depth look at historical data and AI predictive models comparing traditional safe havens with digital assets.", link: "/blog/gold-vs-bitcoin-inflation-hedge" },
    { title: "Understanding Decentralized Finance (DeFi)", date: "May 28, 2026", snippet: "A beginner's guide to the mechanics of liquidity pools, staking, and the future of banking.", link: "#" }
  ];

  return (
    <Layout>
      <SEO title="Blog" />
      <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[60vh]">
        <div className="flex items-center gap-3 mb-8 border-b border-outline pb-6">
          <div className="p-3 bg-surface-highlight rounded-xl">
            <Newspaper className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-on-background">Market Intelligence Blog</h1>
            <p className="text-on-surface-variant text-sm mt-1">Insights, analysis, and opinion from our expert team.</p>
          </div>
        </div>
        
        <div className="grid gap-6">
          {posts.map((post, idx) => (
            <Link to={post.link} key={idx} className="block group">
              <article className="p-6 bg-surface-dim rounded-xl border border-outline group-hover:border-primary/50 transition-colors h-full flex flex-col">
                <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">{post.date}</span>
                <h2 className="text-xl font-bold text-on-background mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed flex-grow">{post.snippet}</p>
                <div className="text-sm font-semibold text-primary mt-auto">Read Full Article &rarr;</div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
