import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  requiredStar?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, requiredStar, className = '', id, rows = 3, ...props }, ref) => {
    const textId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textId}
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            {label}
            {requiredStar && <span className="text-red-500 ml-1 font-bold">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-2xs">
          <textarea
            ref={ref}
            id={textId}
            rows={rows}
            className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-100 disabled:text-slate-500 leading-relaxed ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-slate-300 hover:border-slate-400 focus:border-blue-700 focus:ring-blue-100'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
