import React from 'react';
import { fmt, calcTotals, InvoiceBottom, InvoyFooter } from './shared';

export default function MinimalistTemplate({ data }) {
  const { senderDetails, clientDetails, invoiceMeta, items, contentOptions, paymentDetails, declaration } = data;
  const { subtotal, discountAmount, taxableAmount, calculatedTaxes, grandTotal } = calcTotals(data);
  const formatMoney = (val) => fmt(val, invoiceMeta.currency || '₹');

  return (
    <div id="invoice-preview-container" style={{ backgroundColor: '#fff', color: '#111827', padding: 48, minHeight: 1056, width: '100%', fontFamily: 'Georgia, serif', position: 'relative', lineHeight: 1.6 }}>
      
      {/* Header Title */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'normal', letterSpacing: 4, textTransform: 'uppercase', margin: '0 0 8px', color: '#111827' }}>INVOICE</h1>
        <div style={{ width: 40, height: 1, backgroundColor: '#111827', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Invoice No. #{invoiceMeta.invoiceNumber || 'INV-000'} &nbsp;|&nbsp; Date: {invoiceMeta.date || 'N/A'}</p>
      </div>

      {/* Addresses */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40, borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '24px 0', marginBottom: 40, fontSize: 13 }}>
        {/* From */}
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 11, color: '#374151', margin: '0 0 10px' }}>From</p>
          <h3 style={{ fontSize: 14, fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>
            {senderDetails.businessName || senderDetails.name || 'Your Business'}
          </h3>
          {senderDetails.businessName && senderDetails.name && <p style={{ margin: '0 0 2px' }}>{senderDetails.name}</p>}
          {senderDetails.address && <p style={{ margin: '2px 0', color: '#4b5563' }}>{senderDetails.address}</p>}
          {senderDetails.email && <p style={{ margin: '2px 0', color: '#4b5563' }}>{senderDetails.email}</p>}
          {senderDetails.phone && <p style={{ margin: '2px 0', color: '#4b5563' }}>{senderDetails.phone}</p>}
          {senderDetails.gstin && <p style={{ margin: '4px 0 0', fontWeight: 'bold' }}>GSTIN: {senderDetails.gstin}</p>}
          {senderDetails.udyamNo && <p style={{ margin: '2px 0', color: '#4b5563' }}>Udyam: {senderDetails.udyamNo}</p>}
        </div>

        {/* To */}
        <div style={{ flex: 1, borderLeft: '1px solid #f3f4f6', paddingLeft: 32 }}>
          <p style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 11, color: '#374151', margin: '0 0 10px' }}>Billed To</p>
          <h3 style={{ fontSize: 14, fontWeight: 'bold', margin: '0 0 4px', color: '#111827' }}>{clientDetails.name || 'Client Name'}</h3>
          {clientDetails.address && <p style={{ margin: '2px 0', color: '#4b5563' }}>{clientDetails.address}</p>}
          {clientDetails.email && <p style={{ margin: '2px 0', color: '#4b5563' }}>{clientDetails.email}</p>}
          {clientDetails.state && <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 11 }}>State: {clientDetails.state}</p>}
          {invoiceMeta.dueDate && <p style={{ margin: '8px 0 0', fontWeight: 'bold' }}>Due Date: {invoiceMeta.dueDate}</p>}
        </div>
      </div>

      {/* Table */}
      <div style={{ marginBottom: 40 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #111827' }}>
              <th style={{ padding: '12px 8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, width: '60%' }}>Description</th>
              <th style={{ padding: '12px 8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', width: 80 }}>{invoiceMeta.quantityLabel || 'Qty'}</th>
              <th style={{ padding: '12px 8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>{invoiceMeta.rateLabel || 'Rate'}</th>
              <th style={{ padding: '12px 8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 8px', color: '#374151' }}>{item.description || '-'}</td>
                <td style={{ padding: '16px 8px', textAlign: 'center', color: '#374151' }}>{item.quantity}</td>
                <td style={{ padding: '16px 8px', textAlign: 'right', color: '#374151' }}>{formatMoney(item.rate)}</td>
                <td style={{ padding: '16px 8px', textAlign: 'right', fontWeight: 'bold', color: '#111827' }}>{formatMoney(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 40, fontSize: 13 }}>
        <div style={{ width: 280 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', color: '#4b5563' }}>
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', color: '#16a34a' }}>
              <span>Discount</span>
              <span>-{formatMoney(discountAmount)}</span>
            </div>
          )}
          {calculatedTaxes.map((tax) => (
            <div key={tax.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', color: '#4b5563' }}>
              <span>{tax.name} {tax.type === 'percentage' ? `(${tax.value}%)` : ''}</span>
              <span>{formatMoney(tax.amount)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 8px', borderTop: '1px solid #111827', marginTop: 8, fontSize: 16, fontWeight: 'bold', color: '#111827' }}>
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
