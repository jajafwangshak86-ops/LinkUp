import { useQuery } from '@tanstack/react-query';
import { getRemainingAllowance } from '@/services/stacks';
import { fromUstx } from '@/lib/stx';

export function useContractAllowance(address: string) {
  return useQuery({
    queryKey: ['contract-allowance', address],
    queryFn: async () => {
      const ustx = await getRemainingAllowance(address);
      return { ustx, stx: fromUstx(ustx) };
    },
    enabled: !!address,
    refetchInterval: 60_000,
  });
}
