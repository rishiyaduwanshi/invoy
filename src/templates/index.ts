// ── Template Registry ──────────────────────────────────────────────────
// To ADD a new template:
//   1. Define its metadata in TEMPLATES array below
//   2. Create its rendering component in src/templates/
//   3. Register it in src/components/InvoicePreview.jsx
//
// That's it. The form auto-updates, the selector auto-updates.

export type TemplateConfig = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  accentColor: string;
  features: string[];
};

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "modern",
    name: "Modern",
    emoji: "✨",
    description: "Clean, minimal design for freelancers & agencies",
    accentColor: "#4F46E5",
    features: ["Logo optional", "GSTIN badge", "Full-width totals", "Signature section"]
  },
  {
    id: "classic",
    name: "Classic (MSME)",
    emoji: "⭐",
    description: "Formal Govt-style layout for MSMEs with Udyam branding",
    accentColor: "#4472C4",
    features: ["Govt MSME branding", "Udyam Reg No", "Blue title bar", "Declaration section"]
  },
  {
    id: "minimalist",
    name: "Minimalist",
    emoji: "🍃",
    description: "Elegant serif typography with light borders for a clean editorial look",
    accentColor: "#111827",
    features: ["Serif typography", "Thin dividers", "Compact layout", "Monochromatic design"]
  },
  {
    id: "creative",
    name: "Creative",
    emoji: "🎨",
    description: "Vibrant colors, modern cards, and structured headers for creators",
    accentColor: "#EC4899",
    features: ["Vibrant pink gradient", "Carded layout", "Modern styling", "Fun fonts"]
  },
  {
    id: "corporate",
    name: "Corporate",
    emoji: "🏢",
    description: "Traditional split panel layout with corporate navy accents",
    accentColor: "#1E3A8A",
    features: ["Left details column", "Navy theme", "Clean structured rows", "Enterprise layout"]
  },
  {
    id: "elegant",
    name: "Elegant",
    emoji: "💎",
    description: "Luxurious design with rose gold / gold accents and centered titles",
    accentColor: "#B45309",
    features: ["Centered header", "Gold accents", "Double border lines", "Spacious grid"]
  }
];

export const DEFAULT_TEMPLATE = TEMPLATES[0].id;

export function getTemplate(id: string): TemplateConfig {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

