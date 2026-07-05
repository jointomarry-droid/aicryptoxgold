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
import { AiOracle } from '../components/AiOracle';
import { ArbitrageScanner } from '../components/ArbitrageScanner';
import { CrashPredictor } from '../components/CrashPredictor';
import { SentimentHeatmap } from '../components/SentimentHeatmap';
import { CorrelationMatrix } from '../components/CorrelationMatrix';
import { AiTradingSignals } from '../components/AiTradingSignals';

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

      {/* ============ ADVANCED AI FEATURES SECTION ============ */}
      <div className="mb-4 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
          <h2 className="text-2xl font-display font-bold text-on-background text-center whitespace-nowrap">
            <span className="text-gradient-gold">AI-Powered</span> Advanced Analytics
          </h2>
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
        </div>
        <p className="text-center text-on-surface-variant text-sm mb-8 max-w-2xl mx-auto">
          Exclusive features powered by Gemini AI - not available on any other platform globally
        </p>
      </div>

      {/* Row 1: AI Oracle + Crash Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="min-h-[500px]">
          <AiOracle />
        </div>
        <div className="min-h-[500px]">
          <CrashPredictor />
        </div>
      </div>

      {/* Row 2: Trading Signals + Arbitrage Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="min-h-[500px]">
          <AiTradingSignals />
        </div>
        <div className="min-h-[500px]">
          <ArbitrageScanner />
        </div>
      </div>

      {/* Row 3: Sentiment Heatmap + Correlation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="min-h-[400px]">
          <SentimentHeatmap />
        </div>
        <div className="min-h-[400px]">
          <CorrelationMatrix />
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
