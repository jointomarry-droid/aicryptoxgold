import { Search, Moon, Sun, Menu, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return !document.documentElement.classList.contains('light');
    }
    return true;
  });

  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Crypto', path: '/crypto' },
    { name: 'Gold', path: '/gold' },
    { name: 'Silver', path: '/silver' },
    { name: 'News', path: '/news' },
    { name: 'AI Insights', path: '/insights' },
    { name: 'Calculators', path: '/calculators' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-outline w-full px-4 md:px-8 h-16 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#B8860B] text-black flex items-center justify-center font-bold font-display">
            A
          </div>
          <span className="text-xl font-display font-bold tracking-tight uppercase text-on-background hidden sm:block">
            AI MARKET <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-[#B8860B]">RATES</span>
          </span>
        </Link>
      </div>
      
      <nav className="hidden lg:flex items-center gap-4 xl:gap-5 font-medium text-sm text-on-surface-variant flex-1 justify-center px-4">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`hover:text-on-background transition-colors whitespace-nowrap ${isActive ? 'text-on-background border-b-2 border-primary pb-1 -mb-1' : ''}`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
        <button 
          className="p-2 text-on-surface-variant hover:text-on-background hover:bg-surface-highlight rounded-full transition-colors flex items-center justify-center"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        <button 
          onClick={() => setIsDark(!isDark)} 
          className="p-2 text-on-surface-variant hover:text-on-background hover:bg-surface-highlight rounded-full transition-colors flex items-center justify-center"
          aria-label="Toggle Theme"
        >
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <Link 
          to="/profile" 
          className="p-2 text-on-surface-variant hover:text-on-background hover:bg-surface-highlight rounded-full transition-colors flex items-center justify-center"
          aria-label="Profile"
        >
          <User size={20} />
        </Link>

        <div className="hidden md:flex bg-surface-bright p-1 rounded-full border border-outline ml-2">
          <button className="px-3 py-1 text-xs bg-primary text-black rounded-full font-semibold">Live</button>
          <button className="px-3 py-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors">Hist</button>
        </div>
        
        <button className="lg:hidden p-2 text-on-surface-variant hover:text-on-background transition-colors">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
