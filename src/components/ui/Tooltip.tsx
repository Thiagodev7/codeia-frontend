import clsx from 'clsx';
import { useRef, useState, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), 300); // Delay
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const positions = {
    top: "-top-2 left-1/2 -translate-x-1/2 -translate-y-full mb-2",
    bottom: "-bottom-2 left-1/2 -translate-x-1/2 translate-y-full mt-2",
    left: "-left-2 top-1/2 -translate-y-1/2 -translate-x-full mr-2",
    right: "-right-2 top-1/2 -translate-y-1/2 translate-x-full ml-2",
  };

  return (
    <div 
      className="relative inline-flex" 
      onMouseEnter={showTooltip} 
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div 
          className={clsx(
            "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 rounded shadow-lg whitespace-nowrap animate-fade-in pointer-events-none",
            positions[position]
          )}
          role="tooltip"
        >
          {content}
          {/* Seta (opcional, pode ser adicionada com pseudo-elemento) */}
        </div>
      )}
    </div>
  );
}
