import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../lib/api';

export interface WhatsAppSession {
  id: string;
  sessionName: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'QRCODE' | 'STARTING';
  qrCode?: string;
  phoneNumber?: string;
  agent?: { name: string };
  battery?: number;
}

export function useSessions() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await api.get<WhatsAppSession[]>('/whatsapp/sessions');
      return data;
    },
    refetchInterval: (query) => {
        // Se alguma sessão estiver tentando conectar, faz polling mais rápido
        const hasConnecting = query.state.data?.some(s => s.status === 'QRCODE');
        return hasConnecting ? 2000 : 10000;
    }
  });

  const createSession = useMutation({
    mutationFn: async (name: string) => {
      await api.post('/whatsapp/sessions', { name });
    },
    onSuccess: () => {
      toast.success('Solicitação de sessão criada');
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: () => toast.error('Erro ao criar sessão')
  });

  const deleteSession = useMutation({
      mutationFn: async (id: string) => {
          await api.delete(`/whatsapp/sessions/${id}`);
      },
      onSuccess: () => {
          toast.success('Sessão removida');
          queryClient.invalidateQueries({ queryKey: ['sessions'] });
      },
      onError: () => toast.error('Erro ao excluir sessão')
  });

  const startSession = useMutation({
      mutationFn: async (id: string) => {
          await api.post(`/whatsapp/sessions/${id}/start`);
      },
      onSuccess: () => {
          toast.success('Iniciando sessão...');
          queryClient.invalidateQueries({ queryKey: ['sessions'] });
      },
      onError: () => toast.error('Erro ao iniciar sessão')
  });

  const stopSession = useMutation({
      mutationFn: async (id: string) => {
          await api.post(`/whatsapp/sessions/${id}/stop`);
      },
      onSuccess: () => {
          toast.success('Sessão parada');
          queryClient.invalidateQueries({ queryKey: ['sessions'] });
      },
      onError: () => toast.error('Erro ao parar sessão')
  });

  return {
    sessions: query.data || [],
    isLoading: query.isLoading,
    createSession,
    deleteSession,
    startSession,
    stopSession,
    refetch: query.refetch
  };
}
