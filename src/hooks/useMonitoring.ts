import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
// Definir tipos locais se não existirem no global types ainda, ou importar
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  name: string | null;
  phone: string;
  status: 'OPEN' | 'CLOSED';
  lastMessage?: string;
  updatedAt: string;
}


interface PaginatedResponse<T> {
  data: T[];
  meta: any;
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      // ✅ API v2.0: Usando /crm/conversations e pegando data.data
      const { data } = await api.get<PaginatedResponse<Conversation>>('/crm/conversations?limit=100');
      return data.data;
    }
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data } = await api.get<PaginatedResponse<Message>>(`/crm/conversations/${conversationId}/messages?limit=100`);
      return data.data;
    },
    enabled: !!conversationId, // Só busca se tiver ID selecionado
    refetchInterval: 5000, // Polling a cada 5s para chat em tempo real (simples)
  });
}
