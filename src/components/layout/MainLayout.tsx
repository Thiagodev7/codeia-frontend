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
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar Responsiva */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* No Mobile (padrão): ml-0 (sem margem)
         No Desktop (md): ml-64 (margem da sidebar)
      */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header 
          title={title} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        {/* Padding ajustado: p-4 no celular, p-8 no desktop */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}