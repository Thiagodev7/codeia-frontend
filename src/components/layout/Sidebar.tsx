import { LayoutGrid, Box, CalendarClock, MessageCircle, Cpu, MessageSquareCode, LogOut, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { signOut } = useAuth();

  const navItems = [
    { to: "/", icon: LayoutGrid, label: "Dashboard" },
    { to: "/services", icon: Box, label: "Serviços" },
    { to: "/calendar", icon: CalendarClock, label: "Agenda" },
    { to: "/monitor", icon: MessageCircle, label: "Monitoramento" },
    { to: "/agents", icon: Cpu, label: "Agentes IA" },
    { to: "/chat", icon: MessageSquareCode, label: "Simulador" },
  ];

  return (
    <>
      {/* Overlay Escuro (Só Mobile) */}
      <div 
        className={clsx(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={clsx(
          // Fundo adaptativo: Branco no claro / Slate-900 no escuro
          // Borda adaptativa: Slate-200 no claro / Slate-800 no escuro
          "fixed top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 transition-all duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">
              Code<span className="text-cyan-600 dark:text-cyan-500">IA</span>
            </h1>
            <span className="text-[10px] font-bold border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">PRO</span>
          </div>
          
          <button onClick={onClose} className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                isActive 
                  ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 shadow-sm border border-cyan-200 dark:border-cyan-500/20" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:translate-x-1"
              )}
            >
              <item.icon className="w-5 h-5 transition-colors" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 transition-colors">
          <button 
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}