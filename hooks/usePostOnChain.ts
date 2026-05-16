import { useQuery } from '@tanstack/react-query';
import { stacksConfig } from '@/lib/stacks-config';

const DEPLOYER = 'SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7';

export function usePostOnChain(postId: number) {
  return useQuery({
    queryKey: ['post-onchain', postId],
    queryFn: async () => {
      const res = await fetch(
        `${stacksConfig.apiUrl}/v2/contracts/call-read/${DEPLOYER}/linkup-posts/get-post`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: DEPLOYER,
            arguments: [`0x${postId.toString(16).padStart(32, '0')}`],
          }),
        }
      );
      return res.json();
    },
    enabled: !!postId,
    staleTime: 30_000,
  });
}
