import { Layout } from '../components/Layout';
import { Users } from 'lucide-react';
import { SEO } from '../components/SEO';

export function AboutPage() {
  return (
    <Layout>
      <SEO title="About Us" />
      <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[60vh]">
        <div className="flex items-center gap-3 mb-8 border-b border-outline pb-6">
          <div className="p-3 bg-surface-highlight rounded-xl">
            <Users className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-on-background">About AI Market Rates</h1>
            <p className="text-on-surface-variant text-sm mt-1">Our mission and the technology driving us forward.</p>
          </div>
        </div>
        
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm md:text-base leading-relaxed space-y-6">
          <p>
            AI Market Rates was founded with a singular vision: to democratize institutional-grade market intelligence. 
            By leveraging advanced AI models and quantum neural networks, we provide real-time, predictive insights across 
            cryptocurrencies, precious metals, and traditional equities.
          </p>
          <h3 className="text-lg font-bold text-on-background mt-8">Our Technology</h3>
          <p>
            Our proprietary prediction engine processes millions of data points per second—from global trading volumes and 
            order book depth to macroeconomic indicators and social sentiment analysis. This allows us to deliver market 
            status updates and trend forecasts with unprecedented accuracy.
          </p>
          <h3 className="text-lg font-bold text-on-background mt-8">The Team</h3>
          <p>
            We are a team of data scientists, financial analysts, and software engineers who previously built systems for 
            top-tier investment banks and leading tech companies. We believe that transparency and access to high-quality data 
            can empower individuals to make better financial decisions.
          </p>
        </div>
      </div>
    </Layout>
  );
}
