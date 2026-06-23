import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_INVOICE_DATA, type InvoiceType } from '../schema/invoice';

// Context shape
type InvoiceContextType = {
  data: InvoiceType;
  updateData: (section: keyof InvoiceType, payload: any) => void;
  updateField: (section: keyof InvoiceType, field: string, value: any) => void;
  loadInvoice: (invoice: InvoiceType) => void;
  resetToDefault: () => void;
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<InvoiceType>(DEFAULT_INVOICE_DATA);

  // Update a whole section (e.g. senderDetails = { ...newDetails })
  const updateData = (section: keyof InvoiceType, payload: any) => {
    setData((prev) => ({
      ...prev,
      [section]: typeof payload === 'function' ? payload(prev[section]) : payload,
    }));
  };

  // Update a specific field within a section (e.g. senderDetails.name = 'Abhinav')
  const updateField = (section: keyof InvoiceType, field: string, value: any) => {
    setData((prev) => {
      // Handle simple values vs object updates safely
      if (typeof prev[section] === 'object' && prev[section] !== null && !Array.isArray(prev[section])) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      }
      return prev; // Fallback for arrays/primitives if called incorrectly
    });
  };

  const loadInvoice = (invoice: any) => {
    let migratedTaxes = invoice.taxes;
    if (!migratedTaxes) {
      migratedTaxes = [];
      if (invoice.taxSettings?.applyTax) {
        migratedTaxes.push({
          id: 'legacy-tax',
          name: invoice.taxSettings.taxLabel || 'Tax',
          type: 'percentage',
          value: invoice.taxSettings.taxRate ?? 0
        });
      }
      if (invoice.adjustments?.shippingCharge) {
        migratedTaxes.push({
          id: 'legacy-shipping',
          name: 'Shipping / Extra',
          type: 'flat',
          value: invoice.adjustments.shippingCharge
        });
      }
      // If it has no legacy fields and taxes was undefined/null, fallback to default taxes
      if (migratedTaxes.length === 0 && !invoice.taxSettings) {
        migratedTaxes = DEFAULT_INVOICE_DATA.taxes;
      }
    }

    setData({
      ...DEFAULT_INVOICE_DATA,
      ...invoice,
      invoiceMeta: {
        ...DEFAULT_INVOICE_DATA.invoiceMeta,
        ...(invoice.invoiceMeta || {}),
      },
      taxes: migratedTaxes,
      adjustments: {
        discountType: invoice.adjustments?.discountType ?? 'percentage',
        discountValue: invoice.adjustments?.discountValue ?? 0,
      }
    });
  };

  const resetToDefault = () => {
    setData(DEFAULT_INVOICE_DATA);
  };

  return (
    <InvoiceContext.Provider value={{ data, updateData, updateField, loadInvoice, resetToDefault }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoiceContext() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoiceContext must be used within an InvoiceProvider');
  }
  return context;
}
