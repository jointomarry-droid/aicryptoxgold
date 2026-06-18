import { Card } from '@/components/ui/card';
import { Brain, TrendingUp, BarChart3 } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-spacing">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">AI Market Insights</h1>
          <p className="text-lg text-foreground/70 mb-12">
            Advanced AI-powered market analysis and predictions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border p-6">
              <Brain className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">AI Analysis</h3>
              <p className="text-foreground/70">Machine learning powered market analysis</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <TrendingUp className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Predictions</h3>
              <p className="text-foreground/70">Forecast market trends and movements</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <BarChart3 className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Analytics</h3>
              <p className="text-foreground/70">Comprehensive market data and charts</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
