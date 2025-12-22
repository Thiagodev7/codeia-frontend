import { useAuth } from '../../context/AuthContext';
import { UserCircle } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20 px-8 flex items-center justify-between">
      <h2 className="text-2xl font-light text-slate-100">{title}</h2>
      
      <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-200">{user?.name}</span>
          <span className="text-[10px] text-slate-500 leading-none">Online</span>
        </div>
      </div>
    </header>
  );
}