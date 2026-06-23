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

  const loadInvoice = (invoice: InvoiceType) => {
    setData(invoice);
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
