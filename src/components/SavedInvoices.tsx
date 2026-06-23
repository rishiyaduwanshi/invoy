import React, { useState, useEffect } from 'react';
import { storage, type SavedInvoice } from '../utils/storage';
import { icons } from '../constants/icons';
import { navigate } from 'astro:transitions/client';

interface IconProps {
  name: string;
  className?: string;
}

const Icon = ({ name, className = '' }: IconProps) => (
  <span className={`inline-flex items-center justify-center ${className}`} dangerouslySetInnerHTML={{ __html: icons[name as keyof typeof icons] ?? '' }} />
);

export default function SavedInvoices() {
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setInvoices(storage.getAll());
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this saved invoice?')) {
      storage.delete(id);
      setInvoices(storage.getAll());
    }
  };

  const handleLoad = (id: string) => {
    navigate(`/app?loadId=${id}`);
  };

  const handleCreateNew = () => {
    navigate('/app');
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen text-white font-['Inter'] px-4 py-10 sm:py-16 max-w-5xl mx-auto relative z-10">
      
      {/* Decorative Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand/10 blur-[120px] pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-3">
            My <span className="text-brand">Invoices</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-lg">
            Manage your saved invoices and prefilled templates. Data is saved securely in your browser.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 bg-brand text-black font-bold px-6 py-3 sm:py-3.5 rounded-xl hover:bg-[#16a34a] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] shrink-0"
        >
          <Icon name="plus" className="w-5 h-5" /> 
          <span>New Invoice</span>
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 sm:p-20 text-center relative overflow-hidden group backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-500 group-hover:scale-110 group-hover:text-brand transition-all duration-500 relative z-10">
            <Icon name="file" className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black font-['Outfit'] text-white mb-3 relative z-10">No saved invoices yet</h3>
          <p className="text-neutral-400 mb-8 text-sm sm:text-base max-w-sm mx-auto relative z-10">
            Create your first invoice and click "Save Invoice" to keep a copy here for future use.
          </p>
          <button 
            onClick={handleCreateNew} 
            className="text-brand font-bold hover:text-white transition-colors flex items-center gap-2 mx-auto relative z-10 group-hover:bg-brand/10 px-6 py-3 rounded-full"
          >
            Go to Generator <Icon name="chevron-down" className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {invoices.map((inv) => {
            const total = inv.data.items.reduce((s, i) => s + i.rate * i.quantity, 0);
            return (
              <div 
                key={inv.id} 
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col backdrop-blur-sm relative overflow-hidden"
              >
                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="bg-brand/10 text-brand border border-brand/20 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                    {inv.data.invoiceMeta.invoiceNumber || 'No Number'}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-semibold bg-black/30 px-2 py-1 rounded-md">
                    {new Date(inv.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-brand transition-colors relative z-10" title={inv.name}>
                  {inv.name}
                </h3>
                
                <div className="flex items-center gap-3 text-sm text-neutral-400 mb-6 font-medium relative z-10">
                  <div className="flex items-center gap-1.5">
                    <Icon name="file" className="w-3.5 h-3.5" />
                    {inv.data.items.length} item(s)
                  </div>
                  <div className="w-1 h-1 rounded-full bg-neutral-600"></div>
                  <div className="text-neutral-300">
                    ₹{total.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-2 pt-4 border-t border-white/10 relative z-10">
                  <button
                    onClick={() => handleLoad(inv.id)}
                    className="flex-1 bg-white/5 hover:bg-white/15 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95 border border-white/5 hover:border-white/10 flex items-center justify-center gap-2"
                  >
                    Edit / Load
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 p-2.5 rounded-xl transition-all active:scale-95 border border-transparent hover:border-red-500/20 flex items-center justify-center"
                    title="Delete Invoice"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
