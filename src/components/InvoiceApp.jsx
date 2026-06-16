import React, { useState } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';

// Inline SVG Icons
const Download = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" x2="12" y1="15" y2="3"/>
  </svg>
);

const ArrowLeft = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

const EditIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const EyeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function InvoiceApp() {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [downloading, setDownloading] = useState(false);
  const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'preview'

  const [senderDetails, setSenderDetails] = useState({
    name: '', email: '', address: '', gstin: '',
    logo: null, udyamNo: '', phone: '', signature: null
  });

  const [clientDetails, setClientDetails] = useState({
    name: '', email: '', address: '', state: 'Delhi'
  });

  const [invoiceMeta, setInvoiceMeta] = useState({
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: ''
  });

  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, rate: 0 }
  ]);

  const [taxSettings, setTaxSettings] = useState({
    applyGst: true, gstRate: 18, senderState: 'Delhi'
  });

  const [paymentDetails, setPaymentDetails] = useState({
    mode: 'Bank Transfer', status: 'Paid', transactionId: ''
  });

  const [declaration, setDeclaration] = useState(
    "This invoice is issued for software development and IT services.\nThe service provider is not responsible for how the software is used by the client.\nThis is a service-based engagement under MSME registration."
  );

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('invoice-preview-container');
      const opt = {
        margin: 0,
        filename: `Invoy_${invoiceMeta.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error('PDF export failed:', err);
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
    paymentDetails, setPaymentDetails,
    declaration, setDeclaration,
  };

  return (
    <div className="min-h-screen text-white font-['Inter']">

      {/* ── TOP NAV ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">

          {/* Left */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm font-medium group shrink-0">
              <ArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline text-xs">Home</span>
            </a>
            <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_0_10px_rgba(79,70,229,0.4)]">
                I
              </div>
              <span className="font-['Outfit'] font-black tracking-widest text-white text-sm sm:text-base">INVOY</span>
            </div>
          </div>

          {/* Center – Mobile tab switcher */}
          <div className="flex lg:hidden items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setMobileTab('form')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mobileTab === 'form'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <EditIcon /> Form
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mobileTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <EyeIcon /> Preview
            </button>
          </div>

          {/* Right – Download */}
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:scale-[1.03] transition-all active:scale-95 border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 shrink-0"
          >
            <Download />
            <span className="hidden sm:inline">{downloading ? 'Generating...' : 'Download PDF'}</span>
            <span className="sm:hidden">{downloading ? '...' : 'PDF'}</span>
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-8">

        {/* Template badge - visible on desktop */}
        <div className="hidden lg:flex mb-5 items-center gap-3">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Template:</span>
          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${selectedTemplate === 'classic' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'}`}>
            {selectedTemplate === 'classic' ? '⭐ Classic (MSME)' : '✨ Modern'}
          </span>
          <span className="text-xs text-neutral-600">Switch template from the form panel</span>
        </div>

        {/* ── DESKTOP: Side-by-side layout ─────────────── */}
        <div className="hidden lg:grid grid-cols-12 gap-6 xl:gap-8">

          {/* Form column */}
          <div className="col-span-5 xl:col-span-4">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 rounded-xl">
              <InvoiceForm {...sharedProps} />
            </div>
          </div>

          {/* Preview column */}
          <div className="col-span-7 xl:col-span-8">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl pointer-events-none"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                    <span className="text-xs text-neutral-500 ml-2 font-medium">Live Preview</span>
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

        {/* ── MOBILE: Tab-based layout ───────────────────── */}
        <div className="lg:hidden">
          {mobileTab === 'form' ? (
            <div className="animate-fade-in">
              <InvoiceForm {...sharedProps} />
              {/* CTA to switch to preview */}
              <button
                onClick={() => setMobileTab('preview')}
                className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                <EyeIcon />
                Preview Invoice
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Template badge on mobile */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${selectedTemplate === 'classic' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'}`}>
                  {selectedTemplate === 'classic' ? '⭐ Classic' : '✨ Modern'}
                </span>
                <span className="text-xs text-neutral-600">• Tap Edit to change</span>
              </div>

              {/* Scrollable preview container on mobile */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-3 overflow-x-auto shadow-xl">
                {/* Scale down invoice on mobile so it fits */}
                <div className="min-w-[340px] origin-top-left" style={{ transform: 'scale(0.9)', transformOrigin: 'top left', width: '111.11%' }}>
                  <InvoicePreview {...sharedProps} />
                </div>
              </div>

              {/* Download button on mobile preview tab */}
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                <Download />
                {downloading ? 'Generating PDF...' : 'Download PDF'}
              </button>

              <button
                onClick={() => setMobileTab('form')}
                className="mt-3 w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <EditIcon />
                Back to Edit Form
              </button>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out both; }
      `}</style>
    </div>
  );
}
