import React from 'react';

export default function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/60 focus:bg-white/8 transition-all duration-200 ${className}`}
    />
  );
}
