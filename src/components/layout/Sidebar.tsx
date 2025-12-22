import { LayoutGrid, Box, CalendarClock, MessageCircle, Cpu, MessageSquareCode, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export function Sidebar() {
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
    <aside className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 backdrop-blur-xl z-10">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Code<span className="text-cyan-500">IA</span>
        </h1>
        <span className="text-[10px] font-bold border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">PRO</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
              isActive 
                ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] border border-cyan-500/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100 hover:translate-x-1"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}