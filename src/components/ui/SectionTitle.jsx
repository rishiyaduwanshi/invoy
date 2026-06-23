import React from 'react';

const colors = {
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  yellow: 'bg-yellow-500',
  pink: 'bg-pink-500',
  red: 'bg-red-500',
};

export default function SectionTitle({ color = 'indigo', children, className = '' }) {
  const colorClass = colors[color] || colors.indigo;
  return (
    <h2 className={`text-base font-bold text-white mb-4 flex items-center gap-2 ${className}`}>
      <span className={`w-1 h-4 ${colorClass} rounded-full`} />
      {children}
    </h2>
  );
}
