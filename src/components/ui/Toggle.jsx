import React from 'react';

export default function Toggle({ checked, onChange, label, description, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-10 h-5 bg-neutral-700 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand" />
      </label>
    </div>
  );
}
