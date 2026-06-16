import React from 'react';

export default function InvoicePreview({
  selectedTemplate = 'modern',
  senderDetails,
  clientDetails,
  invoiceMeta,
  items,
  taxSettings,
  paymentDetails,
  declaration
}) {
  const subtotal = items.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
  
  let cgst = 0, sgst = 0, igst = 0;
  const isInterState = senderDetails.state?.toLowerCase() !== clientDetails.state?.toLowerCase();

  if (taxSettings.applyGst && taxSettings.gstRate) {
    if (isInterState && clientDetails.state) {
      igst = subtotal * (taxSettings.gstRate / 100);
    } else {
      cgst = subtotal * ((taxSettings.gstRate / 2) / 100);
      sgst = subtotal * ((taxSettings.gstRate / 2) / 100);
    }
  }

  const grandTotal = subtotal + cgst + sgst + igst;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  if (selectedTemplate === 'classic') {
    return (
      <div id="invoice-preview-container" className="bg-white text-black p-8 min-h-[1056px] w-full mx-auto relative shadow-sm font-sans border border-gray-200">
        
        {/* Top Header Logos */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-3">
            {senderDetails.logo ? (
              <img src={senderDetails.logo} alt="Business Logo" className="h-12 object-contain" />
            ) : (
              <div className="h-10 w-10 bg-blue-900 rounded flex items-center justify-center text-white font-bold text-xl">
                {senderDetails.name ? senderDetails.name.charAt(0) : 'L'}
              </div>
            )}
            <h1 className="text-2xl font-bold tracking-widest text-[#1B365D] uppercase">
              {senderDetails.name || 'YOUR COMPANY'}
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            {/* Fake MSME & Emblem Logos */}
            <div className="text-[10px] font-bold text-center leading-tight text-gray-700">
              <div className="text-xl mb-0.5">🏛️</div>
              GOVT OF INDIA
            </div>
            <div className="text-[10px] font-bold text-center leading-tight text-[#1B365D] border-l border-gray-300 pl-4">
              <div className="text-2xl font-black tracking-tighter">MSME</div>
              MICRO, SMALL & MEDIUM ENTERPRISES
            </div>
          </div>
        </div>

        {/* Blue Title Bar */}
        <div className="bg-[#4472C4] text-white px-6 py-2 flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold tracking-wide">TAX INVOICE</h2>
          <div className="flex items-center gap-2 font-semibold">
            <span>📄</span> {invoiceMeta.invoiceNumber || 'INV-000'}
          </div>
        </div>

        {/* Invoice Meta Bar */}
        <div className="flex justify-between px-6 mb-6 text-sm font-semibold text-gray-800">
          <div>Invoice No: <span className="font-normal text-[#4472C4]">{invoiceMeta.invoiceNumber || 'INV-000'}</span></div>
          <div>Date: <span className="font-normal">{invoiceMeta.date || 'N/A'}</span></div>
        </div>

        {/* From / To Section */}
        <div className="flex border-t border-b border-gray-200 mb-6">
          <div className="w-1/2 p-6 border-r border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">FROM</h3>
            <div className="text-sm space-y-1.5">
              {senderDetails.businessName && <p><span className="text-gray-500">Business Name:</span> <strong className="text-gray-900">{senderDetails.businessName}</strong></p>}
              {senderDetails.udyamNo && <p><span className="text-gray-500">Udyam Reg No:</span> <strong className="text-gray-900">{senderDetails.udyamNo}</strong></p>}
              {senderDetails.gstin && <p><span className="text-gray-500">GSTIN:</span> <strong className="text-gray-900">{senderDetails.gstin}</strong></p>}
              {senderDetails.name && <p className="mt-2"><span className="text-gray-500">Name:</span> <strong className="text-gray-900">{senderDetails.name}</strong></p>}
              <p className="flex"><span className="text-gray-500 w-16 shrink-0">Address:</span> <span className="text-gray-900">{senderDetails.address}</span></p>
              {senderDetails.email && <p><span className="text-gray-500">Email:</span> <span className="text-gray-900">{senderDetails.email}</span></p>}
              {senderDetails.phone && <p><span className="text-gray-500">Phone:</span> <span className="text-gray-900">{senderDetails.phone}</span></p>}
            </div>
          </div>
          <div className="w-1/2 p-6">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">BILLED TO</h3>
            <div className="text-sm space-y-1.5">
              <p><strong className="text-gray-900 text-base">{clientDetails.name}</strong></p>
              <p className="text-gray-800 whitespace-pre-wrap">{clientDetails.address}</p>
              {clientDetails.email && <p className="text-gray-800">{clientDetails.email}</p>}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mb-6 border border-gray-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4472C4] text-white text-sm">
                <th className="py-2.5 px-4 font-semibold w-[60%]">Service Details</th>
                <th className="py-2.5 px-4 font-semibold text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              {/* Header Sub-Row */}
              <tr className="bg-gray-100 text-xs font-bold text-gray-800 border-b border-gray-300">
                <td className="py-2 px-4 border-r border-gray-300">Description</td>
                <td className="py-2 px-4 text-right">Amount</td>
              </tr>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-200 text-sm">
                  <td className="py-3 px-4 border-r border-gray-300 text-gray-800">{item.description || '-'}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(item.quantity * item.rate)}</td>
                </tr>
              ))}
              
              {/* Taxes if any */}
              {taxSettings.applyGst && (
                <>
                  {isInterState ? (
                    <tr className="border-b border-gray-200 text-sm">
                      <td className="py-2 px-4 border-r border-gray-300 text-right text-gray-600">IGST ({taxSettings.gstRate}%)</td>
                      <td className="py-2 px-4 text-right font-medium text-gray-900">{formatCurrency(igst)}</td>
                    </tr>
                  ) : (
                    <>
                      <tr className="border-b border-gray-200 text-sm">
                        <td className="py-2 px-4 border-r border-gray-300 text-right text-gray-600">CGST ({taxSettings.gstRate/2}%)</td>
                        <td className="py-2 px-4 text-right font-medium text-gray-900">{formatCurrency(cgst)}</td>
                      </tr>
                      <tr className="border-b border-gray-200 text-sm">
                        <td className="py-2 px-4 border-r border-gray-300 text-right text-gray-600">SGST ({taxSettings.gstRate/2}%)</td>
                        <td className="py-2 px-4 text-right font-medium text-gray-900">{formatCurrency(sgst)}</td>
                      </tr>
                    </>
                  )}
                </>
              )}
            </tbody>
          </table>
          {/* Total Bar */}
          <div className="bg-gradient-to-r from-[#4472C4] to-[#D5A045] text-white flex justify-between items-center px-4 py-3">
            <span className="font-semibold text-lg">Total Amount:</span>
            <span className="font-bold text-xl">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {/* Payment Details */}
        {paymentDetails && (
          <div className="mb-6 px-2">
            <h3 className="font-bold text-gray-800 text-sm mb-2">Payment Details</h3>
            <div className="flex justify-between text-sm text-gray-800 border-b border-gray-200 pb-3 mb-3">
              <p><span className="text-gray-500">Mode:</span> {paymentDetails.mode}</p>
              <p><span className="text-gray-500">Payment Status:</span> <span className={`px-2 py-0.5 rounded text-white text-xs ${paymentDetails.status === 'Paid' ? 'bg-[#4CAF50]' : 'bg-[#F44336]'}`}>{paymentDetails.status}</span></p>
            </div>
            {paymentDetails.transactionId && (
              <div className="text-sm text-gray-800 pb-3">
                <p><span className="text-gray-500">Transaction ID:</span> <strong>{paymentDetails.transactionId}</strong></p>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-gray-200 my-4"></div>

        {/* Declaration & Signature */}
        <div className="flex justify-between items-end px-2 mt-8">
          <div className="w-2/3">
            <h3 className="font-bold text-gray-800 text-sm mb-2">Declaration</h3>
            <ul className="list-disc pl-4 text-xs text-gray-700 space-y-1.5 leading-relaxed">
              {declaration ? declaration.split('\n').map((line, i) => (
                <li key={i}>{line.replace(/^\d+\.\s*/, '')}</li>
              )) : (
                <li>This invoice is issued for software development and IT services.</li>
              )}
            </ul>
          </div>
          
          <div className="w-1/3 flex flex-col items-center">
            <h3 className="font-bold text-gray-800 text-sm mb-4 w-full text-left">Authorised Signature</h3>
            {senderDetails.signature ? (
              <img src={senderDetails.signature} alt="Signature" className="h-16 object-contain mb-2" />
            ) : (
              <div className="h-16 flex items-end justify-center text-gray-300 italic mb-2">
                Sign Here
              </div>
            )}
            <div className="w-full border-t border-gray-400 pt-1 text-center text-xs font-bold text-gray-800">
              ({senderDetails.name})
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Modern Template (Fallback / Original)
  return (
    <div id="invoice-preview-container" className="bg-white text-black p-10 min-h-[1056px] w-full mx-auto relative shadow-sm font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col">
          {senderDetails.logo ? (
            <img src={senderDetails.logo} alt="Business Logo" className="h-16 object-contain mb-4" />
          ) : (
            <div className="h-16 flex items-center justify-center bg-gray-100 rounded mb-4 text-gray-400 text-sm font-semibold w-32 border border-dashed border-gray-300">
              Logo Here
            </div>
          )}
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight uppercase font-['Outfit']">INVOICE</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">#{invoiceMeta.invoiceNumber || 'INV-000'}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">{senderDetails.businessName || senderDetails.name || 'Your Company Name'}</h2>
          {senderDetails.businessName && senderDetails.name && (
            <p className="text-sm text-gray-600 mt-0.5">{senderDetails.name}</p>
          )}
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap max-w-[250px]">{senderDetails.address || 'Company Address'}</p>
          {senderDetails.email && <p className="text-sm text-gray-600 mt-1">{senderDetails.email}</p>}
          {senderDetails.phone && <p className="text-sm text-gray-600 mt-1">{senderDetails.phone}</p>}
          {senderDetails.gstin && <p className="text-sm font-semibold text-gray-700 mt-1">GSTIN: {senderDetails.gstin}</p>}
        </div>
      </div>

      <div className="border-t border-gray-200 my-8"></div>

      {/* Meta Info */}
      <div className="flex justify-between items-start mb-10">
        <div className="w-1/2 pr-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
          <h3 className="text-lg font-bold text-gray-800">{clientDetails.name || 'Client Name'}</h3>
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{clientDetails.address || 'Client Address'}</p>
          {clientDetails.email && <p className="text-sm text-gray-600 mt-1">{clientDetails.email}</p>}
          {clientDetails.state && <p className="text-sm text-gray-600 mt-1">State of Supply: <span className="font-semibold">{clientDetails.state}</span></p>}
        </div>
        <div className="w-1/2 pl-4 text-right flex flex-col items-end gap-2">
          <div className="text-sm">
            <span className="text-gray-500 font-medium">Invoice Date:</span>
            <span className="ml-2 font-semibold text-gray-800">{invoiceMeta.date || 'N/A'}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 font-medium">Due Date:</span>
            <span className="ml-2 font-semibold text-gray-800">{invoiceMeta.dueDate || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800 text-sm">
              <th className="py-3 px-2 font-bold text-gray-800 uppercase tracking-wider">Description</th>
              <th className="py-3 px-2 font-bold text-gray-800 uppercase tracking-wider text-center w-24">Qty</th>
              <th className="py-3 px-2 font-bold text-gray-800 uppercase tracking-wider text-right w-32">Rate</th>
              <th className="py-3 px-2 font-bold text-gray-800 uppercase tracking-wider text-right w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 text-sm">
                <td className="py-4 px-2 text-gray-800">{item.description || '-'}</td>
                <td className="py-4 px-2 text-gray-800 text-center">{item.quantity}</td>
                <td className="py-4 px-2 text-gray-800 text-right">{formatCurrency(item.rate)}</td>
                <td className="py-4 px-2 text-gray-900 font-medium text-right">{formatCurrency(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-72 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
          </div>
          
          {taxSettings.applyGst && (
            <>
              {isInterState ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IGST ({taxSettings.gstRate}%)</span>
                  <span className="font-medium text-gray-800">{formatCurrency(igst)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">CGST ({taxSettings.gstRate/2}%)</span>
                    <span className="font-medium text-gray-800">{formatCurrency(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SGST ({taxSettings.gstRate/2}%)</span>
                    <span className="font-medium text-gray-800">{formatCurrency(sgst)}</span>
                  </div>
                </>
              )}
            </>
          )}

          <div className="border-t-2 border-gray-800 pt-3 flex justify-between items-center">
            <span className="font-bold text-lg text-gray-900">Total</span>
            <span className="font-bold text-xl text-gray-900">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end border-t border-gray-200 pt-6">
        <div className="text-xs text-gray-500">
          Thank you for your business!
        </div>
        <div className="text-right text-xs text-gray-400">
          Generated via Advanced Invoice Generator
        </div>
      </div>
    </div>
  );
}
