import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'emerald' | 'amber';
  loading: boolean;
  to: string;
  trend?: {
    value: number; // Porcentagem (ex: 15)
    isPositive: boolean;
  };
}

export function StatCard({ label, value, icon: Icon, color, loading, to, trend }: StatCardProps) {
  const colors = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
    purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  return (
    <Link 
      to={to} 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl transition-all hover:shadow-lg dark:hover:shadow-cyan-900/5 hover:-translate-y-1 block group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl transition-colors ${colors[color]} group-hover:scale-110 duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        
        {trend && (
            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.isPositive ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1 tracking-tight">
          {value !== undefined ? value : '-'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 group-hover:text-cyan-600 transition-colors">
            {label} 
            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </p>
      </div>
    </Link>
  );
}
