import { Card } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-spacing">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Financial Calculators</h1>
          <p className="text-lg text-foreground/70 mb-12">
            Calculate investments and conversions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border p-6">
              <Calculator className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Crypto Calculator</h3>
              <p className="text-foreground/70">Calculate cryptocurrency investments</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <Calculator className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Gold Calculator</h3>
              <p className="text-foreground/70">Calculate gold investment values</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <Calculator className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Silver Calculator</h3>
              <p className="text-foreground/70">Calculate silver investment values</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
