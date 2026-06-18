import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-outline bg-surface text-on-surface-variant flex-shrink-0 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#B8860B] text-black flex items-center justify-center font-bold font-display">
                  A
                </div>
                <span className="text-xl font-display font-bold tracking-tight uppercase text-on-background hidden sm:block">
                  AI MARKET <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-[#B8860B]">RATES</span>
                </span>
              </Link>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              AI-powered market intelligence. Premium analytics for crypto, precious metals, and traditional finance.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-on-background uppercase tracking-wider text-xs mb-4">Markets</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/crypto" className="hover:text-primary transition-colors">Cryptocurrencies</Link></li>
              <li><Link to="/gold" className="hover:text-primary transition-colors">Precious Metals</Link></li>
              <li><Link to="/equities" className="hover:text-primary transition-colors">Equities Overview</Link></li>
              <li><Link to="/forex" className="hover:text-primary transition-colors">Forex Rates</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-on-background uppercase tracking-wider text-xs mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/api" className="hover:text-primary transition-colors">AI Insights API</Link></li>
              <li><Link to="/calculators" className="hover:text-primary transition-colors">Financial Calculators</Link></li>
              <li><Link to="/reports" className="hover:text-primary transition-colors">Market Reports</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-on-background uppercase tracking-wider text-xs mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-outline flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success glow-gold" style={{ boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)' }}></span>
              <span>System Status: Optimal</span>
            </div>
            <span className="hidden sm:inline-block mx-2 text-on-surface-variant/30">|</span>
            <span>&copy; {currentYear} AI MARKET RATES. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 uppercase tracking-widest text-[10px]">
            <Link to="/privacy" className="hover:text-on-surface transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-on-surface transition-colors">Terms of Service</Link>
            <Link to="/disclosure" className="hover:text-on-surface transition-colors">Risk Disclosure</Link>
          </div>
        </div>
        
        <div className="mt-6 text-[10px] text-on-surface-variant/60 max-w-4xl text-center md:text-left leading-relaxed mx-auto md:mx-0">
          <p>
            Disclaimer: Market data and AI predictions are provided for informational purposes only and do not constitute financial advice. 
            Trading cryptocurrencies, precious metals, and other financial assets involves significant risk. Always conduct your own research 
            or consult with a qualified financial advisor before making any investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
