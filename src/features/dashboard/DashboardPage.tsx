import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    ArrowRight,
    CalendarCheck,
    Clock,
    MessageSquare,
    ShieldCheck,
    Sparkles,
    Users,
    type LucideIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { api } from '../../lib/api';
import { WhatsAppSessionList } from '../whatsapp/WhatsAppSessionList';
// Tipos centralizados (API v2.0)
import { toast } from 'sonner';
import type { Appointment, Customer, PaginatedResponse } from '../../types';

// --- Interfaces Locais ---

interface DashboardStats {
  users: number;
  customers: number;
  messages: number;
  appointments: number;
}

// Tipo unificado para o Feed
interface ActivityItem {
  id: string;
  type: 'appointment' | 'conversation';
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Buscamos todas as informações em paralelo para ser rápido
        const [statsRes, conversationsRes, appointmentsRes] = await Promise.all([
          api.get('/tenant/me'),
          api.get<PaginatedResponse<Customer>>('/crm/conversations'),
          api.get<PaginatedResponse<Appointment>>('/appointments') 
        ]);

        // 2. Setamos os contadores
        setStats(statsRes.data._count);

        // 3. Processamos o Feed de Atividade
        // ✅ API v2.0: dados agora vêm em response.data.data
        const conversations = conversationsRes.data.data || [];
        const recentConversations = conversations
          .slice(0, 5)
          .map((c) => ({
            id: c.id,
            type: 'conversation' as const,
            title: c.name || c.phone,
            description: c.lastMessage || 'Iniciou uma conversa',
            timestamp: c.updatedAt || new Date().toISOString(),
            color: 'bg-blue-500'
          }));

        // ✅ API v2.0: dados agora vêm em response.data.data
        const appointments = appointmentsRes.data.data || [];
        const recentAppointments = appointments
          .slice(0, 5)
          .map((a) => ({
            id: a.id,
            type: 'appointment' as const,
            title: 'Agendamento: ' + a.title,
            description: `Cliente: ${a.customer?.name || 'Desconhecido'}`,
            timestamp: a.startTime,
            color: 'bg-emerald-500'
          }));

        // Junta tudo, ordena por data (mais recente primeiro) e pega os top 6
        const mixedActivity = [...recentConversations, ...recentAppointments]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 6);

        setActivities(mixedActivity as ActivityItem[]);

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <MainLayout title="Visão Geral">
      {/* --- KPIS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Clientes Ativos" 
          value={stats?.customers} 
          icon={Users} 
          color="blue"
          loading={isLoading}
          to="/monitor"
        />
        <StatCard 
          label="Mensagens Trocadas" 
          value={stats?.messages} 
          icon={MessageSquare} 
          color="purple"
          loading={isLoading}
          to="/monitor"
        />
        <StatCard 
          label="Agendamentos" 
          value={stats?.appointments} 
          icon={CalendarCheck} 
          color="emerald"
          loading={isLoading}
          to="/calendar"
        />
        <StatCard 
          label="Usuários do Sistema" 
          value={stats?.users} 
          icon={ShieldCheck} 
          color="amber"
          loading={isLoading}
          to="/settings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUNA PRINCIPAL (Sessões & Gráficos Futuros) --- */}
        <div className="lg:col-span-2 space-y-8">
          <WhatsAppSessionList />
        </div>

        {/* --- COLUNA LATERAL (Feed de Atividade Real) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-full min-h-[400px] flex flex-col">
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
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm italic">
                  Nenhuma atividade registrada ainda.
                </div>
              ) : (
                activities.map((item) => (
                  <ActivityListItem key={`${item.type}-${item.id}`} item={item} />
                ))
              )}
            </div>
            
            {!isLoading && activities.length > 0 && (
               <button className="w-full mt-6 py-2 text-xs text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium border-t border-slate-100 dark:border-slate-800 transition-colors flex items-center justify-center gap-1">
                 Ver histórico completo <ArrowRight className="w-3 h-3" />
               </button>
             )}
             
             {/* Link para o Wizard (Temporário ou Permanente) */}
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

// --- SUB-COMPONENTES (Visual & UI) ---

// --- SUB-COMPONENTES (Visual & UI) ---
import { Link } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'emerald' | 'amber';
  loading: boolean;
  to: string; // Adicionado link
}

function StatCard({ label, value, icon: Icon, color, loading, to }: StatCardProps) {
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
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
          {value !== undefined ? value : '-'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
      </div>
    </Link>
  );
}

function ActivityListItem({ item }: { item: ActivityItem }) {
  return (
    <div className="relative pl-8 pb-1 group">
      {/* Bolinha do Timeline */}
      <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${item.color} z-10`}></div>
      
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
  );
}