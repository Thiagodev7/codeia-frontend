import clsx from 'clsx';
import { type HTMLAttributes, forwardRef } from 'react';

/**
 * Propriedades do componente Card
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Se verdadeiro, remove o padding padrão (p-6) do card
   * @default false
   */
  noPadding?: boolean;
}

/**
 * Container genérico com borda, sombra e padding padrão.
 * Usado para agrupar conteúdo relacionado na interface.
 *
 * @component
 * @example
 * ```tsx
 * // Card padrão com padding
 * <Card>
 *   <h3>Título</h3>
 *   <p>Conteúdo</p>
 * </Card>
 *
 * // Card sem padding para conteúdos full-width (ex: tabelas, imagens)
 * <Card noPadding>
 *   <img src="..." />
 *   <div className="p-4">Legenda</div>
 * </Card>
 * ```
 */
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
