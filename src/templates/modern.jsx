import React from 'react';
import { fmt, calcTax, InvoiceBottom, InvoyFooter } from './shared';

export default function ModernTemplate({ data }) {
  const { senderDetails, clientDetails, invoiceMeta, items, taxSettings, contentOptions, paymentDetails, declaration } = data;
  const { subtotal, cgst, sgst, igst, isInter, grand } = calcTax({ items, taxSettings, senderDetails, clientDetails });

  return (
    <div id="invoice-preview-container" style={{ backgroundColor: '#fff', color: '#000', padding: 40, minHeight: 1056, width: '100%', fontFamily: 'Arial, sans-serif', position: 'relative' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          {senderDetails.logo && <img src={senderDetails.logo} alt="logo" style={{ height: 56, objectFit: 'contain', marginBottom: 12 }} />}
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#111827', textTransform: 'uppercase', letterSpacing: -1, margin: 0 }}>INVOICE</h1>
          <p style={{ color: '#9ca3af', fontSize: 13, fontWeight: 500, margin: '4px 0 0' }}>#{invoiceMeta.invoiceNumber || 'INV-000'}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>{senderDetails.businessName || senderDetails.name || 'Your Company'}</h2>
          {senderDetails.businessName && senderDetails.name && <p style={{ fontSize: 13, color: '#4b5563', margin: '0 0 2px' }}>{senderDetails.name}</p>}
          {senderDetails.address && <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0', maxWidth: 220 }}>{senderDetails.address}</p>}
          {senderDetails.email && <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0' }}>{senderDetails.email}</p>}
          {senderDetails.phone && <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0' }}>{senderDetails.phone}</p>}
          {senderDetails.gstin && <p style={{ fontSize: 11, fontWeight: 700, color: '#374151', margin: '4px 0 0', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: 4, display: 'inline-block' }}>GSTIN: {senderDetails.gstin}</p>}
          {senderDetails.udyamNo && <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0' }}>Udyam: {senderDetails.udyamNo}</p>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 40, marginBottom: 40 }}>
        {/* Bill To */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>Billed To</p>
          <div style={{ borderLeft: '3px solid #111827', paddingLeft: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{clientDetails.name || 'Client Name'}</h3>
            {clientDetails.address && <p style={{ fontSize: 13, color: '#4b5563', margin: '0 0 2px' }}>{clientDetails.address}</p>}
            {clientDetails.email && <p style={{ fontSize: 13, color: '#4b5563', margin: '0 0 2px' }}>{clientDetails.email}</p>}
            {clientDetails.state && <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0' }}>State: {clientDetails.state}</p>}
          </div>
        </div>

        {/* Details */}
        <div style={{ minWidth: 200 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>Invoice Details</p>
          <div style={{ backgroundColor: '#f9fafb', padding: 16, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: '#6b7280' }}>Date:</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{invoiceMeta.date || 'N/A'}</span>
            </div>
            {invoiceMeta.dueDate && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6b7280' }}>Due Date:</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{invoiceMeta.dueDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px 0', fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Description</th>
              <th style={{ padding: '12px 0', fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center', width: 60 }}>Qty</th>
              <th style={{ padding: '12px 0', fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Rate</th>
              <th style={{ padding: '12px 0', fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 0', fontSize: 14, color: '#111827', fontWeight: 500 }}>{item.description || '-'}</td>
                <td style={{ padding: '16px 0', fontSize: 14, color: '#4b5563', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '16px 0', fontSize: 14, color: '#4b5563', textAlign: 'right' }}>{fmt(item.rate)}</td>
                <td style={{ padding: '16px 0', fontSize: 14, color: '#111827', textAlign: 'right', fontWeight: 600 }}>{fmt(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 40 }}>
        <div style={{ width: 320 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: '#4b5563' }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: 500, color: '#111827' }}>{fmt(subtotal)}</span>
          </div>
          {taxSettings.applyGst && isInter && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: '#4b5563' }}>
              <span>IGST ({taxSettings.gstRate}%)</span>
              <span style={{ fontWeight: 500, color: '#111827' }}>{fmt(igst)}</span>
            </div>
          )}
          {taxSettings.applyGst && !isInter && (<>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: '#4b5563' }}>
              <span>CGST ({taxSettings.gstRate / 2}%)</span>
              <span style={{ fontWeight: 500, color: '#111827' }}>{fmt(cgst)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: '#4b5563' }}>
              <span>SGST ({taxSettings.gstRate / 2}%)</span>
              <span style={{ fontWeight: 500, color: '#111827' }}>{fmt(sgst)}</span>
            </div>
          </>)}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', marginTop: 8, borderTop: '2px solid #111827', fontSize: 18, fontWeight: 800, color: '#111827' }}>
            <span>Total</span>
            <span>{fmt(grand)}</span>
          </div>
        </div>
      </div>

      <InvoiceBottom senderDetails={senderDetails} contentOptions={contentOptions} paymentDetails={paymentDetails} declaration={declaration} />
      <InvoyFooter />
    </div>
  );
}
