import { Layout } from '../components/Layout';
import { FileText } from 'lucide-react';
import { SEO } from '../components/SEO';

export function GenericPage({ title }: { title: string }) {
  return (
    <Layout>
      <SEO title={title} />
      <div className="glass-panel rounded-2xl p-8 min-h-[60vh] flex flex-col">
        <div className="flex items-center gap-3 mb-8 border-b border-outline pb-6">
          <div className="p-3 bg-surface-highlight rounded-xl">
            <FileText className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-on-background">{title}</h1>
            <p className="text-on-surface-variant text-sm mt-1">This section is currently under development.</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 border-4 border-surface-highlight border-t-primary rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-bold text-on-background mb-2">Coming Soon</h2>
          <p className="text-on-surface-variant">
            We are working hard to bring you the {title.toLowerCase()} page. Check back later for updates.
          </p>
        </div>
      </div>
    </Layout>
  );
}
