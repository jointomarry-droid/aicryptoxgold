import { Card } from '@/components/ui/card';
import { Zap, Shield, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-spacing">
        <div className="container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About AI Market Rates</h1>
          
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              AI Market Rates is a professional financial intelligence platform dedicated to providing real-time cryptocurrency, gold, and precious metal market data with AI-powered insights.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Our Mission</h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              To empower investors and traders with accurate, real-time market data and AI-driven insights that help them make informed financial decisions in the dynamic world of cryptocurrencies and precious metals.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Why Choose Us?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-card border-border p-6">
              <Zap className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Real-Time Data</h3>
              <p className="text-foreground/70">Live market prices updated continuously throughout the trading day</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <Shield className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Trusted Source</h3>
              <p className="text-foreground/70">Data sourced from major commodity exchanges and financial providers</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <TrendingUp className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">AI Insights</h3>
              <p className="text-foreground/70">Advanced machine learning for market analysis and predictions</p>
            </Card>
          </div>

          <div className="bg-secondary border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Technology</h2>
            <p className="text-foreground/80 leading-relaxed">
              We leverage cutting-edge artificial intelligence and machine learning technologies to analyze market data, identify patterns, and provide actionable insights to our users. Our platform is built with scalability, security, and user experience in mind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
