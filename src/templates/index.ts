// ── Template Registry ──────────────────────────────────────────────────
// To ADD a new template:
//   1. Create src/templates/your-template.json  (metadata)
//   2. Add it to TEMPLATES array below
//   3. Create its rendering component in InvoicePreview.jsx
//
// That's it. The form auto-updates, the selector auto-updates.

import modern from './modern.json';
import classic from './classic.json';

export type TemplateConfig = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  accentColor: string;
  features: string[];
};

export const TEMPLATES: TemplateConfig[] = [
  modern as TemplateConfig,
  classic as TemplateConfig,
];

export const DEFAULT_TEMPLATE = TEMPLATES[0].id;

export function getTemplate(id: string): TemplateConfig {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
