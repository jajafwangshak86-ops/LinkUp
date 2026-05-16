import { useQuery } from '@tanstack/react-query';
import { stacksConfig } from '@/lib/stacks-config';

type TxStatus = 'pending' | 'success' | 'failed' | 'abort_by_response' | 'abort_by_post_condition';

export function useTransactionStatus(txId: string) {
  return useQuery({
    queryKey: ['tx-status', txId],
    queryFn: async (): Promise<TxStatus> => {
      const res = await fetch(`${stacksConfig.apiUrl}/extended/v1/tx/${txId}`);
      const data = await res.json();
      return data.tx_status as TxStatus;
    },
    enabled: !!txId,
    refetchInterval: (data) => (data === 'pending' ? 10_000 : false),
  });
}
