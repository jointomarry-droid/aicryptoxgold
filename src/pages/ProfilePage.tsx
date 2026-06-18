import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { User, Bell, Trash2, Plus, LogOut } from 'lucide-react';
import { PriceAlertModal, PriceAlert } from '../components/PriceAlertModal';
import { formatCurrency } from '../lib/utils';
import { SEO } from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function ProfilePage() {
  const { user, loading, signInWithGoogle, signInWithGithub, logout } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setAlerts([]);
      return;
    }

    const loadAlerts = async () => {
      const { data } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.id);
      if (data) {
        setAlerts(data.map((item: any) => ({
          id: item.id,
          asset: item.asset,
          targetPrice: item.target_price,
          condition: item.condition,
        })));
      }
    };
    loadAlerts();

    const channel = supabase
      .channel('price_alerts_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'price_alerts', filter: `user_id=eq.${user.id}` },
        (payload: RealtimePostgresChangesPayload<any>) => {
          if (payload.eventType === 'INSERT') {
            const item = payload.new;
            setAlerts(prev => [...prev, {
              id: item.id,
              asset: item.asset,
              targetPrice: item.target_price,
              condition: item.condition,
            }]);
          } else if (payload.eventType === 'DELETE') {
            const old = payload.old;
            setAlerts(prev => prev.filter(a => a.id !== old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleAddAlert = async (alert: PriceAlert) => {
    if (!user) return;
    await supabase.from('price_alerts').insert({
      user_id: user.id,
      asset: alert.asset,
      target_price: alert.targetPrice,
      condition: alert.condition,
    });
  };

  const handleRemoveAlert = async (id: string) => {
    if (!user) return;
    await supabase.from('price_alerts').delete().eq('id', id);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin text-primary rounded-full border-2 border-t-transparent w-8 h-8"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="User Profile" />
      <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[60vh]">
        <div className="flex items-center gap-3 mb-8 border-b border-outline pb-6">
          <div className="p-3 bg-surface-highlight rounded-xl">
            <User className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-on-background">User Management</h1>
            <p className="text-on-surface-variant text-sm mt-1">Manage your account preferences and alerts.</p>
          </div>
        </div>

        {!user ? (
          <div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-surface-highlight rounded-full flex items-center justify-center mb-6">
              <User size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-on-background mb-2">Sign in to sync your alerts</h2>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              Create an account to manage your custom price alerts, save your settings across devices, and unlock premium insights.
            </p>

            <div className="w-full space-y-3">
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-surface-dim border border-outline hover:bg-surface-highlight transition-colors py-3 rounded-xl font-bold text-on-background"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>

              <button
                onClick={signInWithGithub}
                className="w-full flex items-center justify-center gap-3 bg-surface-dim border border-outline hover:bg-surface-highlight transition-colors py-3 rounded-xl font-bold text-on-background"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                Continue with GitHub
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 lg:border-r border-outline lg:pr-8">
               <div className="flex flex-col items-center text-center">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt={user.user_metadata?.full_name || 'User'} className="w-24 h-24 rounded-full mb-4 border border-outline object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-surface-highlight mb-4 flex items-center justify-center border border-outline">
                      <User size={40} className="text-on-surface-variant" />
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-on-background">{user.user_metadata?.full_name || user.email || 'User'}</h2>
                  <p className="text-on-surface-variant text-sm mb-6">{user.email}</p>

                  <div className="space-y-3 w-full">
                    <button className="w-full py-2 bg-surface-dim border border-outline hover:bg-surface-highlight transition-colors rounded-lg font-medium text-sm">
                      Edit Profile
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 py-2 text-danger bg-danger/10 hover:bg-danger/20 transition-colors rounded-lg font-medium text-sm"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
               </div>
            </div>
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-on-background flex items-center gap-2">
                  <Bell size={20} className="text-primary" />
                  Price Alerts
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors font-medium"
                >
                  <Plus size={16} />
                  New Alert
                </button>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-12 bg-surface-dim rounded-xl border border-outline border-dashed">
                  <Bell size={32} className="mx-auto text-on-surface-variant mb-3 opacity-50" />
                  <p className="text-on-surface-variant">No active price alerts.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-dim border border-outline rounded-xl hover:border-primary/30 transition-colors gap-4 sm:gap-0">
                      <div className="flex items-center gap-4">
                        <div className="font-bold text-on-background w-16">{alert.asset}</div>
                        <div className="text-sm">
                          <span className="text-on-surface-variant">Alert when price</span>
                          {alert.condition === 'above' ? (
                            <span className="text-success mx-1">above</span>
                          ) : (
                            <span className="text-danger mx-1">below</span>
                          )}
                          <span className="font-mono font-bold text-on-background">{formatCurrency(alert.targetPrice)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAlert(alert.id)}
                        className="p-2 text-on-surface-variant hover:text-danger hover:bg-danger/10 rounded-lg transition-colors self-end sm:self-auto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <PriceAlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddAlert} />
    </Layout>
  );
}
