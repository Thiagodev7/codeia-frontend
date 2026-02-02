import clsx from 'clsx';
import { type HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'outline';
}

export function Badge({ 
  className, 
  variant = 'neutral',
  children,
  ...props
}: BadgeProps) {
  
  const variants = {
    neutral: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-transparent",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 border-transparent",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border-transparent",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border-transparent",
    error: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400 border-transparent",
    outline: "text-slate-500 border-slate-300 dark:text-slate-400 dark:border-slate-700"
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
