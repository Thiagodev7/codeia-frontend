import { MainLayout } from '../../components/layout/MainLayout';
import { WhatsAppSessionList } from '../whatsapp/WhatsAppSessionList';
import { Users, MessageSquare, CalendarCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface DashboardStats {
  users: number;
  customers: number;
  messages: number;
  appointments: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ 
    users: 0, customers: 0, messages: 0, appointments: 0 
  });

  useEffect(() => {
    api.get('/tenant/me').then(res => setStats(res.data._count)).catch(console.error);
  }, []);

  // Componente Auxiliar para Cards de Estatística (Evita repetição e facilita o tema)
  const StatCard = ({ icon: Icon, colorClass, bgClass, label, value }: any) => (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md dark:hover:shadow-none">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <span className="text-slate-500 dark:text-slate-400 text-sm block">{label}</span>
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</span>
      </div>
    </div>
  );

  return (
    <MainLayout title="Visão Geral">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={Users} 
          label="Clientes" 
          value={stats.customers} 
          colorClass="text-blue-600 dark:text-blue-500" 
          bgClass="bg-blue-50 dark:bg-blue-500/10"
        />
        <StatCard 
          icon={MessageSquare} 
          label="Mensagens" 
          value={stats.messages} 
          colorClass="text-purple-600 dark:text-purple-500" 
          bgClass="bg-purple-50 dark:bg-purple-500/10"
        />
        <StatCard 
          icon={CalendarCheck} 
          label="Agendamentos" 
          value={stats.appointments} 
          colorClass="text-emerald-600 dark:text-emerald-500" 
          bgClass="bg-emerald-50 dark:bg-emerald-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WhatsAppSessionList />
        </div>

        <div className="lg:col-span-1 bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 min-h-[300px] transition-colors">
          <h3 className="text-slate-800 dark:text-slate-300 font-medium mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <div className="text-sm text-slate-400 dark:text-slate-500 italic">Nenhuma atividade recente.</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}