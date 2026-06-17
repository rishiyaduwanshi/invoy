// ── Centralized SVG icon strings ──────────────────────────────────────────
// Usage in Astro  : <Fragment set:html={icons.download} />
// Usage in React  : <span dangerouslySetInnerHTML={{ __html: icons.download }} />
// Add new icons here — available everywhere automatically.

const svg = (body: string, size = 24, sw = 1.8) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const svgFill = (body: string, size = 24) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" stroke="none">${body}</svg>`;

export const icons: Record<string, string> = {
  // ── Navigation ──────────────────────────────────────────────────────
  'arrow-left':  svg(`<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`, 18, 2),
  'arrow-right': svg(`<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`, 16, 2.5),

  // ── Actions ─────────────────────────────────────────────────────────
  'download':    svg(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>`, 18, 2),
  'plus':        svg(`<line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>`, 15, 2.5),
  'trash':       svg(`<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>`, 15, 2),
  'upload':      svg(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>`, 14, 2),
  'edit':        svg(`<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`, 15, 2),
  'eye':         svg(`<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`, 15, 2),

  // ── Status ──────────────────────────────────────────────────────────
  'check':       svg(`<polyline points="20 6 9 17 4 12"/>`, 16, 2.5),
  'x':           svg(`<line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>`, 16, 2),
  'chevron-down':svg(`<polyline points="6 9 12 15 18 9"/>`, 16, 2.5),

  // ── Communication ───────────────────────────────────────────────────
  'message':     svg(`<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`, 18, 2),
  'mail':        svg(`<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`, 18, 2),
  'github':      svg(`<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.1-.34 6.33-1.53 6.33-6.81a5.02 5.02 0 0 0-1.3-3.41 4.67 4.67 0 0 0-.1-3.37s-1.03-.33-3.37 1.25a11.62 11.62 0 0 0-6.2 0C6.03 1.07 5 1.4 5 1.4a4.67 4.67 0 0 0-.1 3.37 5.02 5.02 0 0 0-1.3 3.41c0 5.28 3.23 6.47 6.33 6.81a4.8 4.8 0 0 0-1 3.02v4"/><path d="M9 20c-3 1-5-1-6-2"/>`, 18, 2),
  'globe':       svg(`<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>`, 18, 2),

  // ── UI / Misc ────────────────────────────────────────────────────────
  'shield':      svg(`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`, 16, 2),
  'lock':        svg(`<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`, 16, 2),
  'layers':      svg(`<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`, 18, 2),
  'zap':         svgFill(`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`, 14),
  'home':        svg(`<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`, 16, 2),

  // ── Brand / Filled ───────────────────────────────────────────────────
  'heart':       svgFill(`<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`, 16),
  'star':        svgFill(`<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`, 16),

  // ── Feature icons (used in features.json) ───────────────────────────
  'calculator':  svg(`<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/>`, 22),
  'percent':     svg(`<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>`, 22),
  'receipt':     svg(`<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 10h8M8 14h4"/>`, 22),
  'hash':        svg(`<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>`, 22),
  'building':    svg(`<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>`, 22),
  'user':        svg(`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`, 22),
  'file-down':   svg(`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>`, 22),
  'pencil':      svg(`<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`, 22),

  // ── How it works icons (used in steps.json) ──────────────────────────
  'file-plus':   svg(`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>`, 28),
  'eye-lg':      svg(`<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`, 28),
  'download-lg': svg(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`, 28),
};
