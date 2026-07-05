import { Layout } from '../components/Layout';
import { MarketOverview } from '../components/MarketOverview';
import { PriceChart } from '../components/PriceChart';
import { MetalPrices } from '../components/MetalPrices';
import { CryptoRankings } from '../components/CryptoRankings';
import { AiInsights } from '../components/AiInsights';
import { AiRecommendations } from '../components/AiRecommendations';
import { FearGreedGauge } from '../components/FearGreedGauge';
import { TrendingCoins } from '../components/TrendingCoins';
import { CoinNews } from '../components/CoinNews';
import { PortfolioTracker } from '../components/PortfolioTracker';
import { MarketSentiment } from '../components/MarketSentiment';
import { Hero } from '../components/Hero';
import { MarketTicker } from '../components/MarketTicker';
import { SEO } from '../components/SEO';
import { FaqSection } from '../components/FaqSection';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { RiskDisclosure } from '../components/RiskDisclosure';

export function Dashboard() {
  return (
    <Layout>
      <SEO title="Dashboard" />
      <MarketTicker />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Sidebar: Hero, Portfolio & AI Info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Hero />
          
          <div className="flex-none">
            <PortfolioTracker />
          </div>

          <div className="flex-none">
            <MarketSentiment />
          </div>

          <div className="flex-none">
            <FearGreedGauge />
          </div>

          <div className="flex-none">
            <TrendingCoins />
          </div>
        </div>

        {/* Main Data Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <MarketOverview />
          
          <div className="min-h-[400px]">
            <PriceChart />
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CryptoRankings />
            <MetalPrices />
          </div>

          {/* AI Trade Signals - Full Width */}
          <AiRecommendations />

          {/* Coin News - Full Width */}
          <div className="h-[500px]">
            <CoinNews />
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <FaqSection />
      </div>

      <div className="mb-8">
        <NewsletterSignup />
      </div>

      <RiskDisclosure />
    </Layout>
  );
}
