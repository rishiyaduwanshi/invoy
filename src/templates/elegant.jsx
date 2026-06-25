import React from 'react';
import { fmt, calcTotals, InvoiceBottom, InvoyFooter } from './shared';

export default function ElegantTemplate({ data }) {
  const { senderDetails, clientDetails, invoiceMeta, items, contentOptions, paymentDetails, declaration } = data;
  const { subtotal, discountAmount, taxableAmount, calculatedTaxes, grandTotal } = calcTotals(data);
  const formatMoney = (val) => fmt(val, invoiceMeta.currency || '₹');

  return (
    <div id="invoice-preview-container" style={{ backgroundColor: '#fff', color: '#1e293b', padding: 48, minHeight: 1056, width: '100%', fontFamily: "'Outfit', 'Inter', sans-serif", position: 'relative' }}>
      
      {/* Centered Luxury Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        {senderDetails.logo && (
          <img src={senderDetails.logo} alt="logo" style={{ height: 50, objectFit: 'contain', marginBottom: 12, marginInline: 'auto' }} />
        )}
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#B45309', margin: '0 0 4px', letterSpacing: 2, textTransform: 'uppercase' }}>
          {senderDetails.businessName || senderDetails.name || 'YOUR BUSINESS'}
        </h1>
        {senderDetails.businessName && senderDetails.name && (
          <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>{senderDetails.name}</p>
        )}
      </div>

      {/* Thin Gold Double Line Accent */}
      <div style={{ borderTop: '3px double #B45309', marginBottom: 28 }} />

      {/* Meta Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, marginBottom: 28, fontSize: 13 }}>
        
        {/* Billed To / Details */}
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 6 }}>Billed To</span>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' }}>{clientDetails.name || 'Client Name'}</h3>
          {clientDetails.address && <p style={{ margin: '2px 0', color: '#475569' }}>{clientDetails.address}</p>}
          {clientDetails.email && <p style={{ margin: '2px 0', color: '#475569' }}>{clientDetails.email}</p>}
          {clientDetails.state && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#B45309', fontWeight: 600 }}>State: {clientDetails.state}</p>}
        </div>

        {/* Invoice Info & Sender Contacts */}
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 6 }}>Invoice Reference</span>
          <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 16 }}>No. {invoiceMeta.invoiceNumber || 'INV-000'}</p>
          <p style={{ margin: '2px 0', color: '#475569' }}>Date: {invoiceMeta.date || 'N/A'}</p>
          {invoiceMeta.dueDate && <p style={{ margin: '2px 0', color: '#B45309', fontWeight: 700 }}>Due: {invoiceMeta.dueDate}</p>}
          
          <div style={{ marginTop: 12, fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
            {senderDetails.address && <p style={{ margin: 0 }}>{senderDetails.address}</p>}
            {senderDetails.email && <p style={{ margin: 0 }}>{senderDetails.email}</p>}
            {senderDetails.phone && <p style={{ margin: 0 }}>{senderDetails.phone}</p>}
            {senderDetails.gstin && <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#1e293b' }}>GSTIN: {senderDetails.gstin}</p>}
            {senderDetails.udyamNo && <p style={{ margin: 0 }}>Udyam: {senderDetails.udyamNo}</p>}
          </div>
        </div>

      </div>

      {/* Elegant Line Table */}
      <div style={{ marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #B45309', color: '#B45309' }}>
              <th style={{ padding: '12px 6px', fontWeight: 700, width: '55%', textTransform: 'uppercase', letterSpacing: 1 }}>Description</th>
              <th style={{ padding: '12px 6px', fontWeight: 700, textAlign: 'center', width: 60, textTransform: 'uppercase', letterSpacing: 1 }}>{invoiceMeta.quantityLabel || 'Qty'}</th>
              <th style={{ padding: '12px 6px', fontWeight: 700, textAlign: 'right', textTransform: 'uppercase', letterSpacing: 1 }}>{invoiceMeta.rateLabel || 'Rate'}</th>
              <th style={{ padding: '12px 6px', fontWeight: 700, textAlign: 'right', textTransform: 'uppercase', letterSpacing: 1 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 6px', color: '#334155', fontWeight: 500 }}>{item.description || '-'}</td>
                <td style={{ padding: '16px 6px', textAlign: 'center', color: '#334155' }}>{item.quantity}</td>
                <td style={{ padding: '16px 6px', textAlign: 'right', color: '#334155' }}>{formatMoney(item.rate)}</td>
                <td style={{ padding: '16px 6px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>{formatMoney(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total block */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 40 }}>
        <div style={{ width: 260, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px', color: '#64748b' }}>
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px', color: '#16a34a', fontWeight: 700 }}>
              <span>Discount</span>
              <span>-{formatMoney(discountAmount)}</span>
            </div>
          )}
          {calculatedTaxes.map((tax) => (
            <div key={tax.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px', color: '#64748b' }}>
              <span>{tax.name} {tax.type === 'percentage' ? `(${tax.value}%)` : ''}</span>
              <span>{formatMoney(tax.amount)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 8px', borderTop: '1px solid #B45309', borderBottom: '1px solid #B45309', marginTop: 8, fontSize: 15, fontWeight: 800, color: '#B45309' }}>
            <span>TOTAL DUE</span>
            <span>{formatMoney(grandTotal)}</span>
          </div>
        </div>
      </div>

      <InvoiceBottom senderDetails={senderDetails} contentOptions={contentOptions} paymentDetails={paymentDetails} declaration={declaration} />
      <InvoyFooter />
    </div>
  );
}
