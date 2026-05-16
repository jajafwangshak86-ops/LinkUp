import { useQuery } from '@tanstack/react-query';
import { fetchChatIndex } from '@/services/gaia-chat';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';

export function useChatCount() {
  const { user } = useAuth();
  const address = (user as User)?.walletAddress ?? '';

  return useQuery({
    queryKey: ['chat-count', address],
    queryFn: async () => {
      const index = await fetchChatIndex(address);
      const unread = index.filter(c => c.unread > 0).length;
      return { total: index.length, unread };
    },
    enabled: !!address,
    refetchInterval: 30_000,
  });
}
