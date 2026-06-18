import { useState } from 'react';
import { X, Bell } from 'lucide-react';

export interface PriceAlert {
  id: string;
  asset: string;
  targetPrice: number;
  condition: 'above' | 'below';
}

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alert: PriceAlert) => void;
}

export function PriceAlertModal({ isOpen, onClose, onSave }: PriceAlertModalProps) {
  const [asset, setAsset] = useState('BTC');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!targetPrice || isNaN(Number(targetPrice))) return;
    
    onSave({
      id: Math.random().toString(36).substring(2, 11),
      asset,
      targetPrice: Number(targetPrice),
      condition
    });
    setTargetPrice('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-outline rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <div className="flex items-center gap-2">
            <Bell className="text-primary" size={20} />
            <h2 className="text-xl font-bold text-on-background">Create Price Alert</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-highlight rounded-lg transition-colors text-on-surface-variant">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Asset</label>
            <select 
              value={asset} 
              onChange={(e) => setAsset(e.target.value)}
              className="w-full bg-surface-dim border border-outline rounded-lg px-4 py-3 text-on-background focus:outline-none focus:border-primary transition-colors appearance-none"
            >
              <optgroup label="Crypto">
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="SOL">Solana (SOL)</option>
              </optgroup>
              <optgroup label="Precious Metals">
                <option value="GOLD">Gold (XAU)</option>
                <option value="SILVER">Silver (XAG)</option>
              </optgroup>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Condition</label>
              <select 
                value={condition} 
                onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                className="w-full bg-surface-dim border border-outline rounded-lg px-4 py-3 text-on-background focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="above">Goes Above</option>
                <option value="below">Drops Below</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Target Price ($)</label>
              <input 
                type="number" 
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-surface-dim border border-outline rounded-lg px-4 py-3 text-on-background focus:outline-none focus:border-primary transition-colors" 
                placeholder="e.g. 65000" 
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-outline flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-surface-dim border border-outline text-on-background font-bold rounded-xl hover:bg-surface-bright transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Save Alert
          </button>
        </div>
      </div>
    </div>
  );
}
