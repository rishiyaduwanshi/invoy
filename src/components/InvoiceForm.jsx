import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Inline SVG components to bypass lucide-react SSR CommonJS bugs
const Plus = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>;
const Trash2 = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;


const InputLabel = ({ children }) => (
  <label className="block text-xs font-semibold text-indigo-200/70 uppercase tracking-widest mb-1.5">{children}</label>
);

const Input = (props) => (
  <input 
    {...props} 
    className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:bg-white/10 transition-all duration-300 shadow-inner shadow-black/20 ${props.className || ''}`}
  />
);

export default function InvoiceForm({
  selectedTemplate, setSelectedTemplate,
  senderDetails, setSenderDetails,
  clientDetails, setClientDetails,
  invoiceMeta, setInvoiceMeta,
  items, setItems,
  taxSettings, setTaxSettings,
  paymentDetails, setPaymentDetails,
  declaration, setDeclaration
}) {
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, rate: 0 }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSenderDetails({ ...senderDetails, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSenderDetails({ ...senderDetails, signature: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-20 font-['Inter'] w-full overflow-x-hidden">

      {/* Template Selection */}
      <section className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><span className="w-1.5 h-5 bg-pink-500 rounded-full"></span>Select Template</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setSelectedTemplate('modern')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold border transition-all ${selectedTemplate === 'modern' ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'}`}
          >
            Modern
          </button>
          <button 
            onClick={() => setSelectedTemplate('classic')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold border transition-all ${selectedTemplate === 'classic' ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'}`}
          >
            Classic (MSME)
          </button>
        </div>
      </section>
      
      {/* Sender Details */}
      <section className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>Your Details (Sender)</h2>
        <div className="space-y-4">
          <div>
            <InputLabel>Business Logo</InputLabel>
            <input type="file" accept="image/*" onChange={handleLogoUpload}
              className="w-full text-sm text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all" />
          </div>
          <div>
            <InputLabel>Authorised Signature</InputLabel>
            <input type="file" accept="image/*" onChange={handleSignatureUpload}
              className="w-full text-sm text-neutral-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all" />
          </div>
          <div>
            <InputLabel>Business Name</InputLabel>
            <Input value={senderDetails.businessName} onChange={(e) => setSenderDetails({...senderDetails, businessName: e.target.value})} placeholder="Your Company / Business Name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel>Owner / Contact Name</InputLabel>
              <Input value={senderDetails.name} onChange={(e) => setSenderDetails({...senderDetails, name: e.target.value})} placeholder="Your Full Name" />
            </div>
            <div>
              <InputLabel>Email</InputLabel>
              <Input value={senderDetails.email} onChange={(e) => setSenderDetails({...senderDetails, email: e.target.value})} placeholder="Email" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel>Phone</InputLabel>
              <Input value={senderDetails.phone} onChange={(e) => setSenderDetails({...senderDetails, phone: e.target.value})} placeholder="Phone Number" />
            </div>
            <div>
              <InputLabel>Udyam Reg No</InputLabel>
              <Input value={senderDetails.udyamNo} onChange={(e) => setSenderDetails({...senderDetails, udyamNo: e.target.value})} placeholder="UDYAM-XX-XX-XXXX" />
            </div>
          </div>
          <div>
            <InputLabel>Address</InputLabel>
            <Input value={senderDetails.address} onChange={(e) => setSenderDetails({...senderDetails, address: e.target.value})} placeholder="Full Address" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel>GSTIN</InputLabel>
              <Input value={senderDetails.gstin} onChange={(e) => setSenderDetails({...senderDetails, gstin: e.target.value})} placeholder="Optional GSTIN" />
            </div>
            <div>
              <InputLabel>State</InputLabel>
              <Input value={taxSettings.senderState} onChange={(e) => setTaxSettings({...taxSettings, senderState: e.target.value})} placeholder="e.g. Delhi" />
            </div>
          </div>
        </div>
      </section>

      {/* Client Details */}
      <section className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><span className="w-1.5 h-5 bg-purple-500 rounded-full"></span>Bill To (Client)</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel>Client Name</InputLabel>
              <Input value={clientDetails.name} onChange={(e) => setClientDetails({...clientDetails, name: e.target.value})} placeholder="Client Company or Name" />
            </div>
            <div>
              <InputLabel>Client Email</InputLabel>
              <Input value={clientDetails.email} onChange={(e) => setClientDetails({...clientDetails, email: e.target.value})} placeholder="Client Email Address" />
            </div>
          </div>
          <div>
            <InputLabel>Address</InputLabel>
            <Input value={clientDetails.address} onChange={(e) => setClientDetails({...clientDetails, address: e.target.value})} placeholder="Client Address" />
          </div>
          <div>
            <InputLabel>State of Supply (For IGST/CGST logic)</InputLabel>
            <Input value={clientDetails.state} onChange={(e) => setClientDetails({...clientDetails, state: e.target.value})} placeholder="e.g. Maharashtra" />
          </div>
        </div>
      </section>

      {/* Invoice Meta */}
      <section className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>Invoice Meta</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <InputLabel>Invoice #</InputLabel>
            <Input value={invoiceMeta.invoiceNumber} onChange={(e) => setInvoiceMeta({...invoiceMeta, invoiceNumber: e.target.value})} />
          </div>
          <div>
            <InputLabel>Date</InputLabel>
            <Input type="date" value={invoiceMeta.date} onChange={(e) => setInvoiceMeta({...invoiceMeta, date: e.target.value})} />
          </div>
          <div>
            <InputLabel>Due Date</InputLabel>
            <Input type="date" value={invoiceMeta.dueDate} onChange={(e) => setInvoiceMeta({...invoiceMeta, dueDate: e.target.value})} />
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>Line Items</h2>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-700/30 space-y-2"
              >
                {/* Description - full width */}
                <div>
                  {index === 0 && <InputLabel>Description</InputLabel>}
                  <Input value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} placeholder="Item description" />
                </div>
                {/* Qty, Rate, Delete - in a row */}
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    {index === 0 && <InputLabel>Qty</InputLabel>}
                    <Input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="flex-[2]">
                    {index === 0 && <InputLabel>Rate (₹)</InputLabel>}
                    <Input type="number" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)} />
                  </div>
                  <button onClick={() => removeItem(item.id)} className="shrink-0 text-neutral-500 hover:text-red-400 transition-colors pb-1.5">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <button onClick={addItem} className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </section>

      {/* Tax Settings */}
      <section className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Apply GST</h2>
            <p className="text-sm text-indigo-200/70">Calculates CGST/SGST or IGST based on State.</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={taxSettings.applyGst} onChange={(e) => setTaxSettings({...taxSettings, applyGst: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            {taxSettings.applyGst && (
              <select 
                value={taxSettings.gstRate} 
                onChange={(e) => setTaxSettings({...taxSettings, gstRate: parseFloat(e.target.value)})}
                className="bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              >
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            )}
          </div>
        </div>
      </section>

      {/* Payment Details */}
      {selectedTemplate === 'classic' && (
        <section className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><span className="w-1.5 h-5 bg-yellow-500 rounded-full"></span>Payment Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <InputLabel>Payment Mode</InputLabel>
              <Input value={paymentDetails.mode} onChange={(e) => setPaymentDetails({...paymentDetails, mode: e.target.value})} placeholder="Bank Transfer, UPI, etc." />
            </div>
            <div>
              <InputLabel>Payment Status</InputLabel>
              <select 
                value={paymentDetails.status} 
                onChange={(e) => setPaymentDetails({...paymentDetails, status: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:bg-white/10 transition-all duration-300"
              >
                <option value="Paid" className="bg-neutral-800">Paid</option>
                <option value="Unpaid" className="bg-neutral-800">Unpaid</option>
              </select>
            </div>
            <div>
              <InputLabel>Transaction ID</InputLabel>
              <Input value={paymentDetails.transactionId} onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})} placeholder="e.g. TXN123456" />
            </div>
          </div>
        </section>
      )}

      {/* Declaration */}
      {selectedTemplate === 'classic' && (
        <section className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2"><span className="w-1.5 h-5 bg-red-500 rounded-full"></span>Declaration</h2>
          <textarea 
            value={declaration}
            onChange={(e) => setDeclaration(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:bg-white/10 transition-all duration-300 shadow-inner shadow-black/20 min-h-[100px]"
            placeholder="Enter declaration bullet points"
          />
        </section>
      )}

    </div>
  );
}
