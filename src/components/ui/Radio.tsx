import React, { forwardRef } from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const radioId = id || (typeof label === 'string' ? `radio-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);

    return (
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className={`h-4 w-4 border-slate-300 text-blue-900 focus:ring-blue-700 cursor-pointer accent-blue-900 ${className}`}
            {...props}
          />
        </div>
        <div className="ml-2.5 text-sm select-none">
          <label htmlFor={radioId} className="font-medium text-slate-800 cursor-pointer">
            {label}
          </label>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      </div>
    );
  }
);

Radio.displayName = 'Radio';
