import React from 'react';

export function Hero() {
  return (
    <div className="flex-1 p-8 rounded-2xl bg-surface border border-outline relative overflow-hidden shadow-lg flex flex-col justify-center">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary blur-[100px] opacity-20 pointer-events-none"></div>
      <h1 className="text-4xl xl:text-[2.5rem] font-bold leading-[1.1] mb-4 text-on-background">
        AI-Powered <br/>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
          Market Intelligence
        </span>
      </h1>
      <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
        Real-time tracking of Crypto, Gold & Silver with neural network price predictions.
      </p>
      <div className="flex flex-col gap-3 mt-auto">
        <button className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-black font-bold rounded-xl shadow-[0_4px_14px_rgba(255,215,0,0.2)] hover:shadow-[0_6px_20px_rgba(255,215,0,0.3)] transition-all">
          Explore AI Insights
        </button>
        <button className="w-full py-3 bg-surface-dim border border-outline text-on-background font-bold rounded-xl hover:bg-surface-bright transition-colors">
          Live Rankings
        </button>
      </div>
    </div>
  );
}
