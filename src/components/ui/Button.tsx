import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  disabled,
  ...props 
}, ref) => {
  
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 focus:ring-cyan-500 border-transparent shadow-md shadow-cyan-500/20",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus:ring-slate-500 border-transparent",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 border-transparent shadow-md shadow-red-500/20",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 focus:ring-slate-500",
    outline: "bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-500"
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
    icon: "p-2"
  };

  return (
    <button
      ref={ref}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';
