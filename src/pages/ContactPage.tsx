import { Layout } from '../components/Layout';
import { Mail } from 'lucide-react';
import { SEO } from '../components/SEO';

export function ContactPage() {
  return (
    <Layout>
      <SEO title="Contact" />
      <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[60vh]">
        <div className="flex items-center gap-3 mb-8 border-b border-outline pb-6">
          <div className="p-3 bg-surface-highlight rounded-xl">
            <Mail className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-on-background">Get in Touch</h1>
            <p className="text-on-surface-variant text-sm mt-1">We'd love to hear from you. Reach out to our support or business teams.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Name</label>
                <input type="text" className="w-full bg-surface-dim border border-outline rounded-lg px-4 py-3 text-on-background focus:outline-none focus:border-primary transition-colors" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Email</label>
                <input type="email" className="w-full bg-surface-dim border border-outline rounded-lg px-4 py-3 text-on-background focus:outline-none focus:border-primary transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Message</label>
                <textarea rows={5} className="w-full bg-surface-dim border border-outline rounded-lg px-4 py-3 text-on-background focus:outline-none focus:border-primary transition-colors" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-dark transition-colors">Send Message</button>
            </form>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-on-background uppercase tracking-wider mb-2">Support Inquiries</h3>
              <p className="text-on-surface-variant text-sm mb-1">For account issues and technical support:</p>
              <a href="mailto:support@aimarketrates.com" className="text-primary font-medium hover:underline">support@aimarketrates.com</a>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-background uppercase tracking-wider mb-2">Business & API</h3>
              <p className="text-on-surface-variant text-sm mb-1">For enterprise API access and partnerships:</p>
              <a href="mailto:business@aimarketrates.com" className="text-primary font-medium hover:underline">business@aimarketrates.com</a>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-background uppercase tracking-wider mb-2">Headquarters</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                100 Crypto Valley Way<br/>
                Suite 400<br/>
                Tech District, CA 94103
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
