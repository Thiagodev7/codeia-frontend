import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita refetch excessivo ao trocar de aba
      staleTime: 1000 * 60, // Dados considerados "frescos" por 1 minuto
      retry: 1, // Tenta novamente apenas 1 vez em caso de erro
    },
  },
});
