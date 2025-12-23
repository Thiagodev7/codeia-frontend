import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Fundo Principal: bg-slate-50 (Claro) vs bg-slate-950 (Escuro)
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-500 ease-in-out">
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header 
          title={title} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        {/* Conteúdo */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}