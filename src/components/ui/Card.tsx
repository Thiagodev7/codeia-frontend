import clsx from 'clsx';
import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  className, 
  noPadding = false,
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-all",
        !noPadding && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
