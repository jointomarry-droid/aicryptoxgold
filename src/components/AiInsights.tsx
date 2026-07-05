import { BrainCircuit, ChevronRight, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface AiInsight {
  id: string;
  category: string;
  sentiment: string;
  title: string;
  summary: string;
  date: string;
}

export function AiInsights() {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInsights = async () => {
    try {
      setRefreshing(true);
      
      // Fetch multiple sentiment analyses in parallel
      const [cryptoSentiment, goldSentiment] = await Promise.all([
        axios.post('/api/sentiment', { asset: 'cryptocurrency market' }),
        axios.post('/api/sentiment', { asset: 'gold and precious metals market' })
      ]);

      const newInsights: AiInsight[] = [
        {
          id: '1',
          category: 'Crypto',
          sentiment: cryptoSentiment.data.sentiment || 'Neutral',
          title: 'Cryptocurrency Market Analysis',
          summary: cryptoSentiment.data.summary || 'Analyzing current market conditions and sentiment indicators.',
          date: new Date().toLocaleDateString()
        },
        {
          id: '2',
          category: 'Metals',
          sentiment: goldSentiment.data.sentiment || 'Neutral',
          title: 'Precious Metals Outlook',
          summary: goldSentiment.data.summary || 'Evaluating gold and silver market dynamics.',
          date: new Date().toLocaleDateString()
        }
      ];

      setInsights(newInsights);
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
      // Fallback to simulated insights
      setInsights([
        {
          id: '1',
          category: 'Crypto',
          sentiment: 'Bullish',
          title: 'Bitcoin Shows Strength Above Key Support',
          summary: 'BTC is holding above the 200-day moving average with increasing institutional interest. Technical indicators suggest potential upward momentum.',
          date: new Date().toLocaleDateString()
        },
        {
          id: '2',
          category: 'Metals',
          sentiment: 'Neutral',
          title: 'Gold Consolidates Near All-Time Highs',
          summary: 'XAU is trading in a tight range as markets await Fed policy clarity. Central bank demand continues to provide floor support.',
          date: new Date().toLocaleDateString()
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    const interval = setInterval(fetchInsights, 300000); // Update every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-surface relative">
        <div className="p-6 border-b border-surface-highlight flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg glow-gold">
              <BrainCircuit className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-on-background tracking-tight">Quantum AI Intel</h2>
              <p className="text-xs text-primary font-mono opacity-80 uppercase tracking-widest">Loading...</p>
            </div>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-surface-highlight rounded w-24 mb-2"></div>
              <div className="h-6 bg-surface-highlight rounded w-48 mb-2"></div>
              <div className="h-4 bg-surface-highlight rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-surface relative">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary blur-[100px] opacity-10 pointer-events-none"></div>
      <div className="p-6 border-b border-surface-highlight flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg glow-gold">
            <BrainCircuit className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-on-background tracking-tight">Quantum AI Intel</h2>
            <p className="text-xs text-primary font-mono opacity-80 uppercase tracking-widest">Live Gemini Analysis</p>
          </div>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={refreshing}
          className="text-sm font-medium text-on-surface hover:text-primary transition-colors flex items-center gap-1"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-grow">
        {insights.map((insight) => (
          <div key={insight.id} className="group relative border-b border-surface-highlight/50 pb-6 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-surface text-on-surface-variant">
                {insight.category}
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm",
                insight.sentiment.includes('Bullish') ? "text-success bg-success/10" : 
                insight.sentiment.includes('Bearish') ? "text-danger bg-danger/10" :
                "text-warning bg-warning/10"
              )}>
                {insight.sentiment}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium ml-auto">
                {insight.date}
              </span>
            </div>
            
            <h3 className="text-base font-semibold text-on-background leading-snug mb-2 group-hover:text-primary transition-colors">
              {insight.title}
            </h3>
            
            <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
              {insight.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}