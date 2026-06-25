import React from 'react';
import { fmt, calcTotals, InvoiceBottom, InvoyFooter } from './shared';

export default function CreativeTemplate({ data }) {
  const { senderDetails, clientDetails, invoiceMeta, items, contentOptions, paymentDetails, declaration } = data;
  const { subtotal, discountAmount, taxableAmount, calculatedTaxes, grandTotal } = calcTotals(data);
  const formatMoney = (val) => fmt(val, invoiceMeta.currency || '₹');

  return (
    <div id="invoice-preview-container" style={{ backgroundColor: '#fff', color: '#1f2937', padding: 40, minHeight: 1056, width: '100%', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', position: 'relative' }}>
      
      {/* Dynamic top gradient line */}
      <div style={{ height: 6, background: 'linear-gradient(to right, #EC4899, #8B5CF6, #3B82F6)', margin: '-40px -40px 32px -40px' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {senderDetails.logo ? (
            <img src={senderDetails.logo} alt="logo" style={{ height: 60, width: 60, borderRadius: 12, objectFit: 'contain' }} />
          ) : (
            <div style={{ height: 48, width: 48, borderRadius: 12, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
              {senderDetails.businessName?.charAt(0) || 'C'}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: 0, letterSpacing: -0.5 }}>
              {senderDetails.businessName || senderDetails.name || 'YOUR BUSINESS'}
            </h1>
            {senderDetails.businessName && senderDetails.name && <p style={{ fontSize: 13, color: '#4b5563', margin: '2px 0 0' }}>{senderDetails.name}</p>}
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: 13, color: '#4b5563' }}>
          <span style={{ backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8', color: '#db2777', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Invoice
          </span>
          <p style={{ fontWeight: 800, color: '#111827', fontSize: 15, margin: '8px 0 2px' }}>#{invoiceMeta.invoiceNumber || 'INV-000'}</p>
          <p style={{ margin: 0 }}>Date: {invoiceMeta.date || 'N/A'}</p>
        </div>
      </div>

      {/* Grid for Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        
        {/* From / Contact Card */}
        <div style={{ backgroundColor: '#fcfcfd', border: '1px solid #f3f4f6', padding: 20, borderRadius: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>Sender Details</p>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: '#4b5563' }}>
            {senderDetails.address && <p style={{ margin: '2px 0' }}>📍 {senderDetails.address}</p>}
            {senderDetails.email && <p style={{ margin: '2px 0' }}>✉️ {senderDetails.email}</p>}
            {senderDetails.phone && <p style={{ margin: '2px 0' }}>📞 {senderDetails.phone}</p>}
            {senderDetails.gstin && <p style={{ margin: '6px 0 0', fontWeight: 700, color: '#111827' }}>GSTIN: {senderDetails.gstin}</p>}
            {senderDetails.udyamNo && <p style={{ margin: '2px 0', color: '#111827' }}>Udyam: {senderDetails.udyamNo}</p>}
          </div>
        </div>

        {/* Client Details Card */}
        <div style={{ backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8', padding: 20, borderRadius: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>Billed To</p>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>{clientDetails.name || 'Client Name'}</h3>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: '#4b5563' }}>
            {clientDetails.address && <p style={{ margin: '2px 0' }}>{clientDetails.address}</p>}
            {clientDetails.email && <p style={{ margin: '2px 0' }}>{clientDetails.email}</p>}
            {clientDetails.state && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#db2777', fontWeight: 600 }}>State: {clientDetails.state}</p>}
            {invoiceMeta.dueDate && <p style={{ margin: '6px 0 0', fontWeight: 700, color: '#111827' }}>📅 Due Date: {invoiceMeta.dueDate}</p>}
          </div>
        </div>

      </div>

      {/* Table */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'linear-gradient(to right, #EC4899, #8B5CF6)', color: '#fff' }}>
              <th style={{ padding: '12px 18px', fontWeight: 700, width: '55%' }}>Description</th>
              <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'center', width: 70 }}>{invoiceMeta.quantityLabel || 'Qty'}</th>
              <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'right' }}>{invoiceMeta.rateLabel || 'Rate'}</th>
              <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: i % 2 === 0 ? '#fff' : '#fdfafb' }}>
                <td style={{ padding: '14px 18px', fontWeight: 500, color: '#111827' }}>{item.description || '-'}</td>
                <td style={{ padding: '14px 18px', textAlign: 'center', color: '#4b5563' }}>{item.quantity}</td>
                <td style={{ padding: '14px 18px', textAlign: 'right', color: '#4b5563' }}>{formatMoney(item.rate)}</td>
                <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>{formatMoney(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
        <div style={{ width: 280, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px', color: '#4b5563' }}>
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px', color: '#16a34a', fontWeight: 600 }}>
              <span>Discount</span>
              <span>-{formatMoney(discountAmount)}</span>
            </div>
          )}
          {calculatedTaxes.map((tax) => (
            <div key={tax.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px', color: '#4b5563' }}>
              <span>{tax.name} {tax.type === 'percentage' ? `(${tax.value}%)` : ''}</span>
              <span>{formatMoney(tax.amount)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: 12, marginTop: 8, fontSize: 16, fontWeight: 900, color: '#ec4899' }}>
            <span>Total</span>
            <span>{formatMoney(grandTotal)}</span>
          </div>
        </div>
      </div>

      <InvoiceBottom senderDetails={senderDetails} contentOptions={contentOptions} paymentDetails={paymentDetails} declaration={declaration} />
      <InvoyFooter />
    </div>
  );
}
