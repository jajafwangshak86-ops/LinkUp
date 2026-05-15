import { useQuery } from '@tanstack/react-query';
import { stacksConfig } from '@/lib/stacks-config';
import { fromUstx } from '@/lib/stx';

export function useStxBalance(address: string) {
  return useQuery({
    queryKey: ['stx-balance', address],
    queryFn: async () => {
      const res = await fetch(`${stacksConfig.apiUrl}/v2/accounts/${address}`);
      const data = await res.json();
      const ustx = BigInt(data.balance ?? '0');
      return { ustx, stx: fromUstx(ustx) };
    },
    enabled: !!address,
    refetchInterval: 30_000,
  });
}
