/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { GenericPage } from './pages/GenericPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostFutureOfAI } from './pages/BlogPostFutureOfAI';
import { BlogPostGoldVsBitcoin } from './pages/BlogPostGoldVsBitcoin';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NewsPage } from './pages/NewsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { ProfilePage } from './pages/ProfilePage';
import { FaqPage } from './pages/FaqPage';
import { AuthCallback } from './pages/AuthCallback';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/crypto" element={<GenericPage title="Crypto Markets" />} />
        <Route path="/gold" element={<GenericPage title="Gold Prices" />} />
        <Route path="/silver" element={<GenericPage title="Silver Prices" />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/insights" element={<GenericPage title="AI Insights" />} />
        <Route path="/calculators" element={<GenericPage title="Financial Calculators" />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/future-of-ai-in-market-prediction" element={<BlogPostFutureOfAI />} />
        <Route path="/blog/gold-vs-bitcoin-inflation-hedge" element={<BlogPostGoldVsBitcoin />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        
        {/* Footer pages */}
        <Route path="/equities" element={<GenericPage title="Equities Overview" />} />
        <Route path="/forex" element={<GenericPage title="Forex Rates" />} />
        <Route path="/api" element={<GenericPage title="AI Insights API" />} />
        <Route path="/reports" element={<GenericPage title="Market Reports" />} />
        <Route path="/documentation" element={<GenericPage title="Documentation" />} />
        <Route path="/careers" element={<GenericPage title="Careers" />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/disclosure" element={<GenericPage title="Risk Disclosure" />} />
      </Routes>
    </BrowserRouter>
  );
}

