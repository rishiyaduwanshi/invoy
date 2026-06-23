import { z } from 'zod';

// Zod Schema Definition for Invoice
export const InvoiceItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  description: z.string(),
  quantity: z.number(),
  rate: z.number(),
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
    state: z.string(),
  }),
  invoiceMeta: z.object({
    invoiceNumber: z.string(),
    date: z.string(),
    dueDate: z.string(),
  }),
  items: z.array(InvoiceItemSchema),
  taxSettings: z.object({
    applyGst: z.boolean(),
    gstRate: z.number(),
    senderState: z.string(),
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
    state: 'Delhi',
  },
  invoiceMeta: {
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
  },
  items: [
    { id: 1, description: '', quantity: 1, rate: 0 },
  ],
  taxSettings: {
    applyGst: true,
    gstRate: 18,
    senderState: 'Delhi',
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
