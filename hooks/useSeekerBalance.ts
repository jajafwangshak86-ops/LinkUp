import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useSeekerBalance() {
  return useQuery({
    queryKey: ['seeker-balance'],
    queryFn: async () => {
      const response = await api.getSeekerBalance();
      return response.balance || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000,
  });
}
