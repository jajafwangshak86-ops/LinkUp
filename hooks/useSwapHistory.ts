import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface SwapHistoryItem {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  priceImpact: number;
  signature: string;
  status: string;
  createdAt: string;
}

interface SwapHistoryResponse {
  swaps: SwapHistoryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export function useSwapHistory() {
  return useInfiniteQuery({
    queryKey: ['swap-history'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getSwapHistory(pageParam, 20);
      return response as SwapHistoryResponse;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
