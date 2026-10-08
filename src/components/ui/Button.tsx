import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer shadow-xs';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 font-medium tracking-tight',
    md: 'text-sm px-4.5 py-2.5 gap-2 font-semibold tracking-tight',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-bold tracking-tight',
  };

  const variantStyles = {
    primary:
      'bg-blue-900 text-white hover:bg-blue-800 active:bg-blue-950 focus:ring-blue-800 shadow-2xs font-semibold border border-transparent',
    gold:
      'bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600 focus:ring-amber-400 font-bold shadow-2xs border border-transparent',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-400 border border-slate-200',
    outline:
      'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 focus:ring-slate-400 border border-slate-300 shadow-2xs',
    danger:
      'bg-red-700 text-white hover:bg-red-800 active:bg-red-900 focus:ring-red-600 shadow-2xs border border-transparent',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus:ring-slate-300 shadow-none border-transparent',
    success:
      'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 focus:ring-emerald-600 shadow-2xs border border-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};
