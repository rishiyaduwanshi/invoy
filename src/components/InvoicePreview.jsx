import React from 'react';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

function calcTax({ items, taxSettings, senderDetails, clientDetails }) {
  const subtotal = items.reduce((s, i) => s + i.rate * i.quantity, 0);
  const isInter = (taxSettings.senderState || '').toLowerCase() !== (clientDetails.state || '').toLowerCase();
  let cgst = 0, sgst = 0, igst = 0;
  if (taxSettings.applyGst && taxSettings.gstRate) {
    if (isInter && clientDetails.state) igst = subtotal * (taxSettings.gstRate / 100);
    else {
      cgst = subtotal * ((taxSettings.gstRate / 2) / 100);
      sgst = subtotal * ((taxSettings.gstRate / 2) / 100);
    }
  }
  return { subtotal, cgst, sgst, igst, isInter, grand: subtotal + cgst + sgst + igst };
}

// ── Shared bottom section: Payment + Declaration + Signature ──────────────
function InvoiceBottom({ senderDetails, contentOptions, paymentDetails, declaration }) {
  const showAny = contentOptions.showSignature || contentOptions.showPaymentDetails || contentOptions.showDeclaration;
  if (!showAny) return null;

  return (
    <>
      <div className="border-t border-gray-200 my-6" />

      {/* Payment Details */}
      {contentOptions.showPaymentDetails && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 text-sm mb-2">Payment Details</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-gray-700">
            {paymentDetails.mode && <p><span className="text-gray-500">Mode:</span> {paymentDetails.mode}</p>}
            <p>
              <span className="text-gray-500">Status:</span>{' '}
              <span className={`px-2 py-0.5 rounded text-white text-xs font-bold ${paymentDetails.status === 'Paid' ? 'bg-green-500' : paymentDetails.status === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {paymentDetails.status}
              </span>
            </p>
            {paymentDetails.transactionId && <p><span className="text-gray-500">Transaction ID:</span> <strong>{paymentDetails.transactionId}</strong></p>}
          </div>
        </div>
      )}

      {/* Declaration + Signature row */}
      {(contentOptions.showDeclaration || contentOptions.showSignature) && (
        <div className="flex justify-between items-end gap-6">
          {/* Declaration */}
          <div className="flex-1">
            {contentOptions.showDeclaration && (
              <>
                <h3 className="font-bold text-gray-800 text-sm mb-2">Declaration</h3>
                <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1 leading-relaxed">
                  {(declaration || '').split('\n').filter(Boolean).map((line, i) => (
                    <li key={i}>{line.replace(/^\d+\.\s*/, '')}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Signature */}
          {contentOptions.showSignature && (
            <div className="flex flex-col items-center min-w-[160px]">
              <p className="text-xs font-bold text-gray-700 mb-3 self-start">Authorised Signature</p>
              {senderDetails.signature ? (
                <img src={senderDetails.signature} alt="Signature" className="h-14 object-contain mb-2" />
              ) : (
                <div className="h-14 w-full border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-300 text-xs italic mb-2">
                  Signature Here
                </div>
              )}
              <div className="w-full border-t border-gray-400 pt-1 text-center text-xs text-gray-700 font-semibold">
                {senderDetails.businessName || senderDetails.name || 'Authorised Signatory'}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// CLASSIC TEMPLATE
// ══════════════════════════════════════════════════════════════════════════
function ClassicTemplate({ senderDetails, clientDetails, invoiceMeta, items, taxSettings, contentOptions, paymentDetails, declaration }) {
  const { subtotal, cgst, sgst, igst, isInter, grand } = calcTax({ items, taxSettings, senderDetails, clientDetails });

  return (
    <div id="invoice-preview-container" className="bg-white text-black p-8 min-h-[1056px] w-full font-sans border border-gray-200">

      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-3">
          {senderDetails.logo && (
            <img src={senderDetails.logo} alt="logo" className="h-12 object-contain" />
          )}
          <h1 className="text-2xl font-bold tracking-widest text-[#1B365D] uppercase">
            {senderDetails.businessName || senderDetails.name || 'YOUR COMPANY'}
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-[10px] font-bold text-center leading-tight text-gray-700">
            <div className="text-xl mb-0.5">🏛️</div>GOVT OF INDIA
          </div>
          <div className="text-[10px] font-bold text-center leading-tight text-[#1B365D] border-l border-gray-300 pl-4">
            <div className="text-2xl font-black tracking-tighter">MSME</div>
            MICRO, SMALL &amp; MEDIUM ENTERPRISES
          </div>
        </div>
      </div>

      {/* Title bar */}
      <div className="bg-[#4472C4] text-white px-6 py-2 flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold tracking-wide">TAX INVOICE</h2>
        <div className="font-semibold">📄 {invoiceMeta.invoiceNumber || 'INV-000'}</div>
      </div>

      {/* Invoice meta */}
      <div className="flex justify-between px-6 mb-6 text-sm font-semibold text-gray-800">
        <div>Invoice No: <span className="font-normal text-[#4472C4]">{invoiceMeta.invoiceNumber || 'INV-000'}</span></div>
        <div>Date: <span className="font-normal">{invoiceMeta.date || 'N/A'}</span></div>
        {invoiceMeta.dueDate && <div>Due: <span className="font-normal">{invoiceMeta.dueDate}</span></div>}
      </div>

      {/* FROM / TO */}
      <div className="flex border-t border-b border-gray-200 mb-6">
        <div className="w-1/2 p-5 border-r border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 text-xs uppercase tracking-widest">From</h3>
          <div className="text-sm space-y-1">
            {senderDetails.businessName && <p><span className="text-gray-500">Business:</span> <strong>{senderDetails.businessName}</strong></p>}
            {senderDetails.name && <p><span className="text-gray-500">Name:</span> {senderDetails.name}</p>}
            {senderDetails.gstin && <p><span className="text-gray-500">GSTIN:</span> <strong>{senderDetails.gstin}</strong></p>}
            {senderDetails.udyamNo && <p><span className="text-gray-500">Udyam:</span> {senderDetails.udyamNo}</p>}
            {senderDetails.address && <p className="flex gap-1"><span className="text-gray-500 shrink-0">Address:</span> <span>{senderDetails.address}</span></p>}
            {senderDetails.email && <p><span className="text-gray-500">Email:</span> {senderDetails.email}</p>}
            {senderDetails.phone && <p><span className="text-gray-500">Phone:</span> {senderDetails.phone}</p>}
          </div>
        </div>
        <div className="w-1/2 p-5">
          <h3 className="font-bold text-gray-800 mb-3 text-xs uppercase tracking-widest">Billed To</h3>
          <div className="text-sm space-y-1">
            <p><strong className="text-base">{clientDetails.name || 'Client Name'}</strong></p>
            {clientDetails.address && <p className="text-gray-700 whitespace-pre-wrap">{clientDetails.address}</p>}
            {clientDetails.email && <p className="text-gray-700">{clientDetails.email}</p>}
            {clientDetails.state && <p className="text-gray-600 text-xs">State: {clientDetails.state}</p>}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mb-6 border border-gray-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#4472C4] text-white text-sm">
              <th className="py-2.5 px-4 font-semibold w-[55%]">Service / Description</th>
              <th className="py-2.5 px-4 font-semibold text-center w-16">Qty</th>
              <th className="py-2.5 px-4 font-semibold text-right">Rate</th>
              <th className="py-2.5 px-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 text-sm">
                <td className="py-3 px-4 text-gray-800">{item.description || '—'}</td>
                <td className="py-3 px-4 text-center text-gray-800">{item.quantity}</td>
                <td className="py-3 px-4 text-right text-gray-800">{fmt(item.rate)}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-900">{fmt(item.quantity * item.rate)}</td>
              </tr>
            ))}
            <tr className="border-t border-gray-300 bg-gray-50 text-sm">
              <td colSpan={3} className="py-2 px-4 text-right text-gray-600 font-medium">Subtotal</td>
              <td className="py-2 px-4 text-right font-semibold">{fmt(subtotal)}</td>
            </tr>
            {taxSettings.applyGst && isInter && (
              <tr className="text-sm">
                <td colSpan={3} className="py-2 px-4 text-right text-gray-600">IGST ({taxSettings.gstRate}%)</td>
                <td className="py-2 px-4 text-right font-medium">{fmt(igst)}</td>
              </tr>
            )}
            {taxSettings.applyGst && !isInter && (
              <>
                <tr className="text-sm">
                  <td colSpan={3} className="py-2 px-4 text-right text-gray-600">CGST ({taxSettings.gstRate / 2}%)</td>
                  <td className="py-2 px-4 text-right font-medium">{fmt(cgst)}</td>
                </tr>
                <tr className="text-sm">
                  <td colSpan={3} className="py-2 px-4 text-right text-gray-600">SGST ({taxSettings.gstRate / 2}%)</td>
                  <td className="py-2 px-4 text-right font-medium">{fmt(sgst)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <div className="bg-gradient-to-r from-[#4472C4] to-[#2a56a8] text-white flex justify-between items-center px-4 py-3">
          <span className="font-semibold text-lg">Total Amount</span>
          <span className="font-bold text-xl">{fmt(grand)}</span>
        </div>
      </div>

      <InvoiceBottom senderDetails={senderDetails} contentOptions={contentOptions} paymentDetails={paymentDetails} declaration={declaration} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MODERN TEMPLATE
// ══════════════════════════════════════════════════════════════════════════
function ModernTemplate({ senderDetails, clientDetails, invoiceMeta, items, taxSettings, contentOptions, paymentDetails, declaration }) {
  const { subtotal, cgst, sgst, igst, isInter, grand } = calcTax({ items, taxSettings, senderDetails, clientDetails });

  return (
    <div id="invoice-preview-container" className="bg-white text-black p-10 min-h-[1056px] w-full font-sans">

      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          {senderDetails.logo && (
            <img src={senderDetails.logo} alt="logo" className="h-14 object-contain mb-3" />
          )}
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight uppercase font-['Outfit']">INVOICE</h1>
          <p className="text-gray-400 mt-1 font-medium text-sm">#{invoiceMeta.invoiceNumber || 'INV-000'}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-900">{senderDetails.businessName || senderDetails.name || 'Your Company'}</h2>
          {senderDetails.businessName && senderDetails.name && <p className="text-sm text-gray-600 mt-0.5">{senderDetails.name}</p>}
          {senderDetails.address && <p className="text-sm text-gray-500 mt-1 max-w-[220px] whitespace-pre-wrap">{senderDetails.address}</p>}
          {senderDetails.email && <p className="text-sm text-gray-500 mt-0.5">{senderDetails.email}</p>}
          {senderDetails.phone && <p className="text-sm text-gray-500 mt-0.5">{senderDetails.phone}</p>}
          {senderDetails.gstin && <p className="text-xs font-bold text-gray-700 mt-1 bg-gray-100 px-2 py-0.5 rounded inline-block">GSTIN: {senderDetails.gstin}</p>}
          {senderDetails.udyamNo && <p className="text-xs text-gray-500 mt-0.5">Udyam: {senderDetails.udyamNo}</p>}
        </div>
      </div>

      <div className="border-t-2 border-gray-900 mb-8" />

      {/* Billed To + Meta */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
          <h3 className="text-lg font-bold text-gray-800">{clientDetails.name || 'Client Name'}</h3>
          {clientDetails.address && <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{clientDetails.address}</p>}
          {clientDetails.email && <p className="text-sm text-gray-500 mt-0.5">{clientDetails.email}</p>}
          {clientDetails.state && <p className="text-xs text-gray-400 mt-1">State of Supply: <span className="font-semibold text-gray-600">{clientDetails.state}</span></p>}
        </div>
        <div className="text-right space-y-2">
          <div className="text-sm"><span className="text-gray-500">Invoice Date:</span> <span className="font-semibold text-gray-800 ml-2">{invoiceMeta.date || 'N/A'}</span></div>
          {invoiceMeta.dueDate && <div className="text-sm"><span className="text-gray-500">Due Date:</span> <span className="font-semibold text-gray-800 ml-2">{invoiceMeta.dueDate}</span></div>}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-900 text-xs uppercase tracking-wider">
              <th className="py-3 font-black text-gray-800">Description</th>
              <th className="py-3 font-black text-gray-800 text-center w-20">Qty</th>
              <th className="py-3 font-black text-gray-800 text-right w-28">Rate</th>
              <th className="py-3 font-black text-gray-800 text-right w-28">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 text-sm">
                <td className="py-4 text-gray-800">{item.description || '—'}</td>
                <td className="py-4 text-gray-800 text-center">{item.quantity}</td>
                <td className="py-4 text-gray-800 text-right">{fmt(item.rate)}</td>
                <td className="py-4 font-semibold text-gray-900 text-right">{fmt(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span className="font-medium text-gray-800">{fmt(subtotal)}</span>
          </div>
          {taxSettings.applyGst && isInter && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>IGST ({taxSettings.gstRate}%)</span><span className="font-medium text-gray-800">{fmt(igst)}</span>
            </div>
          )}
          {taxSettings.applyGst && !isInter && (
            <>
              <div className="flex justify-between text-sm text-gray-600">
                <span>CGST ({taxSettings.gstRate / 2}%)</span><span className="font-medium text-gray-800">{fmt(cgst)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>SGST ({taxSettings.gstRate / 2}%)</span><span className="font-medium text-gray-800">{fmt(sgst)}</span>
              </div>
            </>
          )}
          <div className="border-t-2 border-gray-900 pt-3 flex justify-between items-center">
            <span className="font-black text-lg text-gray-900">Total</span>
            <span className="font-black text-xl text-gray-900">{fmt(grand)}</span>
          </div>
        </div>
      </div>

      <InvoiceBottom senderDetails={senderDetails} contentOptions={contentOptions} paymentDetails={paymentDetails} declaration={declaration} />

      {/* Footer */}
      <div className="absolute bottom-8 left-10 right-10 flex justify-between items-center border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-400">Thank you for your business!</p>
        <p className="text-xs text-gray-300">Generated via Invoy</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════════════════
export default function InvoicePreview(props) {
  if (props.selectedTemplate === 'classic') return <ClassicTemplate {...props} />;
  return <ModernTemplate {...props} />;
}
