import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';
import { FaqSection } from '../components/FaqSection';

export function FaqPage() {
  return (
    <Layout>
      <SEO 
        title="Frequently Asked Questions" 
        description="Find answers to common questions about AI Market Rates, our predictive models, real-time data, and custom price alerts."
      />
      <div className="max-w-4xl mx-auto py-8">
        <FaqSection />
      </div>
    </Layout>
  );
}
