import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
// Definir tipos locais se não existirem no global types ainda, ou importar
interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  customerPhone: string;
  customerName?: string;
  status: 'OPEN' | 'CLOSED';
  lastMessage?: string;
  updatedAt: string;
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get<Conversation[]>('/conversations');
      return data;
    }
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data } = await api.get<Message[]>(`/conversations/${conversationId}/messages`);
      return data;
    },
    enabled: !!conversationId, // Só busca se tiver ID selecionado
    refetchInterval: 5000, // Polling a cada 5s para chat em tempo real (simples)
  });
}
