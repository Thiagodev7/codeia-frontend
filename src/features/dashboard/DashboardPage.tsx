import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    ArrowRight,
    CalendarCheck,
    Clock,
    MessageSquare,
    Plus,
    ShieldCheck,
    Sparkles,
    Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardCharts } from '../../components/dashboard/DashboardCharts';
import { StatCard } from '../../components/dashboard/StatCard';
import { MainLayout } from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/Button';
import { useDashboard } from '../../hooks/useDashboard';
import { WhatsAppSessionList } from '../whatsapp/WhatsAppSessionList';

export function DashboardPage() {
  const { data, isLoading } = useDashboard();

  return (
    <MainLayout title="Visão Geral">
      
      {/* --- HEADER ACTIONS --- */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Bem-vindo de volta! 👋</h2>
            <p className="text-sm text-slate-500">Aqui está o resumo da sua operação hoje.</p>
        </div>
        <div className="flex gap-3">
            <Link to="/calendar">
                <Button variant="secondary" size="sm">
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    Ver Agenda
                </Button>
            </Link>
            <Link to="/chat">
                <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Conversa
                </Button>
            </Link>
        </div>
      </div>

      {/* --- KPIS STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Clientes Ativos" 
          value={data?.stats?.customers} 
          icon={Users} 
          color="blue"
          loading={isLoading}
          to="/monitor"
        />
        <StatCard 
          label="Mensagens Trocadas" 
          value={data?.stats?.messages} 
          icon={MessageSquare} 
          color="purple"
          loading={isLoading}
          to="/monitor"
        />
        <StatCard 
          label="Agendamentos" 
          value={data?.stats?.appointments} 
          icon={CalendarCheck} 
          color="emerald"
          loading={isLoading}
          to="/calendar"
        />
        <StatCard 
          label="Usuários do Sistema" 
          value={data?.stats?.users} 
          icon={ShieldCheck} 
          color="amber"
          loading={isLoading}
          to="/settings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUNA PRINCIPAL --- */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* GRÁFICOS */}
            {!isLoading && data?.charts ? (
                <div className="animate-fade-in-up">
                    <DashboardCharts 
                        appointmentData={data.charts.appointments}
                        messageData={data.charts.messages} 
                    />
                </div>
            ) : (
                // Skeleton para Gráficos
                <div className="grid grid-cols-2 gap-6">
                    <div className="h-[300px] bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
                    <div className="h-[300px] bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
                </div>
            )}

            <WhatsAppSessionList />
        </div>

        {/* --- COLUNA LATERAL (Feed de Atividade) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-full min-h-[400px] flex flex-col sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-500" />
                Atividade Recente
              </h3>
            </div>

            <div className="space-y-6 relative flex-1">
              {/* Linha vertical do tempo */}
              <div className="absolute left-2.5 top-3 bottom-3 w-px bg-slate-100 dark:bg-slate-800"></div>

              {isLoading ? (
                // Skeleton Loading para a lista
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative pl-8 animate-pulse">
                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                ))
              ) : data?.recentActivity.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm italic">
                  Nenhuma atividade registrada ainda.
                </div>
              ) : (
                data?.recentActivity.map((item) => (
                  <div key={item.id} className="relative pl-8 pb-1 group cursor-default">
                    {/* Bolinha do Timeline */}
                    <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${item.color} z-10 transition-transform group-hover:scale-125`}></div>
                    
                    <div>
                        <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                        {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {item.description}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: ptBR })}
                        </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {!isLoading && data?.recentActivity.length > 0 && (
               <button className="w-full mt-6 py-2 text-xs text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium border-t border-slate-100 dark:border-slate-800 transition-colors flex items-center justify-center gap-1">
                 Ver histórico completo <ArrowRight className="w-3 h-3" />
               </button>
             )}
             
             {/* Link para o Wizard */}
             <div className="mt-4 px-6 pb-6">
                <Link to="/setup" className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-900/20 font-bold text-sm hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                  Assistente de Configuração
                </Link>
             </div>
           </div>
        </div>
      </div>
    </MainLayout>
  );
}