import { Layout } from '../components/Layout';
import { Scale } from 'lucide-react';
import { SEO } from '../components/SEO';

export function TermsOfServicePage() {
  return (
    <Layout>
      <SEO title="Terms of Service" />
      <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[60vh]">
        <div className="flex items-center gap-3 mb-8 border-b border-outline pb-6">
          <div className="p-3 bg-surface-highlight rounded-xl">
            <Scale className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-on-background">Terms of Service</h1>
            <p className="text-on-surface-variant text-sm mt-1">Effective Date: June 1, 2026</p>
          </div>
        </div>
        
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm md:text-base leading-relaxed space-y-6">
          <p>
            Welcome to AI Market Rates. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.
          </p>
          <h3 className="text-lg font-bold text-on-background">1. Acceptance of Terms</h3>
          <p>
            By accessing our website and using our AI-driven market intelligence tools, you agree to comply with all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our site.
          </p>
          <h3 className="text-lg font-bold text-on-background">2. No Financial Advice</h3>
          <p>
            The content, data, and predictive insights provided by AI Market Rates are for informational and educational purposes only. They do not constitute financial, investment, or trading advice. You are solely responsible for any investment decisions you make based on our data. We strongly recommend consulting with a certified financial advisor before trading volatile assets like cryptocurrencies or precious metals.
          </p>
          <h3 className="text-lg font-bold text-on-background">3. Disclaimer of Warranties</h3>
          <p>
            Our services are provided "as is" and "as available". We do not warrant that the data provided is 100% accurate, complete, or real-time, despite our best efforts. Markets are inherently unpredictable, and our AI models are probabilistic approximations.
          </p>
          <h3 className="text-lg font-bold text-on-background">4. Limitation of Liability</h3>
          <p>
            In no event shall AI Market Rates, its directors, or employees be liable for any direct, indirect, incidental, special, or consequential losses or damages arising out of your use or inability to use our platform or the data provided therein.
          </p>
          <h3 className="text-lg font-bold text-on-background">5. User Conduct</h3>
          <p>
            You agree not to exploit our platform, API, or data for unauthorized commercial purposes, web scraping, or automated high-frequency trading applications without a dedicated enterprise license.
          </p>
        </div>
      </div>
    </Layout>
  );
}
