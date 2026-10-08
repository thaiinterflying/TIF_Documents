import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  helperText?: string;
  requiredStar?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, helperText, requiredStar, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-bold text-slate-700 tracking-wide mb-1.5 uppercase"
          >
            {label}
            {requiredStar && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-2xs transition-all duration-200">
          <select
            ref={ref}
            id={selectId}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:outline-hidden focus:ring-3 disabled:bg-slate-100/80 disabled:text-slate-500 cursor-pointer appearance-none ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200/50 bg-rose-50/20'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-700 focus:ring-blue-600/15'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
            <svg className="w-4 h-4 fill-current transition-transform duration-200" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
