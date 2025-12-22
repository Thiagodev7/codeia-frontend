import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react'; // Importar ícone do Menu

interface HeaderProps {
  title: string;
  onMenuClick: () => void; // Nova prop
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 md:h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Botão Hambúrguer - Só aparece no Mobile */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h2 className="text-xl md:text-2xl font-light text-slate-100 truncate">{title}</h2>
      </div>
      
      {/* Perfil do Usuário */}
      <div className="flex items-center gap-3 md:gap-4 bg-slate-900/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-800">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs md:text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col hidden sm:flex"> {/* Esconde nome em telas muito pequenas */}
          <span className="text-sm font-medium text-slate-200">{user?.name}</span>
          <span className="text-[10px] text-slate-500 leading-none">Online</span>
        </div>
      </div>
    </header>
  );
}