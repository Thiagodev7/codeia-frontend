import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 overflow-hidden"
      title="Alternar Tema"
    >
      <div className="relative w-5 h-5">
        {/* Ícone do Sol (Light Mode) */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-500 ease-in-out transform ${
            theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`} 
        />
        
        {/* Ícone da Lua (Dark Mode) */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-500 ease-in-out transform ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
    </button>
  );
}