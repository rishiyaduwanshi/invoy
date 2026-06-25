import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { icons } from '../../constants/icons';

const Icon = ({ name, className = '' }) => (
  <span className={`inline-flex items-center justify-center ${className}`} dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }} />
);

export default function Select({ 
  value, 
  options, 
  onChange, 
  placeholder = 'Select option', 
  size = 'md', 
  variant = 'default',
  direction = 'down',
  leftIcon = null,
  searchable = false,
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = searchable 
    ? options.filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const sizeClasses = {
    sm: 'px-2.5 py-2.5 text-xs rounded-xl h-[42px]',
    md: 'px-3.5 py-2.5 text-sm rounded-xl h-[42px]',
  };

  const variantClasses = {
    default: 'bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 focus:ring-brand/40',
    primary: 'bg-brand text-black border border-transparent font-bold hover:bg-[#16a34a] hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.2)]',
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left transition-all duration-200 focus:outline-none focus:ring-2 ${variantClasses[variant]} ${sizeClasses[size]}`}
      >
        <span className="flex items-center gap-2 truncate pr-1">
          {leftIcon}
          <span className={`${!selectedOption && variant !== 'primary' ? 'text-neutral-500' : ''} ${variant === 'primary' ? 'text-black' : 'text-white'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <Icon name="chevron-down" className={`w-3.5 h-3.5 shrink-0 transition-transform ${variant === 'primary' ? 'text-black' : 'text-neutral-500'} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'up' ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction === 'up' ? 5 : -5 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 min-w-full w-max right-0 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto ${direction === 'up' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'}`}
          >
            {searchable && (
              <div className="p-2 border-b border-white/5 bg-[#171717] sticky top-0 z-10">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand/40"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="px-3.5 py-2 text-sm text-neutral-500 italic font-medium">No options</div>
            ) : (
              filteredOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors flex items-center gap-2 ${value === opt.value ? 'bg-brand/10 text-brand font-bold' : 'text-neutral-300 hover:bg-white/10 hover:text-white'}`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  {opt.icon && <Icon name={opt.icon} className="w-4 h-4 shrink-0" />}
                  <span>{opt.label}</span>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
