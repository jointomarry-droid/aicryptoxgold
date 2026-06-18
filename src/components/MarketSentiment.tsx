import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";

interface SentimentResult {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  score: number;
  summary: string;
}

export function MarketSentiment() {
  const [activeAsset, setActiveAsset] = useState<'Gold' | 'Crypto'>('Crypto');
  const [data, setData] = useState<Record<string, SentimentResult>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSentiment = async (asset: 'Gold' | 'Crypto') => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset: asset === 'Crypto' ? 'cryptocurrency market' : 'gold market' })
      });
      if (!resp.ok) {
        throw new Error("Failed to fetch sentiment analysis");
      }
      const result: SentimentResult = await resp.json();
      setData(prev => ({ ...prev, [asset]: result }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data[activeAsset]) {
      fetchSentiment(activeAsset);
    }
  }, [activeAsset]);

  const currentData = data[activeAsset];

  const getSentimentIcon = (sentiment?: string) => {
    if (sentiment === 'Bullish') return <TrendingUp className="text-success" size={24} />;
    if (sentiment === 'Bearish') return <TrendingDown className="text-danger" size={24} />;
    return <Minus className="text-gray-400" size={24} />;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl bg-surface relative overflow-hidden flex flex-col h-full border border-outline shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-on-background">AI Sentiment</h2>
            <p className="text-sm text-on-surface-variant">Real-time news analysis</p>
          </div>
        </div>

        <div className="flex bg-surface-dim p-1 rounded-lg">
          <button
            onClick={() => setActiveAsset('Crypto')}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-md transition-colors",
              activeAsset === 'Crypto' ? "bg-primary text-black shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Crypto
          </button>
          <button
            onClick={() => setActiveAsset('Gold')}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-md transition-colors",
              activeAsset === 'Gold' ? "bg-primary text-black shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Gold
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center min-h-[160px]">
        {loading && !currentData ? (
          <div className="flex flex-col items-center justify-center text-on-surface-variant animate-pulse space-y-4">
            <Sparkles className="animate-spin text-primary opacity-50" size={32} />
            <p className="text-sm font-medium">Analyzing real-time news across the web...</p>
          </div>
        ) : error ? (
          <div className="bg-danger/10 text-danger p-4 rounded-xl text-center text-sm border border-danger/20">
            {error}. Make sure GEMINI_API_KEY is configured in Settings.
            <button 
              onClick={() => fetchSentiment(activeAsset)} 
              className="mt-3 mx-auto flex items-center gap-2 text-xs font-bold hover:text-danger/80 transition-colors"
            >
              <RefreshCw size={14} /> Retry Analysis
            </button>
          </div>
        ) : currentData ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-surface-dim border border-outline rounded-xl">
              <div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Overall Sentiment</div>
                <div className={cn(
                  "text-2xl font-display font-bold flex items-center gap-2",
                  currentData.sentiment === 'Bullish' && "text-success",
                  currentData.sentiment === 'Bearish' && "text-danger",
                  currentData.sentiment === 'Neutral' && "text-gray-300"
                )}>
                  {currentData.sentiment} {getSentimentIcon(currentData.sentiment)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Conviction Score</div>
                <div className="text-2xl font-display font-bold text-on-background">
                  {currentData.score}/100
                </div>
              </div>
            </div>

            <div className="bg-surface-highlight p-4 rounded-xl border border-outline relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl"></div>
              <p className="text-sm text-on-surface leading-relaxed ml-2 font-medium">
                {currentData.summary}
              </p>
            </div>
          </div>
        ) : null}
      </div>
      
      {!loading && currentData && (
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => fetchSentiment(activeAsset)} 
            className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors font-medium"
          >
            <RefreshCw size={12} /> Re-analyze latest news
          </button>
        </div>
      )}
    </div>
  );
}
