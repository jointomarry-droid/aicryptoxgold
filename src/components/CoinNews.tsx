import { useState, useEffect } from 'react';
import axios from 'axios';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  body: string;
  url: string;
  source: string;
  image: string;
  categories: string;
  publishedOn: number;
}

export function CoinNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('/api/cryptocompare/news');
        setArticles(res.data);
      } catch (err) {
        console.error('News fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 600000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ts: number) => {
    const diff = Date.now() / 1000 - ts;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-surface-highlight flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Newspaper className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-on-background">Crypto News</h2>
            <p className="text-xs text-on-surface-variant">Powered by CryptoCompare</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant text-sm">No news available</div>
        ) : (
          articles.slice(0, 10).map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border-b border-surface-highlight/50 last:border-0 hover:bg-surface-highlight/20 transition-colors group"
            >
              <div className="flex gap-3">
                {article.image && (
                  <img
                    src={article.image}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-highlight text-on-surface-variant">
                      {article.source}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">{formatTime(article.publishedOn)}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-on-background leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{article.body}</p>
                </div>
                <ExternalLink size={14} className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0 mt-1" />
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
