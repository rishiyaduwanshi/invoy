import { z } from 'zod';

export const TaxItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['percentage', 'flat']),
  value: z.union([z.number(), z.string()]),
});

// Zod Schema Definition for Invoice
export const InvoiceItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  description: z.string(),
  quantity: z.union([z.number(), z.string()]),
  rate: z.union([z.number(), z.string()]),
});

export const InvoiceSchema = z.object({
  template: z.string(),
  senderDetails: z.object({
    businessName: z.string(),
    name: z.string(),
    email: z.email(),
    phone: z.string(),
    address: z.string(),
    gstin: z.string(),
    udyamNo: z.string(),
    logo: z.any().nullable().optional(), // File object usually, keeping it loose for now
    signature: z.any().nullable().optional(),
  }),
  clientDetails: z.object({
    name: z.string(),
    email: z.string(),
    address: z.string(),
    state: z.string(), // Kept for legacy compatibility if needed, but not used for tax anymore
  }),
  invoiceMeta: z.object({
    invoiceNumber: z.string(),
    date: z.string(),
    dueDate: z.string(),
    currency: z.string(),
    quantityLabel: z.string(),
    rateLabel: z.string(),
  }),
  items: z.array(InvoiceItemSchema),
  taxes: z.array(TaxItemSchema),
  adjustments: z.object({
    discountType: z.enum(['percentage', 'flat']),
    discountValue: z.union([z.number(), z.string()]),
  }),
  contentOptions: z.object({
    showSignature: z.boolean(),
    showPaymentDetails: z.boolean(),
    showDeclaration: z.boolean(),
    showDueDate: z.boolean(),
    showUdyamNo: z.boolean(),
  }),
  paymentDetails: z.object({
    mode: z.string(),
    status: z.string(),
    transactionId: z.string(),
  }),
  declaration: z.string(),
});

// Infer TypeScript types from the Zod Schema
export type InvoiceType = z.infer<typeof InvoiceSchema>;
export type InvoiceItemType = z.infer<typeof InvoiceItemSchema>;

// The unified initial state / template
export const DEFAULT_INVOICE_DATA: InvoiceType = {
  template: 'modern',
  senderDetails: {
    businessName: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    udyamNo: '',
    logo: null,
    signature: null,
  },
  clientDetails: {
    name: '',
    email: '',
    address: '',
    state: 'Bihar',
  },
  invoiceMeta: {
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: '₹',
    quantityLabel: 'Qty',
    rateLabel: 'Rate',
  },
  items: [
    { id: 1, description: '', quantity: 1, rate: 0 },
  ],
  taxes: [
    { id: '1', name: 'Tax', type: 'percentage', value: 18 }
  ],
  adjustments: {
    discountType: 'percentage',
    discountValue: 0,
  },
  contentOptions: {
    showSignature: true,
    showPaymentDetails: false,
    showDeclaration: false,
    showDueDate: true,
    showUdyamNo: false,
  },
  paymentDetails: {
    mode: 'Bank Transfer',
    status: 'Paid',
    transactionId: '',
  },
  declaration: "This invoice is issued for software development and IT services.\nThe service provider is not responsible for how the software is used by the client.\nThis is a service-based engagement under MSME registration."
};
