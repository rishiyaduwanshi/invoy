import type { InvoiceType } from '../schema/invoice';

const STORAGE_KEY = 'invoy_saved_invoices';

export type SavedInvoice = {
  id: string; // Unique identifier (timestamp)
  updatedAt: string;
  name: string; // E.g., Client name or Invoice number to identify
  data: InvoiceType;
};

export const storage = {
  // Get all saved invoices
  getAll: (): SavedInvoice[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse invoices from local storage', e);
      return [];
    }
  },

  // Get a single invoice by ID
  getById: (id: string): SavedInvoice | undefined => {
    const invoices = storage.getAll();
    return invoices.find((inv) => inv.id === id);
  },

  // Save or update an invoice
  save: (data: InvoiceType, id?: string): string => {
    if (typeof window === 'undefined') return '';
    const invoices = storage.getAll();
    
    const targetId = id || Date.now().toString();
    const name = data.clientDetails.name 
      ? `${data.clientDetails.name} - ${data.invoiceMeta.invoiceNumber}` 
      : `Invoice ${data.invoiceMeta.invoiceNumber}`;

    const newInvoice: SavedInvoice = {
      id: targetId,
      updatedAt: new Date().toISOString(),
      name,
      data,
    };

    const existingIndex = invoices.findIndex((inv) => inv.id === targetId);
    if (existingIndex >= 0) {
      invoices[existingIndex] = newInvoice;
    } else {
      invoices.unshift(newInvoice); // Add to the top
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    return targetId;
  },

  // Delete an invoice
  delete: (id: string): void => {
    if (typeof window === 'undefined') return;
    const invoices = storage.getAll();
    const filtered = invoices.filter((inv) => inv.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Save the current invoice's business/sender details as the default profile
  saveProfile: (data: InvoiceType): void => {
    if (typeof window === 'undefined') return;
    const profile = {
      senderDetails: data.senderDetails,
      taxSettings: data.taxSettings,
      contentOptions: data.contentOptions,
      paymentDetails: data.paymentDetails,
      declaration: data.declaration,
      template: data.template
    };
    localStorage.setItem('invoy_default_profile', JSON.stringify(profile));
  },

  // Get the default profile
  getProfile: (): Partial<InvoiceType> | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem('invoy_default_profile');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Get all saved business profiles
  getBusinessProfiles: (): any[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('invoy_business_profiles');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Save a business profile
  saveBusinessProfile: (businessData: any): void => {
    if (typeof window === 'undefined') return;
    const name = businessData.senderDetails?.businessName || businessData.senderDetails?.name;
    if (!name) return; // Require at least a name
    const profiles = storage.getBusinessProfiles();
    
    // Check if business already exists, update if it does
    const existingIndex = profiles.findIndex(p => 
      (p.senderDetails?.businessName || p.senderDetails?.name) === name
    );
    if (existingIndex >= 0) {
      profiles[existingIndex] = businessData;
    } else {
      profiles.push(businessData);
    }
    
    localStorage.setItem('invoy_business_profiles', JSON.stringify(profiles));
    // Also save it as the default profile for convenience
    storage.saveProfile(businessData);
  },

  // ── Form Profiles (Reusable Templates) ──────────────────────────────────
  getFormProfiles: (): any[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('invoy_form_profiles');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveFormProfile: (profileName: string, data: InvoiceType): void => {
    if (typeof window === 'undefined') return;
    const profiles = storage.getFormProfiles();
    
    const existingIndex = profiles.findIndex(p => p.profileName === profileName);
    const profileToSave = { 
      id: existingIndex >= 0 ? profiles[existingIndex].id : Date.now().toString(),
      profileName, 
      updatedAt: new Date().toISOString(), 
      data 
    };
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = profileToSave;
    } else {
      profiles.push(profileToSave);
    }
    
    localStorage.setItem('invoy_form_profiles', JSON.stringify(profiles));
  },

  // Get all saved client profiles
  getClientProfiles: (): any[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('invoy_client_profiles');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Save a client profile
  saveClientProfile: (clientDetails: any): void => {
    if (typeof window === 'undefined') return;
    if (!clientDetails.name) return; // Require at least a name
    const profiles = storage.getClientProfiles();
    
    // Check if client already exists, update if it does
    const existingIndex = profiles.findIndex(p => p.name === clientDetails.name);
    if (existingIndex >= 0) {
      profiles[existingIndex] = clientDetails;
    } else {
      profiles.push(clientDetails);
    }
    
    localStorage.setItem('invoy_client_profiles', JSON.stringify(profiles));
  }
};
