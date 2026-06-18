import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is AI Market Rates?",
    answer: "AI Market Rates is an advanced platform that utilizes quantum neural networks and AI models to provide real-time tracking and predictive insights for cryptocurrencies, precious metals, and traditional equities."
  },
  {
    question: "How accurate are the AI price predictions?",
    answer: "Our predictive models process millions of data points per second to provide highly probabilistic forecasts. While we strive for maximum accuracy, market conditions are inherently volatile and our insights should be used as educational tools, not explicit financial advice."
  },
  {
    question: "Can I set custom price alerts?",
    answer: "Yes, you can create a free account to manage your profile and set custom price alerts for specific assets when they go above or drop below your target price. Go to the profile icon in the header."
  },
  {
    question: "Is the market data real-time?",
    answer: "We aggregate data from leading global exchanges to provide real-time updates for crypto, gold, and silver, ensuring you have the latest information for your market analysis."
  },
  {
    question: "Are there enterprise API solutions available?",
    answer: "Yes, we offer an AI Insights API for enterprise clients who need programmatic access to our data and historical market analytics. Visit our Contact page to get in touch with our business team."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg glow-gold">
          <HelpCircle className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-on-background">Frequently Asked Questions</h2>
          <p className="text-on-surface-variant text-sm mt-1">Common questions about our market intelligence platform and AI models.</p>
        </div>
      </div>
      
      <div className="grid gap-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={`border border-outline rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-surface-highlight border-primary/30' : 'bg-surface-dim hover:border-outline-variant'}`}
            >
              <button 
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
              >
                <span className="font-bold text-on-background text-[15px]">{faq.question}</span>
                <ChevronDown 
                  className={`text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                  size={20} 
                />
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-4 pt-0 text-sm text-on-surface-variant leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
