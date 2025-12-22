import { MainLayout } from '../../components/layout/MainLayout';
import { WhatsAppSessionList } from '../whatsapp/WhatsAppSessionList'; // <--- Importar o novo componente
import { Users, MessageSquare, CalendarCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, messages: 0, appointments: 0 });

  useEffect(() => {
    // Busca estatísticas gerais (ainda válidas)
    api.get('/tenant/me').then(res => {
      setStats(res.data._count);
    }).catch(console.error);
  }, []);

  return (
    <MainLayout title="Visão Geral">
      {/* Cards de Estatísticas (Mantidos) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-sm block">Clientes</span>
            <span className="text-2xl font-bold text-slate-100">{stats.customers || stats.users}</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-sm block">Mensagens</span>
            <span className="text-2xl font-bold text-slate-100">{stats.messages}</span>
          </div>
        </div>

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
        {/* Lista de Sessões (Agora ocupa 2 colunas para caber mais cards) */}
        <div className="lg:col-span-2">
          <WhatsAppSessionList />
        </div>

        {/* Painel Lateral (Placeholder para Futuros Avisos ou Logs Recentes) */}
        <div className="lg:col-span-1 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 min-h-[300px]">
          <h3 className="text-slate-300 font-medium mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <div className="text-sm text-slate-500 italic">Nenhuma atividade recente.</div>
            {/* Aqui você pode listar as últimas mensagens ou agendamentos */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}