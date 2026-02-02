import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ThemeToggle'; // Certifique-se de ter criado este componente

/**
 * Propriedades do Header
 */
interface HeaderProps {
  /** Título da página exibido no topo */
  title: string;
  /** Callback executado ao clicar no botão de menu (mobile) */
  onMenuClick: () => void;
}

/**
 * Cabeçalho principal da aplicação.
 * Contém o título da página, botão de menu mobile, toggle de tema e perfil do usuário.
 *
 * @component
 * @example
 * ```tsx
 * <Header 
 *   title="Dashboard" 
 *   onMenuClick={() => setSidebarOpen(true)} 
 * />
 * ```
 */
export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-20 md:h-24 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
      {/* Background Blur only happens on scroll? Or always? Let's make it subtle always but clean */}
      {/* Na verdade, vamos deixar o header transparente/blurry sobre o fundo global */}
      
      <div className="flex items-center gap-4">
        {/* Botão Hambúrguer */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2.5 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-white/50 dark:hover:bg-slate-800 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Title & Breadcrumbs */}
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            {title}
          </h2>
          {/* Opcional: Data ou Breadcrumb aqui */}
          {/* <span className="text-xs text-slate-400 hidden md:block">Visão Geral do Sistema</span> */}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Botão de Troca de Tema */}
        <ThemeToggle />

        {/* Notificações (Placeholder for Future) */}
        {/* <button className="p-2 text-slate-400 hover:text-cyan-600 transition-colors relative">
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
            <Bell className="w-6 h-6" />
        </button> */}

        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block"></div>

{/* Perfil removido para evitar duplicidade com a Sidebar */}
      </div>
    </header>
  );
}