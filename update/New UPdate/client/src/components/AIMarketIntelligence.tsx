import { Brain, TrendingUp, AlertCircle, BookOpen, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const AI_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663742967331/jJivNg6rbcZxoQt5dAtQnD/market-insights-abstract-ef8GcrKRongeBor4dQgdH6.webp';

const features = [
  {
    icon: Brain,
    title: 'AI Price Analysis',
    description: 'Advanced machine learning algorithms analyze market patterns and provide real-time insights.',
  },
  {
    icon: TrendingUp,
    title: 'Market Trend Prediction',
    description: 'Predictive analytics to forecast market movements and identify trading opportunities.',
  },
  {
    icon: AlertCircle,
    title: 'Risk Analysis',
    description: 'Comprehensive risk assessment tools to help you make informed investment decisions.',
  },
  {
    icon: BookOpen,
    title: 'Financial Education',
    description: 'Learn from expert guides, tutorials, and market analysis articles.',
  },
  {
    icon: Bell,
    title: 'Personalized Alerts',
    description: 'Get notified about price movements and market events that matter to you.',
  },
];

export default function AIMarketIntelligence() {
  return (
    <section className="section-spacing bg-secondary relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10 z-0">
        <img
          src={AI_BG}
          alt="AI Market Intelligence"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            AI Market Intelligence
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            Harness the power of artificial intelligence to gain deeper market insights and make smarter investment decisions. Our AI-powered platform analyzes millions of data points in real-time.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card-glass-dark group hover:border-accent/50 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl p-8 md:p-12 border border-accent/20 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Get AI-Powered Insights?
          </h3>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            Start using our AI market intelligence tools today and stay ahead of market trends.
          </p>
          <Link href="/insights">
            <Button className="btn-gold">
              Explore AI Insights
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
