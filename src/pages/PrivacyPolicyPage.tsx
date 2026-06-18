import { Layout } from '../components/Layout';
import { Shield } from 'lucide-react';
import { SEO } from '../components/SEO';

export function PrivacyPolicyPage() {
  return (
    <Layout>
      <SEO title="Privacy Policy" />
      <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[60vh]">
        <div className="flex items-center gap-3 mb-8 border-b border-outline pb-6">
          <div className="p-3 bg-surface-highlight rounded-xl">
            <Shield className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-on-background">Privacy Policy</h1>
            <p className="text-on-surface-variant text-sm mt-1">Last Updated: June 1, 2026</p>
          </div>
        </div>
        
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm md:text-base leading-relaxed space-y-6">
          <p>
            At AI Market Rates, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website and services.
          </p>
          <h3 className="text-lg font-bold text-on-background">1. Information We Collect</h3>
          <p>
            We may collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact support. This includes your name, email address, and any financial preferences you set within your account. We also automatically collect analytics data such as IP addresses, browser types, and usage patterns to improve our AI models and user experience.
          </p>
          <h3 className="text-lg font-bold text-on-background">2. How We Use Your Information</h3>
          <p>
            Your information is used to provide, maintain, and improve our services; to personalize your experience; to communicate with you about updates and alerts; and to protect against fraudulent or unauthorized activity. We do not sell your personal data to third parties.
          </p>
          <h3 className="text-lg font-bold text-on-background">3. Data Security</h3>
          <p>
            We implement industry-standard security measures, including encryption and strict access controls, to safeguard your data. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
          </p>
          <h3 className="text-lg font-bold text-on-background">4. Your Rights</h3>
          <p>
            Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. You can manage your preferences in your account settings or contact us directly at privacy@aimarketrates.com.
          </p>
        </div>
      </div>
    </Layout>
  );
}
