import { useQuery } from '@tanstack/react-query';

export function useStxPrice() {
  return useQuery({
    queryKey: ['stx-price'],
    queryFn: async () => {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd&include_24hr_change=true'
      );
      const d = await res.json();
      return {
        usd: d.blockstack?.usd ?? 0,
        change24h: d.blockstack?.usd_24h_change ?? 0,
      };
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}
