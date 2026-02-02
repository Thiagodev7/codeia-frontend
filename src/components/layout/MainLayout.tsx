import { useState, type ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

/**
 * Propriedades do MainLayout
 */
interface MainLayoutProps {
  /** Conteúdo da página */
  children: ReactNode;
  /** Título exibido no Header */
  title: string;
}

/**
 * Layout principal da aplicação autenticada.
 * Inclui Sidebar, Header e área de conteúdo com scroll.
 * Gerencia o estado da sidebar no mobile.
 *
 * @component
 * @example
 * ```tsx
 * <MainLayout title="Configurações">
 *   <SettingsForm />
 * </MainLayout>
 * ```
 */
export function MainLayout({ children, title }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Fundo Principal com gradiente sutil
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-500 ease-in-out font-sans">
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen w-full relative overflow-hidden">
        
        {/* Background Decorative Blobs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[120px]"></div>
            <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
        </div>

        <Header 
          title={title} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        {/* Conteúdo Scrollável */}
        <main className="flex-1 px-4 md:px-10 pb-8 relative z-10 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}