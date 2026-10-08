import React, { forwardRef } from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', id, ...props }, ref) => {
    const checkId = id || (typeof label === 'string' ? `chk-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);

    return (
      <div className="relative flex items-start group">
        <div className="flex items-center h-5 pt-0.5">
          <input
            ref={ref}
            id={checkId}
            type="checkbox"
            className={`h-4.5 w-4.5 rounded-md border-slate-300 text-blue-900 focus:ring-2 focus:ring-blue-600/20 cursor-pointer accent-blue-900 transition-all ${
              error ? 'border-rose-400' : 'group-hover:border-blue-600'
            } ${className}`}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm select-none">
          <label htmlFor={checkId} className="font-medium text-slate-800 cursor-pointer group-hover:text-blue-950 transition-colors">
            {label}
          </label>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          {error && <p className="text-xs text-rose-600 font-medium mt-0.5">{error}</p>}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
