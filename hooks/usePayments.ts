import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner-native';
import { router } from 'expo-router';

export function usePayments() {
  const queryClient = useQueryClient();

  // Send payment
  const sendPaymentMutation = useMutation({
    mutationFn: async ({ recipient, amount, memo }: { recipient: string; amount: number; memo?: string }) => {
      const response = await api.sendPayment(recipient, amount, memo);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment sent!');
      router.push('/payment-success');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Request payment
  const requestPaymentMutation = useMutation({
    mutationFn: async ({ fromUsername, amount, memo }: { fromUsername: string; amount: number; memo?: string }) => {
      const response = await api.requestPayment(fromUsername, amount, memo);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Payment request sent!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    sendPayment: sendPaymentMutation.mutate,
    isSendingPayment: sendPaymentMutation.isPending,
    requestPayment: requestPaymentMutation.mutate,
    isRequestingPayment: requestPaymentMutation.isPending,
  };
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: ['payments', 'history'],
    queryFn: async () => {
      const response = await api.getPaymentHistory();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });
}

export function usePaymentQR(amount?: number) {
  return useQuery({
    queryKey: ['payments', 'qr', amount],
    queryFn: async () => {
      const response = await api.generatePaymentQR(amount);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });
}
