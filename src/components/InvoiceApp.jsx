import React, { useState } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';

// Inline SVG components to bypass lucide-react SSR CommonJS bugs
const Download = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const Github = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.1-.34 6.33-1.53 6.33-6.81a5.02 5.02 0 0 0-1.3-3.41 4.67 4.67 0 0 0-.1-3.37s-1.03-.33-3.37 1.25a11.62 11.62 0 0 0-6.2 0C6.03 1.07 5 1.4 5 1.4a4.67 4.67 0 0 0-.1 3.37 5.02 5.02 0 0 0-1.3 3.41c0 5.28 3.23 6.47 6.33 6.81a4.8 4.8 0 0 0-1 3.02v4"/><path d="M9 20c-3 1-5-1-6-2"/></svg>;
const Globe = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>;


export default function InvoiceApp() {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const [senderDetails, setSenderDetails] = useState({
    name: 'Abhinav',
    email: 'abhinav@example.com',
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
    { id: 1, description: 'Web Development Services', quantity: 1, rate: 5000 }
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
    "1. This invoice is issued for software development and IT services.\n2. The service provider is not responsible for how the software is used by the client.\n3. This is a service-based engagement under MSME registration."
  );

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-preview-container');
    const opt = {
      margin: 0,
      filename: `Invoice_${invoiceMeta.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    // Dynamically import html2pdf to avoid SSR 'self is not defined' error
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="min-h-screen text-white font-['Inter'] selection:bg-indigo-500/30">
      
      {/* Top Navigation Bar */}
      <nav className="w-full border-b border-white/5 bg-white/5 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="text-sm font-semibold tracking-widest text-indigo-400 uppercase">
            iamabhinav.dev
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="https://iamabhinav.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
              <Globe className="w-4 h-4" /> Portfolio
            </a>
            <a href="https://github.iamabhinav.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 relative z-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-['Outfit'] bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 pb-2">
              Invoice Generator
            </h1>
            <p className="mt-1 text-neutral-400 font-medium tracking-wide">
              Create professional GST invoices instantly.
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:scale-[1.02] transition-all active:scale-95 border border-white/10"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 xl:col-span-4 h-[calc(100vh-12rem)] overflow-y-auto pr-2 custom-scrollbar">
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
          
          <div className="lg:col-span-7 xl:col-span-8 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-4 lg:p-8 flex justify-center items-start overflow-y-auto h-[calc(100vh-12rem)] shadow-2xl relative">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl pointer-events-none"></div>
             <div className="w-full max-w-[800px] shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 transition-transform duration-500 hover:scale-[1.01]">
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
  );
}
