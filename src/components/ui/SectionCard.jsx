import React from 'react';

export default function SectionCard({ children, className = '' }) {
  return (
    <div className={`bg-white/[0.04] rounded-2xl p-5 border border-white/8 ${className}`}>
      {children}
    </div>
  );
}
