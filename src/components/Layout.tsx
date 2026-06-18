import { ReactNode } from 'react';
import { TopTicker } from './TopTicker';
import { Header } from './Header';
import { Footer } from './Footer';
import { BarChart3, Globe, LineChart, Cpu, Menu } from 'lucide-react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-primary-dim selection:text-black">
      {/* Top Ticker */}
      <TopTicker />
      
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
