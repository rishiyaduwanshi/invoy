import React, { useState } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';

// Inline SVG Icons
const Download = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" x2="12" y1="15" y2="3"/>
  </svg>
);

const ArrowLeft = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

export default function InvoiceApp() {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [downloading, setDownloading] = useState(false);

  const [senderDetails, setSenderDetails] = useState({
    name: '',
    email: '',
    address: '',
    gstin: '',
    logo: null,
    udyamNo: '',
    phone: '',
    signature: null
  });

  const [clientDetails, setClientDetails] = useState({
    name: '',
    email: '',
    address: '',
    state: 'Delhi'
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
    applyGst: true,
    gstRate: 18,
    senderState: 'Delhi'
  });

  const [paymentDetails, setPaymentDetails] = useState({
    mode: 'Bank Transfer',
    status: 'Paid',
    transactionId: ''
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

  return (
    <div className="min-h-screen text-white font-['Inter']">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Logo + Back */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm font-medium group">
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Home</span>
            </a>
            <div className="w-px h-5 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(79,70,229,0.4)]">
                I
              </div>
              <span className="font-['Outfit'] font-black tracking-widest text-white text-base">INVOY</span>
            </div>
          </div>

          {/* Center: Page Title */}
          <div className="hidden md:block text-center">
            <h1 className="text-sm font-semibold text-neutral-300">Invoice Generator</h1>
          </div>

          {/* Right: Download Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:scale-[1.03] transition-all active:scale-95 border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            <Download />
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        
        {/* Template Badge */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Template:</span>
          <span className={`text-xs px-3 py-1 rounded-full font-bold border transition-all ${selectedTemplate === 'classic' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'}`}>
            {selectedTemplate === 'classic' ? '⭐ Classic (MSME)' : '✨ Modern'}
          </span>
          <span className="text-xs text-neutral-600">Switch in the Select Template section below</span>
        </div>

        {/* Two-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
          
          {/* Left: Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              <InvoiceForm
                selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}
                senderDetails={senderDetails} setSenderDetails={setSenderDetails}
                clientDetails={clientDetails} setClientDetails={setClientDetails}
                invoiceMeta={invoiceMeta} setInvoiceMeta={setInvoiceMeta}
                items={items} setItems={setItems}
                taxSettings={taxSettings} setTaxSettings={setTaxSettings}
                paymentDetails={paymentDetails} setPaymentDetails={setPaymentDetails}
                declaration={declaration} setDeclaration={setDeclaration}
              />
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-4 lg:p-6 shadow-2xl relative overflow-hidden">
                {/* Glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl pointer-events-none"></div>
                
                {/* Preview header */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                    </div>
                    <span className="text-xs text-neutral-500 ml-2 font-medium">Live Preview</span>
                  </div>
                  <span className="text-xs text-neutral-600 font-medium">{invoiceMeta.invoiceNumber}</span>
                </div>

                {/* Invoice preview */}
                <div className="relative z-10 shadow-[0_0_60px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden transition-transform duration-300 hover:scale-[1.005]">
                  <InvoicePreview
                    selectedTemplate={selectedTemplate}
                    senderDetails={senderDetails}
                    clientDetails={clientDetails}
                    invoiceMeta={invoiceMeta}
                    items={items}
                    taxSettings={taxSettings}
                    paymentDetails={paymentDetails}
                    declaration={declaration}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
