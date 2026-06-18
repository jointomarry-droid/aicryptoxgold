import Hero from '@/components/Hero';
import LiveMarketDashboard from '@/components/LiveMarketDashboard';
import AIMarketIntelligence from '@/components/AIMarketIntelligence';
import FAQSection from '@/components/FAQSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <LiveMarketDashboard />
      <AIMarketIntelligence />
      <FAQSection />
    </div>
  );
}
