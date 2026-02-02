import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../lib/api';
import type { Appointment, PaginatedResponse } from '../types';

interface UseAppointmentsOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useAppointments({ page = 1, limit = 10, enabled = true }: UseAppointmentsOptions = {}) {
  const queryClient = useQueryClient();

  const queryKey = ['appointments', { page, limit }];

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Appointment>>('/appointments', {
        params: { page, limit }
      });
      return data;
    },
    // Mantém os dados anteriores enquanto busca os novos (melhor UX para paginação)
    placeholderData: (previousData) => previousData,
    enabled
  });

  // Mutation para Cancelar Agendamento
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      toast.success('Agendamento cancelado com sucesso');
      // Invalida a query para forçar recarregamento
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: () => {
      toast.error('Erro ao cancelar agendamento');
    }
  });

  return {
    appointments: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError,
    error,
    isPlaceholderData,
    cancelAppointment: cancelMutation.mutateAsync,
    isCanceling: cancelMutation.isPending
  };
}
