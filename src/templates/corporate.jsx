import React from 'react';
import { fmt, calcTotals, InvoiceBottom, InvoyFooter } from './shared';

export default function CorporateTemplate({ data }) {
  const { senderDetails, clientDetails, invoiceMeta, items, contentOptions, paymentDetails, declaration } = data;
  const { subtotal, discountAmount, taxableAmount, calculatedTaxes, grandTotal } = calcTotals(data);
  const formatMoney = (val) => fmt(val, invoiceMeta.currency || '₹');

  return (
    <div id="invoice-preview-container" style={{ backgroundColor: '#fff', color: '#1e293b', minHeight: 1056, width: '100%', fontFamily: 'Arial, sans-serif', display: 'flex', border: '1px solid #e2e8f0', position: 'relative' }}>
      
      {/* Left Sidebar Panel (30% width) */}
      <div style={{ width: '30%', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Logo or Brand */}
        <div>
          {senderDetails.logo ? (
            <img src={senderDetails.logo} alt="logo" style={{ maxHeight: 60, maxWidth: '100%', objectFit: 'contain', marginBottom: 12 }} />
          ) : (
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              {senderDetails.businessName?.split(' ')[0] || 'CORP'}
            </div>
          )}
          <span style={{ fontSize: 10, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', tracking: 1.5 }}>
            Enterprise Invoice
          </span>
        </div>

        {/* Invoice Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Invoice No</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{invoiceMeta.invoiceNumber || 'INV-000'}</span>
          </div>
          <div>
            <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Date</span>
            <span style={{ fontSize: 13, color: '#334155' }}>{invoiceMeta.date || 'N/A'}</span>
          </div>
          {invoiceMeta.dueDate && (
            <div>
              <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Due Date</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3a8a' }}>{invoiceMeta.dueDate}</span>
            </div>
          )}
        </div>

        {/* Payment Meta Info */}
        {contentOptions?.showPaymentDetails && (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Payment Status</span>
            <span style={{ backgroundColor: paymentDetails?.status === 'Paid' ? '#d1fae5' : '#fee2e2', color: paymentDetails?.status === 'Paid' ? '#065f46' : '#991b1b', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', display: 'inline-block' }}>
              {paymentDetails?.status || 'Unpaid'}
            </span>
            {paymentDetails?.mode && (
              <p style={{ fontSize: 11, color: '#475569', margin: '8px 0 0' }}>
                Mode: {paymentDetails.mode}
              </p>
            )}
            {paymentDetails?.transactionId && (
              <p style={{ fontSize: 10, color: '#64748b', margin: '4px 0 0', wordBreak: 'break-all' }}>
                ID: {paymentDetails.transactionId}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right Content Panel (70% width) */}
      <div style={{ width: '70%', padding: '40px 32px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Addresses Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
          {/* Company Details */}
          <div>
            <p style={{ fontSize: 10, color: '#1E3A8A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>Issuer Details</p>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{senderDetails.businessName || senderDetails.name || 'Your Business'}</h2>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              {senderDetails.address && <p style={{ margin: 0 }}>{senderDetails.address}</p>}
              {senderDetails.email && <p style={{ margin: 0 }}>{senderDetails.email}</p>}
              {senderDetails.phone && <p style={{ margin: 0 }}>{senderDetails.phone}</p>}
              {senderDetails.gstin && <p style={{ margin: '4px 0 0', fontWeight: 600 }}>GSTIN: {senderDetails.gstin}</p>}
              {senderDetails.udyamNo && <p style={{ margin: '2px 0 0' }}>Udyam: {senderDetails.udyamNo}</p>}
            </div>
          </div>

          {/* Client Details */}
          <div>
            <p style={{ fontSize: 10, color: '#1E3A8A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>Billed To</p>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{clientDetails.name || 'Client Name'}</h2>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              {clientDetails.address && <p style={{ margin: 0 }}>{clientDetails.address}</p>}
              {clientDetails.email && <p style={{ margin: 0 }}>{clientDetails.email}</p>}
              {clientDetails.state && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#64748b' }}>State: {clientDetails.state}</p>}
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div style={{ flexGrow: 1, marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #1E3A8A', color: '#1E3A8A' }}>
                <th style={{ padding: '8px 4px', fontWeight: 700, width: '55%' }}>Line Items</th>
                <th style={{ padding: '8px 4px', fontWeight: 700, textAlign: 'center', width: 60 }}>{invoiceMeta.quantityLabel || 'Qty'}</th>
                <th style={{ padding: '8px 4px', fontWeight: 700, textAlign: 'right' }}>{invoiceMeta.rateLabel || 'Rate'}</th>
                <th style={{ padding: '8px 4px', fontWeight: 700, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '12px 4px', color: '#334155' }}>{item.description || '-'}</td>
                  <td style={{ padding: '12px 4px', textAlign: 'center', color: '#334155' }}>{item.quantity}</td>
                  <td style={{ padding: '12px 4px', textAlign: 'right', color: '#334155' }}>{formatMoney(item.rate)}</td>
                  <td style={{ padding: '12px 4px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{formatMoney(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <div style={{ width: 260, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#475569' }}>
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#16a34a', fontWeight: 600 }}>
                  <span>Discount</span>
                  <span>-{formatMoney(discountAmount)}</span>
                </div>
              )}
              {calculatedTaxes.map((tax) => (
                <div key={tax.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#475569' }}>
                  <span>{tax.name} {tax.type === 'percentage' ? `(${tax.value}%)` : ''}</span>
                  <span>{formatMoney(tax.amount)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #0f172a', marginTop: 6, fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                <span>Total Amount</span>
                <span>{formatMoney(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area with Declaration and Signature */}
        <div>
          {(contentOptions?.showDeclaration || contentOptions?.showSignature) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
              {contentOptions?.showDeclaration && (
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 10, color: '#0f172a', textTransform: 'uppercase', marginBottom: 6 }}>Terms &amp; Declarations</p>
                  <ul style={{ paddingLeft: 12, margin: 0 }}>
                    {(declaration || '').split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} style={{ fontSize: 10, color: '#475569', marginBottom: 2 }}>{line.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              )}

              {contentOptions?.showSignature && (
                <div style={{ minWidth: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {senderDetails?.signature ? (
                    <img src={senderDetails.signature} alt="Signature" style={{ height: 44, objectFit: 'contain', marginBottom: 4 }} />
                  ) : (
                    <div style={{ height: 44, width: '100%', border: '1px dashed #cbd5e1', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 9, color: '#94a3b8' }}>Authorized Signatory</span>
                    </div>
                  )}
                  <div style={{ width: '100%', borderTop: '1px solid #475569', paddingTop: 4, textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#0f172a' }}>
                    {senderDetails?.businessName || senderDetails?.name || 'Signatory'}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 24, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: '#94a3b8' }}>
            <span>Thank you for your business.</span>
            <span>invoy.in</span>
          </div>
        </div>

      </div>

    </div>
  );
}
