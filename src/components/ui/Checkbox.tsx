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
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={checkId}
            type="checkbox"
            className={`h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-700 cursor-pointer accent-blue-900 ${
              error ? 'border-red-400' : ''
            } ${className}`}
            {...props}
          />
        </div>
        <div className="ml-2.5 text-sm select-none">
          <label htmlFor={checkId} className="font-medium text-slate-800 cursor-pointer">
            {label}
          </label>
          {description && <p className="text-xs text-slate-500">{description}</p>}
          {error && <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
