import clsx from 'clsx';
import { X } from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string; // Para o container interno
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  className,
  size = 'md'
}: ModalProps) {

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Bloqueia scroll do body
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop com blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={clsx(
          "relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 flex flex-col max-h-[90vh]",
          sizes[size],
          className
        )}
      >
        {/* Header (se tiver título) */}
        {(title || description) && (
          <div className="flex justify-between items-start p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="space-y-1">
              {title && <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>}
              {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

         {/* Se não tiver header, mostra botão de fechar flutuante */}
         {!title && !description && (
           <button 
             onClick={onClose} 
             className="absolute top-4 right-4 z-10 p-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
           >
             <X className="w-5 h-5" />
           </button>
         )}

        {/* Body (com scroll se necessário) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
