import { AlertTriangle } from 'lucide-react';

export function RiskDisclosure() {
  return (
    <div className="bg-surface-dim border border-outline rounded-xl p-4 sm:p-6 mb-8 mt-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-warning shrink-0 mt-0.5" size={18} />
        <div>
          <strong className="text-on-background font-bold uppercase tracking-wider block mb-1.5">Risk Disclosure & Important Notice</strong>
          <p className="mb-2">
            The data and information provided on AI Market Rates (including cryptocurrencies, gold, silver, and AI-driven market sentiment) are for informational and educational purposes only and do not constitute financial, investment, or trading advice.
          </p>
          <p>
            Historical performance is not indicative of future results. All trading involves a high degree of risk, and you could lose some or all of your initial investment. Real-time market data is provided 'as is' via third-party APIs (such as Metals API) and may experience latency, omissions, or inaccuracies. Always consult with a qualified financial advisor before making any investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
