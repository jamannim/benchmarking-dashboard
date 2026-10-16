import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export type TableDensity = 'compact' | 'auto' | 'relaxed';

interface DensityToggleProps {
  density: TableDensity;
  onChange: (d: TableDensity) => void;
  className?: string;
}

export const DensityToggle: React.FC<DensityToggleProps> = ({ density, onChange, className = '' }) => {
  return (
    <div className={`inline-flex items-center space-x-1.5 bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750 text-xs ${className}`}>
      <span className="text-slate-400 text-xs font-semibold mr-1 flex items-center shrink-0">
        <SlidersHorizontal className="w-3 h-3 mr-1 text-brand-purpleLight" />
        자간·행간:
      </span>
      <button
        type="button"
        onClick={() => onChange('compact')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
          density === 'compact'
            ? 'bg-dark-700 text-white font-bold border border-slate-600 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        좁게
      </button>
      <button
        type="button"
        onClick={() => onChange('auto')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
          density === 'auto'
            ? 'bg-brand-purple text-white font-bold shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        자동(권장)
      </button>
      <button
        type="button"
        onClick={() => onChange('relaxed')}
        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
          density === 'relaxed'
            ? 'bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        넓게
      </button>
    </div>
  );
};

export const getTableDensityClasses = (density: TableDensity) => {
  switch (density) {
    case 'compact':
      return {
        th: 'py-2 px-3 text-xs tracking-wider uppercase font-semibold text-slate-400',
        td: 'py-2 px-3 text-xs leading-normal tracking-normal',
        tableText: 'text-xs'
      };
    case 'relaxed':
      return {
        th: 'py-4 px-4.5 text-xs tracking-widest uppercase font-bold text-slate-400',
        td: 'py-4.5 px-4.5 text-sm leading-loose tracking-wide',
        tableText: 'text-sm'
      };
    case 'auto':
    default:
      return {
        th: 'py-3 px-4 text-xs tracking-wider uppercase font-bold text-slate-400',
        td: 'py-3.5 px-4 text-sm leading-relaxed tracking-normal',
        tableText: 'text-sm'
      };
  }
};
