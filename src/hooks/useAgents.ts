import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../lib/api';
import type { Agent } from '../types/agent';

export function useAgents() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data } = await api.get<Agent[]>('/agents');
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos, agentes mudam pouco
  });

  const saveAgent = useMutation({
    mutationFn: async (agent: Partial<Agent>) => {
      // Se tiver ID, é update. Senão, create.
      if (agent.id) {
        const { data } = await api.put(`/agents/${agent.id}`, agent);
        return data;
      } else {
        const { data } = await api.post<Agent>('/agents', agent);
        return data;
      }
    },
    onSuccess: () => {
      toast.success('Agente salvo com sucesso');
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: () => toast.error('Erro ao salvar agente')
  });

  const deleteAgent = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/agents/${id}`);
    },
    onSuccess: () => {
      toast.success('Agente removido');
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
    onError: () => toast.error('Erro ao remover agente')
  });

  const toggleAgentStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
        await api.put(`/agents/${id}`, { isActive });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
    onError: () => toast.error('Erro ao atualizar status')
  });

  return {
    agents: query.data || [],
    isLoading: query.isLoading,
    saveAgent,
    deleteAgent,
    toggleAgentStatus
  };
}
