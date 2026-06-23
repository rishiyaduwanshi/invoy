// ── Site Configuration ─────────────────────────────────────────────────
// Single source of truth for all site-wide constants.
// Update here - reflects everywhere.

export const SITE = {
  name: 'Invoy',
  tagline: 'Free GST Invoice Generator for India',
  description:
    'Create professional, GST-compliant invoices in seconds. Invoy is completely free, 100% private, and works entirely in your browser.',
  url: 'https://invoy.in',
  appUrl: 'https://invoy.in/app',
  support: {
    email: 'hello@iamabhinav.dev',
    link: 'https://razorpay.me/@invoy',
    github: 'https://github.com/rishiyaduwanshi/invoy',
  },
  social: {
    twitter: 'https://twitter.com/invoy_in',
  },
  seo: {
    ogImage: '/og-image.png',
    twitterCard: 'summary_large_image',
    keywords: [
      'invoice generator india',
      'free gst invoice',
      'msme invoice',
      'online invoice creator',
      'tax invoice india',
    ],
  },
} as const;

export type SiteConfig = typeof SITE;
