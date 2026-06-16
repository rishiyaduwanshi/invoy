import React from 'react';

// ── Icon type ──────────────────────────────────────────────────────────
type IconProps = React.SVGProps<SVGSVGElement>;

const icon =
  (path: React.ReactNode, viewBox = '0 0 24 24') =>
  ({ width = 18, height = 18, ...props }: IconProps) =>
    (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {path}
      </svg>
    );

// ── Navigation ──────────────────────────────────────────────────────────
export const ArrowLeftIcon = icon(
  <><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>
);

export const HomeIcon = icon(
  <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>
);

// ── Actions ─────────────────────────────────────────────────────────────
export const DownloadIcon = icon(
  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></>
);

export const PlusIcon = icon(
  <><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></>
);

export const TrashIcon = icon(
  <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>
);

export const EditIcon = icon(
  <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>
);

export const EyeIcon = icon(
  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
);

export const UploadIcon = icon(
  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></>
);

// ── Communication ────────────────────────────────────────────────────────
export const MailIcon = icon(
  <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>
);

export const GithubIcon = icon(
  <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.1-.34 6.33-1.53 6.33-6.81a5.02 5.02 0 0 0-1.3-3.41 4.67 4.67 0 0 0-.1-3.37s-1.03-.33-3.37 1.25a11.62 11.62 0 0 0-6.2 0C6.03 1.07 5 1.4 5 1.4a4.67 4.67 0 0 0-.1 3.37 5.02 5.02 0 0 0-1.3 3.41c0 5.28 3.23 6.47 6.33 6.81a4.8 4.8 0 0 0-1 3.02v4" /><path d="M9 20c-3 1-5-1-6-2" /></>
);

export const GlobeIcon = icon(
  <><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></>
);

// ── Status ───────────────────────────────────────────────────────────────
export const CheckIcon = icon(
  <><polyline points="20 6 9 17 4 12" /></>
);

export const XIcon = icon(
  <><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></>
);

// ── Document / Invoice ───────────────────────────────────────────────────
export const FileTextIcon = icon(
  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>
);

export const LockIcon = icon(
  <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>
);

export const LayersIcon = icon(
  <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>
);
