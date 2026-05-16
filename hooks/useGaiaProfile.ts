import { useQuery } from '@tanstack/react-query';

const GAIA_HUB = 'https://hub.hiro.so';

export function useGaiaProfile(address: string) {
  return useQuery({
    queryKey: ['gaia-profile', address],
    queryFn: async () => {
      const url = `${GAIA_HUB}/read/${address}/linkup/profile.json`;
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Gaia fetch failed: ${res.status}`);
      return res.json();
    },
    enabled: !!address,
    staleTime: 60_000,
  });
}
