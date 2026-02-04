import clsx from 'clsx';
import { Brain } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const containerSizes = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={clsx("flex items-center select-none", containerSizes[size], className)}>
      {/* Icon with Gradient Definition */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full"></div>
        
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#21F4EF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#B781F6" />
            </linearGradient>
          </defs>
        </svg>

        <Brain 
          className={clsx(iconSizes[size], "relative z-10")} 
          style={{ stroke: "url(#logo-gradient)" }}
          strokeWidth={1.5}
        />
      </div>

      {/* Text Logo */}
      <div className={clsx("font-bold tracking-tight flex items-baseline", textSizes[size])}>
        <span className="text-white dark:text-white">Code</span>
        <span 
          className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 ml-[1px]"
          style={{ 
            backgroundSize: '200% auto',
          }}
        >
          IA
        </span>
      </div>
    </div>
  );
}
