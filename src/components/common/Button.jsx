import React from 'react';

const variants = {
  primary: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 active:scale-95 hover:-translate-y-0.5 border border-orange-400/20',
  secondary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 hover:-translate-y-0.5',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/40 active:scale-95 hover:-translate-y-0.5',
  outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-orange-50/60 dark:hover:bg-slate-800 hover:border-orange-300 dark:hover:border-orange-500/40 active:scale-95 hover:-translate-y-0.5',
  ghost: 'text-slate-600 dark:text-slate-300 hover:bg-orange-50/60 dark:hover:bg-slate-800 hover:text-orange-600 active:scale-95 hover:scale-105'
};

const sizes = {
  sm: 'px-3 py-2 text-xs font-medium rounded-lg min-h-[36px]',
  md: 'px-4 py-2.5 text-sm font-medium rounded-xl min-h-[44px]',
  lg: 'px-5 py-3 text-base font-semibold rounded-xl min-h-[48px]'
};

const iconOnlySizes = {
  sm: 'min-w-[36px] min-h-[36px] p-2',
  md: 'min-w-[44px] min-h-[44px] p-2.5',
  lg: 'min-w-[48px] min-h-[48px] p-3'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  isLoading = false,
  disabled = false,
  ...props
}) => {
  // Icon-only ghost buttons need matching touch area for size
  const isIconOnly = Icon && !children;

  return (
    <button
      disabled={disabled || isLoading}
      className={`group inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation select-none ${variants[variant]} ${sizes[size]} ${isIconOnly ? iconOnlySizes[size] || iconOnlySizes.md : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
      ) : null}
      {children}
    </button>
  );
};
