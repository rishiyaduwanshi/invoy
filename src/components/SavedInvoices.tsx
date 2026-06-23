import React, { useState, useEffect } from 'react';
import { storage, type SavedInvoice } from '../utils/storage';
import { icons } from '../constants/icons';

const Icon = ({ name, className = '' }) => (
  <span className={`inline-flex items-center justify-center ${className}`} dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />
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
    window.location.href = `/app?loadId=${id}`;
  };

  const handleCreateNew = () => {
    window.location.href = '/app';
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-[#0c100c] text-white font-['Inter'] px-4 py-12 lg:px-8 max-w-5xl mx-auto relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">My Invoices</h1>
          <p className="text-neutral-400 text-sm">Manage your saved invoices and prefilled templates. Data is saved locally in your browser.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-brand text-black font-bold px-4 py-2.5 rounded-lg hover:scale-105 transition-transform"
        >
          <Icon name="plus" /> New Invoice
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <Icon name="file" className="scale-150" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No saved invoices yet</h3>
          <p className="text-neutral-400 mb-6 text-sm max-w-sm mx-auto">Create your first invoice and click "Save Data" to keep a copy here for future use.</p>
          <button onClick={handleCreateNew} className="text-brand font-semibold hover:underline">Go to Generator →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-brand/20 text-brand px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                  {inv.data.invoiceMeta.invoiceNumber || 'No Number'}
                </div>
                <div className="text-xs text-neutral-500 font-medium">
                  {new Date(inv.updatedAt).toLocaleDateString()}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 truncate" title={inv.name}>
                {inv.name}
              </h3>
              
              <p className="text-sm text-neutral-400 mb-6 font-medium">
                {inv.data.items.length} item(s) • ₹{inv.data.items.reduce((s, i) => s + i.rate * i.quantity, 0).toLocaleString('en-IN')}
              </p>

              <div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4">
                <button
                  onClick={() => handleLoad(inv.id)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
                >
                  Edit / Load
                </button>
                <button
                  onClick={() => handleDelete(inv.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Icon name="trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
