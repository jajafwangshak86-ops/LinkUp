/**
 * useGaiaChat — fast decentralized chat via Gaia.
 *
 * Messages are read/written directly to the user's Gaia hub (plain HTTPS).
 * No block wait, no fees. Pusher still used for real-time "new message" signals.
 * MongoDB caches the last message preview for the chat list.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner-native';
import { v4 as uuid } from 'uuid';
import {
  fetchMessages,
  fetchChatIndex,
  appendMessage,
  updateChatIndex,
  type GaiaMessage,
} from '@/services/gaia-chat';
import { useAuth } from '@/hooks/useAuth';
import pusher from '@/lib/pusher';
import type { User } from '@/types';

// ─── Chat list (index) ────────────────────────────────────────────────────────

export function useGaiaChats() {
  const { user } = useAuth();
  const address = (user as User)?.walletAddress ?? '';

  return useQuery({
    queryKey: ['gaia-chats', address],
    queryFn: () => fetchChatIndex(address),
    enabled: !!address,
    staleTime: 10_000,
  });
}

// ─── Messages for a single chat ───────────────────────────────────────────────

export function useGaiaMessages(chatId: string, otherAddress: string) {
  const { user } = useAuth();
  const myAddress = (user as User)?.walletAddress ?? '';
  const queryClient = useQueryClient();
  const queryKey = ['gaia-messages', chatId, myAddress];

  // Fetch messages from both sides and merge (each user writes their own)
  const { data: messages = [], isLoading, refetch } = useQuery<GaiaMessage[]>({
    queryKey,
    queryFn: async () => {
      const [mine, theirs] = await Promise.all([
        fetchMessages(myAddress, chatId),
        fetchMessages(otherAddress, chatId),
      ]);
      // Merge and sort by timestamp
      const merged = [...mine, ...theirs];
      const seen = new Set<string>();
      return merged
        .filter(m => { if (seen.has(m.id)) return false; seen.add(m.id); return true; })
        .sort((a, b) => a.createdAt - b.createdAt);
    },
    enabled: !!myAddress && !!otherAddress && !!chatId,
    staleTime: 0,
  });

  // Real-time: Pusher signals a new message → refetch from Gaia
  useEffect(() => {
    if (!chatId) return;
    const channel = pusher.subscribe(`chat-${chatId}`);
    channel.bind('new-message', () => {
      queryClient.invalidateQueries({ queryKey });
    });
    return () => {
      channel.unbind('new-message');
      pusher.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId]);

  return { messages, isLoading, refetch };
}

// ─── Send message ─────────────────────────────────────────────────────────────

export function useSendGaiaMessage(chatId: string, otherAddress: string) {
  const { user } = useAuth();
  const myAddress = (user as User)?.walletAddress ?? '';
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      gaiaToken,
      type = 'text',
      paymentTxId,
      paymentAmount,
    }: {
      content: string;
      gaiaToken: string;
      type?: 'text' | 'payment';
      paymentTxId?: string;
      paymentAmount?: number;
    }) => {
      const message: GaiaMessage = {
        id: uuid(),
        chatId,
        senderAddress: myAddress,
        content,
        type,
        paymentTxId,
        paymentAmount,
        createdAt: Date.now(),
      };

      // Write to my Gaia hub
      await appendMessage(myAddress, gaiaToken, chatId, message);

      // Update my chat index
      await updateChatIndex(myAddress, gaiaToken, {
        chatId,
        participantAddress: otherAddress,
        lastMessage: type === 'payment' ? `Sent ${paymentAmount} uSTX` : content,
        lastMessageAt: message.createdAt,
        unread: 0,
      });

      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gaia-messages', chatId, myAddress] });
      queryClient.invalidateQueries({ queryKey: ['gaia-chats', myAddress] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
