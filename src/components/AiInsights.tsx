import { MARKET_DATA } from '../lib/data';
import { BrainCircuit, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function AiInsights() {
  const { aiInsights } = MARKET_DATA;

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
            <p className="text-xs text-primary font-mono opacity-80 uppercase tracking-widest">Real-time analysis</p>
          </div>
        </div>
        <button className="text-sm font-medium text-on-surface hover:text-primary transition-colors flex items-center gap-1">
          View All <ChevronRight size={16} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-grow">
        {aiInsights.map((insight) => (
          <div key={insight.id} className="group relative border-b border-surface-highlight/50 pb-6 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-surface text-on-surface-variant">
                {insight.category}
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm",
                insight.sentiment.includes('Bullish') ? "text-success bg-success/10" : "text-danger bg-danger/10"
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
