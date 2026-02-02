import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../lib/api';
import { useAppointments } from './useAppointments';

// Mock da API
vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
    delete: vi.fn()
  }
}));

// Wrapper para QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAppointments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches appointments successfully', async () => {
    const mockData = {
      data: {
        data: [{ id: '1', title: 'Test Appointment' }],
        meta: { page: 1, total: 1 }
      }
    };
    (api.get as any).mockResolvedValue(mockData);

    const { result } = renderHook(() => useAppointments(), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.appointments).toEqual(mockData.data.data);
    expect(result.current.meta).toEqual(mockData.data.meta);
    expect(api.get).toHaveBeenCalledWith('/appointments', { params: { page: 1, limit: 10 } });
  });

  it('handles cancellation successfully', async () => {
    const mockData = { data: { data: [], meta: {} } };
    (api.get as any).mockResolvedValue(mockData);
    (api.delete as any).mockResolvedValue({});

    const { result } = renderHook(() => useAppointments(), {
      wrapper: createWrapper()
    });

    await result.current.cancelAppointment('123');

    expect(api.delete).toHaveBeenCalledWith('/appointments/123');
  });
});
