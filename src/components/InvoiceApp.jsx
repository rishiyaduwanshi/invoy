import React, { useState, useEffect } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';
import { icons } from '../constants/icons';
import { InvoiceProvider, useInvoiceContext } from '../context/InvoiceContext';
import { storage } from '../utils/storage';
import Select from './ui/Select';
import { exportPDF, exportExcel, exportCSV, exportJSON } from '../utils/fileTransfer';

// Tiny helper: render SVG string safely in React
const Icon = ({ name, className = '' }) => (
  <span className={`inline-flex items-center justify-center ${className}`} dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />
);

function InvoiceAppContent() {
  const { data, loadInvoice } = useInvoiceContext();

  // ── UI States ──────────────────────────────────────────
  const [downloading, setDownloading] = useState(false);
  const [mobileTab, setMobileTab] = useState('form');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: string }

  // ── PDF Download ───────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('invoice-preview-container');
      await exportPDF(element, data.invoiceMeta.invoiceNumber);
      showToast('success', `PDF exported successfully ✓`);
      setMobileTab('form'); // reset nav back to form view
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('error', 'PDF generation failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadJSON = () => {
    try {
      const filename = exportJSON(data);
      showToast('success', `${filename} → Downloads folder ✓`);
    } catch (err) {
      showToast('error', 'JSON export failed.');
    }
  };

  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      const filename = await exportExcel(data);
      showToast('success', `${filename} → Excel exported ✓`);
    } catch (err) {
      console.error(err);
      showToast('error', 'Excel export failed.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const filename = await exportCSV(data);
      showToast('success', `${filename} → CSV exported ✓`);
    } catch (err) {
      console.error(err);
      showToast('error', 'CSV export failed.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveInvoice = () => {
    try {
      // Find existing ID from URL if we are editing
      const params = new URLSearchParams(window.location.search);
      const existingId = params.get('loadId') || undefined;
      
      storage.save(data, existingId);
      showToast('success', 'Invoice saved successfully!');
    } catch (e) {
      showToast('error', 'Failed to save invoice.');
    }
  };

  const handleSaveDefaultProfile = () => {
    try {
      storage.saveProfile(data);
      showToast('success', 'Business profile set as default!');
    } catch (e) {
      showToast('error', 'Failed to save default profile.');
    }
  };

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('loadId');
      if (id) {
        // Load the specific saved invoice
        const saved = storage.getById(id);
        if (saved) {
          loadInvoice(saved.data);
        }
      } else {
        // If creating a new invoice, load the default business profile (if any)
        const defaultProfile = storage.getProfile();
        if (defaultProfile) {
          // Merge default profile into current empty state
          loadInvoice({ ...data, ...defaultProfile });
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen text-white font-['Inter'] overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Left: back + logo */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm group shrink-0">
              <Icon name="arrow-left" className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium">Home</span>
            </a>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <a href="/" className="flex items-center gap-1.5 shrink-0">
              <img src="/invoy_favicon.png" alt="invoy" className="w-7 h-7" />
              <span className="font-['Outfit'] font-black text-white text-lg tracking-normal lowercase">invoy</span>
            </a>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <a href="/invoices" className="hidden sm:flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm font-medium shrink-0">
              <Icon name="file" /> My Invoices
            </a>
          </div>

          {/* Center (mobile): tab switcher */}
          <div className="flex lg:hidden items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
            <button onClick={() => setMobileTab('form')} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mobileTab === 'form' ? 'bg-brand text-black' : 'text-neutral-400 hover:text-white'}`}>
              <Icon name="edit" /> Form
            </button>
            <button onClick={() => setMobileTab('preview')} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mobileTab === 'preview' ? 'bg-brand text-black' : 'text-neutral-400 hover:text-white'}`}>
              <Icon name="eye" /> Preview
            </button>
          </div>

          {/* Right: export dropdown */}
          <div className="hidden sm:block w-40">
            <Select
              value=""
              onChange={val => {
                if (val === 'pdf') handleDownloadPDF();
                if (val === 'excel') handleDownloadExcel();
                if (val === 'csv') handleDownloadCSV();
                if (val === 'json') handleDownloadJSON();
              }}
              options={[
                { label: 'PDF Document (.pdf)', value: 'pdf', icon: 'file-pdf' },
                { label: 'Excel Sheet (.xlsx)', value: 'excel', icon: 'file-spreadsheet' },
                { label: 'CSV Spreadsheet (.csv)', value: 'csv', icon: 'file-text' },
                { label: 'JSON Schema (.json)', value: 'json', icon: 'file-code' }
              ]}
              placeholder={downloading ? 'PDF...' : 'Export'}
              variant="primary"
              leftIcon={<Icon name="download" className="w-4 h-4 shrink-0" />}
            />
          </div>
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="w-full px-3 sm:px-4 py-4 lg:py-5">

        {/* Desktop layout */}
        <div className="hidden lg:grid grid-cols-12 gap-5">
          <div className="col-span-5 xl:col-span-4">
            <div className="sticky top-[4.5rem] max-h-[calc(100vh-5.5rem)] overflow-y-auto pr-1 scrollbar-thin">
              <InvoiceForm />
            </div>
          </div>
          <div className="col-span-7 xl:col-span-8">
            <div className="sticky top-[4.5rem] max-h-[calc(100vh-5.5rem)] overflow-y-auto">
              <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/8 p-4 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/3 via-transparent to-green-900/5 rounded-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-xs text-neutral-500 ml-1 font-medium">Live Preview</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold border ${data.template === 'classic' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-green-500/10 border-green-500/30 text-green-300'}`}>
                      {data.template === 'classic' ? '⭐ Classic' : '✨ Modern'}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-600 font-mono">{data.invoiceMeta.invoiceNumber}</span>
                </div>
                <div className="relative z-10 shadow-[0_0_60px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden">
                  <InvoicePreview template={data.template} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden">
          {mobileTab === 'form' ? (
            <div>
              <InvoiceForm />
              <button onClick={() => setMobileTab('preview')} className="mt-4 w-full py-3.5 rounded-2xl bg-brand text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#16a34a] transition-colors">
                <Icon name="eye" /> Preview Invoice
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-white/5 rounded-2xl border border-white/10 p-2 shadow-xl overflow-hidden">
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '117.6%', pointerEvents: 'none' }}>
                  <InvoicePreview template={data.template} data={data} />
                </div>
              </div>
              <div className="mt-4">
                <Select
                  value=""
                  onChange={val => {
                    if (val === 'pdf') handleDownloadPDF();
                    if (val === 'excel') handleDownloadExcel();
                    if (val === 'csv') handleDownloadCSV();
                    if (val === 'json') handleDownloadJSON();
                  }}
                  options={[
                    { label: 'PDF Document (.pdf)', value: 'pdf', icon: 'file-pdf' },
                    { label: 'Excel Sheet (.xlsx)', value: 'excel', icon: 'file-spreadsheet' },
                    { label: 'CSV Spreadsheet (.csv)', value: 'csv', icon: 'file-text' },
                    { label: 'JSON Schema (.json)', value: 'json', icon: 'file-code' }
                  ]}
                  placeholder={downloading ? 'Generating PDF...' : 'Export'}
                  variant="primary"
                  direction="up"
                  leftIcon={<Icon name="download" className="w-4 h-4 shrink-0" />}
                  className="w-full"
                />
              </div>
              <button onClick={() => setMobileTab('form')} className="mt-3 w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10">
                <Icon name="edit" /> Back to Form
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 3px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
      `}</style>

      {/* ── Toast Notification ───────────────────────────── */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-fade-in ${toast.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300 shadow-emerald-900/40'
            : 'bg-red-950/90 border-red-500/40 text-red-300'
          }`}>
          <span className="text-base">{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default function InvoiceApp() {
  return (
    <InvoiceProvider>
      <InvoiceAppContent />
    </InvoiceProvider>
  );
}
