import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStatus('submitted');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="w-full lg:max-w-xl text-center lg:text-left">
          <h2 className="text-2xl font-display font-bold text-on-background mb-2">Get the Edge in Market Intelligence</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Join thousands of traders and investors receiving our daily AI-driven market predictions, deep-dive analysis, and breaking financial news directly in their inbox.
          </p>
        </div>
        
        <div className="w-full lg:w-auto flex-shrink-0">
          {status === 'submitted' ? (
            <div className="flex items-center gap-2 text-success font-bold bg-success/10 px-6 py-4 rounded-xl border border-success/20 w-full lg:min-w-[400px] justify-center animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={20} />
              <span>Successfully subscribed!</span>
            </div>
          ) : (
            <div className="relative w-full lg:min-w-[400px]">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 bg-surface-dim border border-outline rounded-xl px-4 py-3 text-on-background focus:outline-none focus:border-primary transition-colors text-sm"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-black font-bold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <Send size={16} />
                </button>
              </form>
              <p className="text-[10px] text-on-surface-variant mt-2 text-center lg:text-left">We respect your privacy. No spam, ever.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
