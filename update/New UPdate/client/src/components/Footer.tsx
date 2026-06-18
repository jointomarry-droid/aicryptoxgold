import { Link } from 'wouter';
import { Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663742967331/jJivNg6rbcZxoQt5dAtQnD/logo-ai-market-rates-FzNE3hLQmvnfFqzH9enRgc.webp';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'Home', href: '/' },
      { label: 'Crypto Prices', href: '/crypto' },
      { label: 'Gold Price', href: '/gold-price' },
      { label: 'Silver Price', href: '/silver-price' },
    ],
    Resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Calculators', href: '/calculators' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={LOGO_URL}
                alt="AI Market Rates"
                className="h-10 w-10"
              />
              <span
                className="text-lg font-bold gradient-gold-text"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                AI Market Rates
              </span>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Professional financial intelligence platform for real-time crypto, gold, and precious metal market data.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <a className="text-sm text-foreground/70 hover:text-accent transition-colors duration-200">
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 my-8"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/60">
            © {currentYear} AI Market Rates. All Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg hover:bg-accent/10 text-foreground/70 hover:text-accent transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
