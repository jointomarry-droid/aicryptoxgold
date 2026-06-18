import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663742967331/jJivNg6rbcZxoQt5dAtQnD/hero-financial-tech-GcmyazsincVPtb9xZH3j7r.webp';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Financial Technology"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Real-Time Market Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            AI Powered Real-Time Crypto, Gold & Silver Market Intelligence
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            Track cryptocurrency prices, precious metal rates, market trends and AI-powered financial insights in one professional platform. Get real-time data, advanced analytics, and predictive market analysis.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/crypto">
              <Button className="btn-gold group w-full sm:w-auto">
                View Live Rates
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/insights">
              <Button variant="outline" className="btn-outline-gold w-full sm:w-auto">
                Explore AI Insights
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-accent">50+</div>
              <p className="text-sm text-gray-300">Cryptocurrencies</p>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-accent">24/7</div>
              <p className="text-sm text-gray-300">Live Updates</p>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-accent">AI</div>
              <p className="text-sm text-gray-300">Powered Insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal Divider */}
      <svg
        className="absolute bottom-0 left-0 w-full h-20 md:h-32 text-background"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}
