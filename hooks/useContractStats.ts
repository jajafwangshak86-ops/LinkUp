import { useQuery } from '@tanstack/react-query';
import { stacksConfig } from '@/lib/stacks-config';

const DEPLOYER = 'SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7';

export function useContractStats() {
  return useQuery({
    queryKey: ['contract-stats'],
    queryFn: async () => {
      const res = await fetch(
        `${stacksConfig.apiUrl}/v2/contracts/call-read/${DEPLOYER}/linkup-factory/get-stats`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sender: DEPLOYER, arguments: [] }),
        }
      );
      const data = await res.json();
      return data;
    },
    refetchInterval: 120_000,
    staleTime: 60_000,
  });
}
