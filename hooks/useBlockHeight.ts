import { useQuery } from '@tanstack/react-query';
import { stacksConfig } from '@/lib/stacks-config';

export function useBlockHeight() {
  return useQuery({
    queryKey: ['block-height'],
    queryFn: async () => {
      const res = await fetch(`${stacksConfig.apiUrl}/v2/info`);
      const data = await res.json();
      return data.stacks_tip_height as number;
    },
    refetchInterval: 60_000,
  });
}
