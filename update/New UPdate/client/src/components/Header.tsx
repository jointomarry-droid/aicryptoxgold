import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, Moon, Sun } from 'lucide-react';
import { Link } from 'wouter';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663742967331/jJivNg6rbcZxoQt5dAtQnD/logo-ai-market-rates-FzNE3hLQmvnfFqzH9enRgc.webp';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Crypto Prices', href: '/crypto' },
    { label: 'Gold Price', href: '/gold-price' },
    { label: 'Silver Price', href: '/silver-price' },
    { label: 'Market News', href: '/news' },
    { label: 'AI Insights', href: '/insights' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg'
          : 'bg-background border-b border-border/50'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src={LOGO_URL}
              alt="AI Market Rates"
              className="h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110"
            />
            <span
              className="hidden sm:inline text-lg md:text-xl font-bold gradient-gold-text"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AI Market Rates
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-accent transition-colors duration-200 rounded-md hover:bg-secondary/50">
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 rounded-lg hover:bg-secondary/50 transition-colors duration-200">
              <Search className="w-5 h-5 text-foreground/70" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-foreground/70" />
              )}
            </button>

            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex border-accent text-accent hover:bg-accent/10"
            >
              Login
            </Button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="lg:hidden pb-4 border-t border-border/50 mt-2">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className="block px-4 py-2 text-sm font-medium text-foreground/80 hover:text-accent hover:bg-secondary/50 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2 mx-4 w-auto border-accent text-accent hover:bg-accent/10"
              >
                Login
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
