import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Appointment, Customer, PaginatedResponse } from '../types';

interface DashboardStats {
  users: number;
  customers: number;
  messages: number;
  appointments: number;
}

interface ChartData {
  name: string;
  value: number;
}

export function useDashboard() {
  const query = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      // 1. Buscamos todas as informações em paralelo
      const [statsRes, conversationsRes, appointmentsRes] = await Promise.all([
        api.get('/tenant/me'),
        api.get<PaginatedResponse<Customer>>('/crm/conversations'),
        api.get<PaginatedResponse<Appointment>>('/appointments') 
      ]);

      const stats = statsRes.data._count as DashboardStats;
      const conversations = conversationsRes.data.data || [];
      const appointments = appointmentsRes.data.data || [];

      // 2. Processa Atividade Recente (Feed Real)
      const recentActivity = [
        ...conversations.slice(0, 5).map(c => ({
            id: c.id,
            type: 'conversation' as const,
            title: c.name || c.phone,
            description: c.lastMessage || 'Nova conversa iniciada',
            timestamp: c.updatedAt || new Date().toISOString(),
            color: 'bg-blue-500'
        })),
        ...appointments.slice(0, 5).map(a => ({
            id: a.id,
            type: 'appointment' as const,
            title: 'Agendamento: ' + a.title,
            description: `Cliente: ${a.customer?.name || 'Desconhecido'}`,
            timestamp: a.startTime,
            color: 'bg-emerald-500'
        }))
      ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6);

      // 3. Prepara Dados para Gráficos
      // IMPORTANTE: Não usar dados falsos. Se a API não entregar histórico, mostrar vazio.
      // Futuramente: Implementar endpoints de analytics no backend (/analytics/appointments, /analytics/messages)
      
      const appointmentChartData: ChartData[] = [];
      const messageChartData: ChartData[] = [];

      return {
        stats,
        recentActivity,
        charts: {
          appointments: appointmentChartData,
          messages: messageChartData
        }
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch
  };
}
