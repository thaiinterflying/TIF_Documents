import React, { forwardRef } from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const radioId = id || (typeof label === 'string' ? `radio-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);

    return (
      <div className="relative flex items-start group">
        <div className="flex items-center h-5 pt-0.5">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className={`h-4.5 w-4.5 border-slate-300 text-blue-900 focus:ring-2 focus:ring-blue-600/20 cursor-pointer accent-blue-900 transition-all ${className}`}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm select-none">
          <label htmlFor={radioId} className="font-medium text-slate-800 cursor-pointer group-hover:text-blue-950 transition-colors">
            {label}
          </label>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
    );
  }
);

Radio.displayName = 'Radio';
