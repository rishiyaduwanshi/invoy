import React, { useState } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';
import { DownloadIcon, ArrowLeftIcon, EditIcon, EyeIcon } from '../constants/icons.tsx';
import { DEFAULT_TEMPLATE } from '../templates/index.ts';

export default function InvoiceApp() {
  // ── Template (only changes visual layout) ─────────────
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE);
  
  // ── UI States ──────────────────────────────────────────
  const [downloading, setDownloading] = useState(false);
  const [mobileTab, setMobileTab] = useState('form');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: string }

  // ── Sender Details ─────────────────────────────────────
  const [senderDetails, setSenderDetails] = useState({
    businessName: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    udyamNo: '',
    logo: null,
    signature: null,
  });

  // ── Client Details ─────────────────────────────────────
  const [clientDetails, setClientDetails] = useState({
    name: '',
    email: '',
    address: '',
    state: 'Delhi',
  });

  // ── Invoice Meta ───────────────────────────────────────
  const [invoiceMeta, setInvoiceMeta] = useState({
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
  });

  // ── Line Items ─────────────────────────────────────────
  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, rate: 0 },
  ]);

  // ── Tax Settings ───────────────────────────────────────
  const [taxSettings, setTaxSettings] = useState({
    applyGst: true,
    gstRate: 18,
    senderState: 'Delhi',
  });

  // ── Content Toggles (independent of template) ──────────
  const [contentOptions, setContentOptions] = useState({
    showSignature: true,
    showPaymentDetails: false,
    showDeclaration: false,
    showDueDate: true,
    showUdyamNo: false,
  });

  // ── Payment Details ────────────────────────────────────
  const [paymentDetails, setPaymentDetails] = useState({
    mode: 'Bank Transfer',
    status: 'Paid',
    transactionId: '',
  });

  // ── Declaration ────────────────────────────────────────
  const [declaration, setDeclaration] = useState(
    "This invoice is issued for software development and IT services.\nThe service provider is not responsible for how the software is used by the client.\nThis is a service-based engagement under MSME registration."
  );

  // ── PDF Download ───────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('invoice-preview-container');
      if (!element) throw new Error('Preview not found');
      const filename = `Invoy_${invoiceMeta.invoiceNumber}.pdf`;
      const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().from(element).set(opt).save();
      showToast('success', `${filename} saved to your Downloads folder ✓`);
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('error', 'PDF generation failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const sharedProps = {
    selectedTemplate, setSelectedTemplate,
    senderDetails, setSenderDetails,
    clientDetails, setClientDetails,
    invoiceMeta, setInvoiceMeta,
    items, setItems,
    taxSettings, setTaxSettings,
    contentOptions, setContentOptions,
    paymentDetails, setPaymentDetails,
    declaration, setDeclaration,
  };

  return (
    <div className="min-h-screen text-white font-['Inter'] overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
        <div className="w-full px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm group shrink-0">
              <ArrowLeftIcon className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium">Home</span>
            </a>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xs shadow-[0_0_10px_rgba(79,70,229,0.4)]">I</div>
              <span className="font-['Outfit'] font-black tracking-widest text-white text-sm sm:text-base">INVOY</span>
            </div>
          </div>

          {/* Mobile tab switcher */}
          <div className="flex lg:hidden items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
            <button onClick={() => setMobileTab('form')} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mobileTab === 'form' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
              <EditIcon /> Form
            </button>
            <button onClick={() => setMobileTab('preview')} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mobileTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
              <EyeIcon /> Preview
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:scale-[1.03] transition-all active:scale-95 border border-white/10 disabled:opacity-60 disabled:scale-100 shrink-0"
          >
            <DownloadIcon />
            <span className="hidden sm:inline">{downloading ? 'Generating...' : 'Download PDF'}</span>
            <span className="sm:hidden">{downloading ? '...' : 'PDF'}</span>
          </button>
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="w-full px-3 sm:px-4 py-4 lg:py-5">

        {/* Desktop layout */}
        <div className="hidden lg:grid grid-cols-12 gap-5">
          <div className="col-span-5 xl:col-span-4">
            <div className="sticky top-[4.5rem] max-h-[calc(100vh-5.5rem)] overflow-y-auto pr-1 scrollbar-thin">
              <InvoiceForm {...sharedProps} />
            </div>
          </div>
          <div className="col-span-7 xl:col-span-8">
            <div className="sticky top-[4.5rem] max-h-[calc(100vh-5.5rem)] overflow-y-auto">
              <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-4 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-xs text-neutral-500 ml-1 font-medium">Live Preview</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold border ${selectedTemplate === 'classic' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'}`}>
                      {selectedTemplate === 'classic' ? '⭐ Classic' : '✨ Modern'}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-600 font-mono">{invoiceMeta.invoiceNumber}</span>
                </div>
                <div className="relative z-10 shadow-[0_0_60px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden">
                  <InvoicePreview {...sharedProps} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden">
          {mobileTab === 'form' ? (
            <div>
              <InvoiceForm {...sharedProps} />
              <button onClick={() => setMobileTab('preview')} className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <EyeIcon /> Preview Invoice
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-white/5 rounded-2xl border border-white/10 p-2 shadow-xl overflow-hidden">
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '117.6%', pointerEvents: 'none' }}>
                  <InvoicePreview {...sharedProps} />
                </div>
              </div>
              <button onClick={handleDownloadPDF} disabled={downloading} className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                <DownloadIcon /> {downloading ? 'Generating...' : 'Download PDF'}
              </button>
              <button onClick={() => setMobileTab('form')} className="mt-3 w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10">
                <EditIcon /> Back to Form
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
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-fade-in ${
          toast.type === 'success'
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
