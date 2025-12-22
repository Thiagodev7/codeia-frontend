import { MainLayout } from '../../components/layout/MainLayout';
import { WhatsAppSessionList } from '../whatsapp/WhatsAppSessionList';
import { Users, MessageSquare, CalendarCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

// Definindo a interface para garantir a tipagem correta
interface DashboardStats {
  users: number;
  customers: number; // <--- Adicionado aqui
  messages: number;
  appointments: number;
}

export function DashboardPage() {
  // Inicializando com todos os campos necessários
  const [stats, setStats] = useState<DashboardStats>({ 
    users: 0, 
    customers: 0, 
    messages: 0, 
    appointments: 0 
  });

  useEffect(() => {
    api.get('/tenant/me').then(res => {
      // O backend retorna { users, customers, messages, appointments } dentro de _count
      setStats(res.data._count);
    }).catch(console.error);
  }, []);

  return (
    <MainLayout title="Visão Geral">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card de Clientes */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-sm block">Clientes</span>
            {/* Agora o TypeScript sabe que customers existe */}
            <span className="text-2xl font-bold text-slate-100">{stats.customers}</span>
          </div>
        </div>

        {/* Card de Mensagens */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-sm block">Mensagens</span>
            <span className="text-2xl font-bold text-slate-100">{stats.messages}</span>
          </div>
        </div>

        {/* Card de Agendamentos */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-sm block">Agendamentos</span>
            <span className="text-2xl font-bold text-slate-100">{stats.appointments}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WhatsAppSessionList />
        </div>

        <div className="lg:col-span-1 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 min-h-[300px]">
          <h3 className="text-slate-300 font-medium mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <div className="text-sm text-slate-500 italic">Nenhuma atividade recente.</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}