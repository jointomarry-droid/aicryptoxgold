import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';
import { Globe, RefreshCw, ExternalLink, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

interface Article {
  id: number;
  title: string;
  body: string;
  url: string;
  source: string;
  image: string;
  categories: string;
  publishedOn: number;
}

const TAG_COLORS: Record<string, string> = {
  Bitcoin: 'bg-orange-500/20 text-orange-400',
  Ethereum: 'bg-blue-500/20 text-blue-400',
  Defi: 'bg-purple-500/20 text-purple-400',
  Altcoins: 'bg-green-500/20 text-green-400',
  Mining: 'bg-yellow-500/20 text-yellow-400',
  Regulation: 'bg-red-500/20 text-red-400',
  Technology: 'bg-cyan-500/20 text-cyan-400',
  Business: 'bg-primary/20 text-primary',
  Finance: 'bg-emerald-500/20 text-emerald-400',
  'Fintech': 'bg-indigo-500/20 text-indigo-400',
};

export function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');

  const fetchNews = async () => {
    try {
      const res = await axios.get('/api/cryptocompare/news', { timeout: 10000 });
      setArticles(res.data || []);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  const allTags = Array.from(new Set(articles.flatMap(a => (a.categories || '').split('|').map(c => c.trim())).filter(Boolean)));

  const filtered = articles
    .filter(a => {
      const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.body?.toLowerCase().includes(search.toLowerCase());
      const matchTag = activeTag === 'All' || (a.categories || '').toLowerCase().includes(activeTag.toLowerCase());
      return matchSearch && matchTag;
    })
    .sort((a, b) => (b.publishedOn || 0) - (a.publishedOn || 0));

  const formatTime = (ts: number) => {
    if (!ts) return '';
    const diff = Date.now() / 1000 - ts;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <Layout>
      <SEO title="Financial News" />
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl glow-gold">
                <Globe className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-on-background">Financial News</h1>
                <p className="text-sm text-on-surface-variant">Live crypto & finance news — {lastUpdate && `Updated ${lastUpdate}`}</p>
              </div>
            </div>
            <button onClick={fetchNews} className="p-2 rounded-lg hover:bg-surface-highlight transition-colors">
              <RefreshCw size={16} className={cn("text-on-surface-variant", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-surface-dim border border-outline rounded-lg text-sm text-on-background placeholder-on-surface-variant/50 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All', ...allTags.slice(0, 8)].map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                    activeTag === tag
                      ? "bg-primary text-black"
                      : "bg-surface-dim text-on-surface-variant hover:bg-surface-highlight"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && articles.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant">Loading news...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 text-center text-on-surface-variant">
            {search || activeTag !== 'All' ? 'No articles match your filters' : 'No news available'}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((article) => {
              const tags = (article.categories || '').split('|').map(c => c.trim()).filter(Boolean);
              return (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel rounded-2xl p-5 hover:border-primary/30 transition-all cursor-pointer group flex gap-4"
                >
                  {article.image && (
                    <img
                      src={article.image}
                      alt=""
                      className="w-24 h-24 rounded-xl object-cover shrink-0 hidden sm:block"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-bold text-on-surface-variant">{article.source}</span>
                      {article.publishedOn && (
                        <>
                          <span className="text-on-surface-variant text-xs">•</span>
                          <span className="text-xs text-on-surface-variant">{formatTime(article.publishedOn)}</span>
                        </>
                      )}
                      <div className="flex gap-1 ml-auto">
                        {tags.slice(0, 2).map(tag => (
                          <span key={tag} className={cn("text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium", TAG_COLORS[tag] || "bg-surface-highlight text-on-surface-variant")}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-on-background group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    {article.body && (
                      <p className="text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">{article.body}</p>
                    )}
                  </div>
                  <ExternalLink size={14} className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0 mt-1" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
