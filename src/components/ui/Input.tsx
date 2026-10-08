import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  requiredStar?: boolean;
  leftIcon?: React.ReactNode;
  rightAddon?: string | React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      requiredStar = false,
      leftIcon,
      rightAddon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-slate-700 tracking-wide mb-1.5 uppercase"
          >
            {label}
            {requiredStar && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-2xs transition-all duration-200">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-hidden focus:ring-3 disabled:bg-slate-100/80 disabled:text-slate-500 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : ''
            } ${rightAddon ? 'pr-14' : ''} ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200/50 bg-rose-50/20'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-700 focus:ring-blue-600/15'
            } ${className}`}
            {...props}
          />
          {rightAddon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-semibold text-slate-500">
              {rightAddon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
