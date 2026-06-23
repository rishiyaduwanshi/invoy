import React from 'react';

export default function Label({ children, className = '' }) {
  return (
    <label className={`block text-[10px] font-bold text-indigo-200/60 uppercase tracking-widest mb-1.5 ${className}`}>
      {children}
    </label>
  );
}
