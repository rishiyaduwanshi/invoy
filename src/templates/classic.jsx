import React from 'react';
import { fmt, calcTax, InvoiceBottom, InvoyFooter } from './shared';

export default function ClassicTemplate({ data }) {
  const { senderDetails, clientDetails, invoiceMeta, items, taxSettings, contentOptions, paymentDetails, declaration } = data;
  const { subtotal, cgst, sgst, igst, isInter, grand } = calcTax({ items, taxSettings, senderDetails, clientDetails });

  return (
    <div id="invoice-preview-container" style={{ backgroundColor: '#fff', color: '#000', padding: 32, minHeight: 1056, width: '100%', fontFamily: 'Arial, sans-serif', border: '1px solid #e5e7eb', position: 'relative' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {senderDetails.logo && <img src={senderDetails.logo} alt="logo" style={{ height: 48, objectFit: 'contain' }} />}
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3, color: '#1B365D', textTransform: 'uppercase', margin: 0 }}>
            {senderDetails.businessName || senderDetails.name || 'YOUR COMPANY'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textAlign: 'center', lineHeight: 1.4, color: '#374151' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>🏛️</div>GOVT OF INDIA
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, textAlign: 'center', lineHeight: 1.4, color: '#1B365D', borderLeft: '1px solid #d1d5db', paddingLeft: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -1 }}>MSME</div>
            MICRO, SMALL &amp; MEDIUM ENTERPRISES
          </div>
        </div>
      </div>

      {/* Title bar */}
      <div style={{ backgroundColor: '#4472C4', color: '#fff', padding: '8px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1, margin: 0 }}>TAX INVOICE</h2>
        <span style={{ fontWeight: 600 }}>📄 {invoiceMeta.invoiceNumber || 'INV-000'}</span>
      </div>

      {/* Invoice meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', marginBottom: 24, fontSize: 13, fontWeight: 600, color: '#1f2937' }}>
        <span>Invoice No: <span style={{ color: '#4472C4', fontWeight: 400 }}>{invoiceMeta.invoiceNumber || 'INV-000'}</span></span>
        <span>Date: <span style={{ fontWeight: 400 }}>{invoiceMeta.date || 'N/A'}</span></span>
        {invoiceMeta.dueDate && <span>Due: <span style={{ fontWeight: 400 }}>{invoiceMeta.dueDate}</span></span>}
      </div>

      {/* FROM / TO */}
      <div style={{ display: 'flex', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
        <div style={{ width: '50%', padding: '20px 20px', borderRight: '1px solid #e5e7eb' }}>
          <p style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#374151', marginBottom: 10 }}>From</p>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: '#1f2937' }}>
            {senderDetails.name && <p style={{ margin: 0 }}><span style={{ color: '#6b7280' }}>Name:</span> {senderDetails.name}</p>}
            {senderDetails.gstin && <p style={{ margin: 0 }}><span style={{ color: '#6b7280' }}>GSTIN:</span> <strong>{senderDetails.gstin}</strong></p>}
            {senderDetails.udyamNo && <p style={{ margin: 0 }}><span style={{ color: '#6b7280' }}>Udyam:</span> {senderDetails.udyamNo}</p>}
            {senderDetails.address && <p style={{ margin: 0 }}><span style={{ color: '#6b7280' }}>Address:</span> {senderDetails.address}</p>}
            {senderDetails.email && <p style={{ margin: 0 }}><span style={{ color: '#6b7280' }}>Email:</span> {senderDetails.email}</p>}
            {senderDetails.phone && <p style={{ margin: 0 }}><span style={{ color: '#6b7280' }}>Phone:</span> {senderDetails.phone}</p>}
          </div>
        </div>
        <div style={{ width: '50%', padding: '20px 20px' }}>
          <p style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#374151', marginBottom: 10 }}>Billed To</p>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: '#1f2937' }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{clientDetails.name || 'Client Name'}</p>
            {clientDetails.address && <p style={{ margin: 0, color: '#374151' }}>{clientDetails.address}</p>}
            {clientDetails.email && <p style={{ margin: 0, color: '#374151' }}>{clientDetails.email}</p>}
            {clientDetails.state && <p style={{ margin: 0, color: '#6b7280', fontSize: 11 }}>State: {clientDetails.state}</p>}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid #d1d5db', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#4472C4', color: '#fff', fontSize: 13 }}>
              <th style={{ padding: '10px 16px', fontWeight: 600, width: '55%' }}>Service / Description</th>
              <th style={{ padding: '10px 16px', fontWeight: 600, textAlign: 'center', width: 60 }}>Qty</th>
              <th style={{ padding: '10px 16px', fontWeight: 600, textAlign: 'right' }}>Rate</th>
              <th style={{ padding: '10px 16px', fontWeight: 600, textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#1f2937' }}>{item.description || '-'}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'center', color: '#1f2937' }}>{item.quantity}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'right', color: '#1f2937' }}>{fmt(item.rate)}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'right', fontWeight: 600, color: '#111827' }}>{fmt(item.quantity * item.rate)}</td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #d1d5db' }}>
              <td colSpan={3} style={{ padding: '8px 16px', textAlign: 'right', fontSize: 13, color: '#4b5563', fontWeight: 500 }}>Subtotal</td>
              <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 600, fontSize: 13 }}>{fmt(subtotal)}</td>
            </tr>
            {taxSettings.applyGst && isInter && (
              <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                <td colSpan={3} style={{ padding: '8px 16px', textAlign: 'right', fontSize: 13, color: '#4b5563' }}>IGST ({taxSettings.gstRate}%)</td>
                <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 500, fontSize: 13 }}>{fmt(igst)}</td>
              </tr>
            )}
            {taxSettings.applyGst && !isInter && (<>
              <tr style={{ borderTop: '1px solid #e5e7eb' }}>
                <td colSpan={3} style={{ padding: '8px 16px', textAlign: 'right', fontSize: 13, color: '#4b5563' }}>CGST ({taxSettings.gstRate / 2}%)</td>
                <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 500, fontSize: 13 }}>{fmt(cgst)}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ padding: '8px 16px', textAlign: 'right', fontSize: 13, color: '#4b5563' }}>SGST ({taxSettings.gstRate / 2}%)</td>
                <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 500, fontSize: 13 }}>{fmt(sgst)}</td>
              </tr>
            </>)}
          </tbody>
        </table>
        <div style={{ background: 'linear-gradient(to right, #4472C4, #2a56a8)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Total Amount</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>{fmt(grand)}</span>
        </div>
      </div>

      <InvoiceBottom senderDetails={senderDetails} contentOptions={contentOptions} paymentDetails={paymentDetails} declaration={declaration} />
      <InvoyFooter />
    </div>
  );
}
