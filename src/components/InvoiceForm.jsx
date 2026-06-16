import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES } from '../templates/index.ts';
import { PlusIcon, TrashIcon, UploadIcon } from '../constants/icons.tsx';

// ── Base Components ────────────────────────────────────────────────────
const Label = ({ children }) => (
  <label className="block text-[10px] font-bold text-indigo-200/60 uppercase tracking-widest mb-1.5">{children}</label>
);

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400/60 focus:bg-white/8 transition-all duration-200 ${className}`}
  />
);

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-10 h-5 bg-neutral-700 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
    </label>
  </div>
);

const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white/[0.04] rounded-2xl p-5 border border-white/8 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ color = 'indigo', children }) => {
  const colors = {
    indigo: 'bg-indigo-500', purple: 'bg-purple-500', blue: 'bg-blue-500',
    emerald: 'bg-emerald-500', yellow: 'bg-yellow-500', pink: 'bg-pink-500', red: 'bg-red-500',
  };
  return (
    <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
      <span className={`w-1 h-4 ${colors[color]} rounded-full`} />
      {children}
    </h2>
  );
};

// ── Main Form ──────────────────────────────────────────────────────────
export default function InvoiceForm({
  selectedTemplate, setSelectedTemplate,
  senderDetails, setSenderDetails,
  clientDetails, setClientDetails,
  invoiceMeta, setInvoiceMeta,
  items, setItems,
  taxSettings, setTaxSettings,
  contentOptions, setContentOptions,
  paymentDetails, setPaymentDetails,
  declaration, setDeclaration,
}) {
  const S = (field) => (val) => setSenderDetails(p => ({ ...p, [field]: val }));
  const C = (field) => (val) => setClientDetails(p => ({ ...p, [field]: val }));
  const M = (field) => (val) => setInvoiceMeta(p => ({ ...p, [field]: val }));
  const T = (field) => (val) => setTaxSettings(p => ({ ...p, [field]: val }));
  const CO = (field) => (val) => setContentOptions(p => ({ ...p, [field]: val }));
  const P = (field) => (val) => setPaymentDetails(p => ({ ...p, [field]: val }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => S('logo')(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => S('signature')(reader.result);
    reader.readAsDataURL(file);
  };

  const addItem = () => setItems(p => [...p, { id: Date.now(), description: '', quantity: 1, rate: 0 }]);
  const removeItem = (id) => setItems(p => p.filter(i => i.id !== id));
  const updateItem = (id, field, value) => setItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));

  return (
    <div className="space-y-4 pb-20 w-full overflow-x-hidden">

      {/* ── 1. Template ─────────────────────────────────── */}
      <SectionCard>
        <SectionTitle color="pink">Template</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all ${
                selectedTemplate === t.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/8'
              }`}
            >
              {t.emoji} {t.name}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* ── 2. Your Business ────────────────────────────── */}
      <SectionCard>
        <SectionTitle color="indigo">Your Business</SectionTitle>
        <div className="space-y-3">
          <div>
            <Label>Business / Company Name</Label>
            <Input value={senderDetails.businessName} onChange={e => S('businessName')(e.target.value)} placeholder="e.g. Invoy Technologies" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Owner / Your Name</Label>
              <Input value={senderDetails.name} onChange={e => S('name')(e.target.value)} placeholder="Full Name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={senderDetails.email} onChange={e => S('email')(e.target.value)} placeholder="you@email.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Phone</Label>
              <Input value={senderDetails.phone} onChange={e => S('phone')(e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <Label>State</Label>
              <Input value={taxSettings.senderState} onChange={e => T('senderState')(e.target.value)} placeholder="e.g. Delhi" />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Input value={senderDetails.address} onChange={e => S('address')(e.target.value)} placeholder="Full business address" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>GSTIN (optional)</Label>
              <Input value={senderDetails.gstin} onChange={e => S('gstin')(e.target.value)} placeholder="22AAAAA0000A1Z5" />
            </div>
            <div>
              <Label>Udyam Reg No (optional)</Label>
              <Input value={senderDetails.udyamNo} onChange={e => S('udyamNo')(e.target.value)} placeholder="UDYAM-XX-00-0000000" />
            </div>
          </div>
          {/* Logo */}
          <div>
            <Label>Business Logo <span className="text-neutral-600 font-normal normal-case">(optional)</span></Label>
            <div className="flex items-center gap-3">
              {senderDetails.logo ? (
                <>
                  <img src={senderDetails.logo} alt="logo" className="h-10 w-10 object-contain rounded-lg border border-white/10 bg-white/5" />
                  <button onClick={() => S('logo')(null)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                </>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 bg-white/5 border border-white/10 rounded-xl px-3 py-2 hover:bg-white/10 transition-all">
                  <UploadIcon width={14} height={14} />
                  Choose logo image
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 3. Bill To ──────────────────────────────────── */}
      <SectionCard>
        <SectionTitle color="purple">Bill To (Client)</SectionTitle>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Client Name / Company</Label>
              <Input value={clientDetails.name} onChange={e => C('name')(e.target.value)} placeholder="Client Name" />
            </div>
            <div>
              <Label>Client Email</Label>
              <Input type="email" value={clientDetails.email} onChange={e => C('email')(e.target.value)} placeholder="client@email.com" />
            </div>
          </div>
          <div>
            <Label>Client Address</Label>
            <Input value={clientDetails.address} onChange={e => C('address')(e.target.value)} placeholder="Client's full address" />
          </div>
          <div>
            <Label>Client State (for GST calculation)</Label>
            <Input value={clientDetails.state} onChange={e => C('state')(e.target.value)} placeholder="e.g. Maharashtra" />
          </div>
        </div>
      </SectionCard>

      {/* ── 4. Invoice Details ──────────────────────────── */}
      <SectionCard>
        <SectionTitle color="blue">Invoice Details</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Invoice #</Label>
            <Input value={invoiceMeta.invoiceNumber} onChange={e => M('invoiceNumber')(e.target.value)} />
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={invoiceMeta.date} onChange={e => M('date')(e.target.value)} />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={invoiceMeta.dueDate} onChange={e => M('dueDate')(e.target.value)} placeholder="Optional" />
          </div>
        </div>
      </SectionCard>

      {/* ── 5. Line Items ───────────────────────────────── */}
      <SectionCard>
        <SectionTitle color="emerald">Line Items</SectionTitle>
        <div className="space-y-2">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-2"
              >
                <div>
                  {index === 0 && <Label>Description</Label>}
                  <Input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Service or product description" />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    {index === 0 && <Label>Qty</Label>}
                    <Input type="number" min="0" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="flex-[2]">
                    {index === 0 && <Label>Rate (₹)</Label>}
                    <Input type="number" min="0" value={item.rate} onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} />
                  </div>
                  <button onClick={() => removeItem(item.id)} disabled={items.length === 1} className="shrink-0 text-neutral-600 hover:text-red-400 transition-colors pb-1.5 disabled:opacity-30">
                    <TrashIcon width={15} height={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <button onClick={addItem} className="mt-3 flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          <PlusIcon width={15} height={15} /> Add Item
        </button>
      </SectionCard>

      {/* ── 6. GST / Tax ────────────────────────────────── */}
      <SectionCard>
        <SectionTitle color="blue">Tax Settings</SectionTitle>
        <div className="space-y-4">
          <Toggle
            checked={taxSettings.applyGst}
            onChange={e => T('applyGst')(e.target.checked)}
            label="Apply GST"
            description="Calculates CGST/SGST or IGST based on states"
          />
          {taxSettings.applyGst && (
            <div>
              <Label>GST Rate</Label>
              <div className="flex gap-2">
                {[5, 12, 18, 28].map(rate => (
                  <button
                    key={rate}
                    onClick={() => T('gstRate')(rate)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                      taxSettings.gstRate === rate
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── 7. Optional Sections (toggles) ──────────────── */}
      <SectionCard>
        <SectionTitle color="yellow">Optional Sections</SectionTitle>
        <div className="space-y-4">
          <Toggle
            checked={contentOptions.showSignature}
            onChange={e => CO('showSignature')(e.target.checked)}
            label="Authorised Signature"
            description="Show signature on the invoice"
          />
          {contentOptions.showSignature && (
          <div>
            <Label>Upload Signature Image</Label>
            <div className="flex items-center gap-3">
              {senderDetails.signature ? (
                <>
                  <img src={senderDetails.signature} alt="signature" className="h-10 object-contain rounded border border-white/10 bg-white/5 px-2" />
                  <button onClick={() => S('signature')(null)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                </>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 bg-white/5 border border-white/10 rounded-xl px-3 py-2 hover:bg-white/10 transition-all">
                  <UploadIcon width={14} height={14} />
                  Choose signature image
                  <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>
          )}

          <div className="border-t border-white/5 pt-4">
            <Toggle
              checked={contentOptions.showPaymentDetails}
              onChange={e => CO('showPaymentDetails')(e.target.checked)}
              label="Payment Details"
              description="Show payment mode, status and transaction ID"
            />
          </div>
          {contentOptions.showPaymentDetails && (
            <div className="pl-4 border-l border-white/10 space-y-3">
              <div>
                <Label>Payment Mode</Label>
                <Input value={paymentDetails.mode} onChange={e => P('mode')(e.target.value)} placeholder="Bank Transfer, UPI, Cash..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Payment Status</Label>
                  <select
                    value={paymentDetails.status}
                    onChange={e => P('status')(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  >
                    <option value="Paid" className="bg-neutral-900">Paid</option>
                    <option value="Unpaid" className="bg-neutral-900">Unpaid</option>
                    <option value="Partial" className="bg-neutral-900">Partial</option>
                  </select>
                </div>
                <div>
                  <Label>Transaction ID</Label>
                  <Input value={paymentDetails.transactionId} onChange={e => P('transactionId')(e.target.value)} placeholder="TXN..." />
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-white/5 pt-4">
            <Toggle
              checked={contentOptions.showDeclaration}
              onChange={e => CO('showDeclaration')(e.target.checked)}
              label="Declaration / Terms"
              description="Add custom terms or a declaration at the bottom"
            />
          </div>
          {contentOptions.showDeclaration && (
            <div className="pl-4 border-l border-white/10">
              <Label>Declaration Text</Label>
              <textarea
                value={declaration}
                onChange={e => setDeclaration(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none"
                placeholder="Enter your terms, conditions or declaration..."
              />
            </div>
          )}
        </div>
      </SectionCard>

    </div>
  );
}
