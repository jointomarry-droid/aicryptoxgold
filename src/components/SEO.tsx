import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  type?: string;
  url?: string;
  keywords?: string[];
}

export function SEO({ title, description, type = 'website', url, keywords }: SEOProps) {
  const siteTitle = 'AI Market Rates - Real-time Market Intelligence';
  const fullTitle = title === 'Dashboard' ? siteTitle : `${title} | AI Market Rates`;
  const defaultDescription = 'AI-powered market intelligence. Premium analytics for crypto, precious metals, and traditional finance.';
  const finalDescription = description || defaultDescription;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {url && <meta name="twitter:url" content={url} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
    </Helmet>
  );
}
