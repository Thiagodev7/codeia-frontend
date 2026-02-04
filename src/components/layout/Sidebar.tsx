import clsx from 'clsx';
import {
    CalendarClock,
    LayoutGrid,
    LogOut,
    MessageCircle,
    MessageSquareCode,
    Scissors, // ✅ Importado
    Settings,
    Share2,
    Store,
    User,
    X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();

  const navItems = [
    { to: "/", icon: LayoutGrid, label: "Dashboard" },
    { to: "/calendar", icon: CalendarClock, label: "Agenda" }, // 
    { to: "/services", icon: Scissors, label: "Serviços" }, // ✅ Nova Tela
    { to: "/channels", icon: Share2, label: "Meus Canais" }, // Nova tela unificada
    { to: "/monitor", icon: MessageCircle, label: "Monitoramento" },
    { to: "/business", icon: Store, label: "Meu Negócio" },
    // { to: "/agents", icon: Cpu, label: "Agentes IA" }, // Substituído por Channels
    { to: "/chat", icon: MessageSquareCode, label: "Simulador" },
    { to: "/settings", icon: Settings, label: "Configurações" },
  ];

  return (
    <>
      {/* Overlay Escuro (Mobile) */}
      <div 
        className={clsx(
          "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-72 flex flex-col transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)",
          "md:translate-x-0 md:static md:h-screen md:py-4 md:pl-4", // Desktop: Padding para efeito flutuante
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Card Interno da Sidebar (Glass Effect) */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 md:rounded-2xl border-r md:border border-slate-200 dark:border-slate-800 shadow-2xl md:shadow-xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden relative">
          
          {/* Header / Logo */}
          <div className="p-6 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Logo size="md" />
            </div>
            
            <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => clsx(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                {({ isActive }) => (
                  <>
                    {/* Indicador Ativo */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                    )}
                    
                    <item.icon className={clsx(
                      "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )} />
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Glow Effect on Hover */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 -z-0"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer Profile */}
          <div className="p-4 mt-auto">
            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/20">
                  {user?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Pro Plan</p>
                </div>
              </div>
              
              <button 
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            </div>
          </div>
          
        </div>
      </aside>
    </>
  );
}