/**
 * useOnChainPosts — interact with the linkup-posts Clarity contract.
 *
 * Posts are created on-chain (content hash + Gaia URL).
 * Full content is fetched from Gaia. MongoDB caches for fast feed queries.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { createHash } from 'crypto';
import {
  createPostOnChain,
  likePostOnChain,
  tipPostOnChain,
  getPostFromChain,
  hasLiked,
} from '@/services/onchain-posts';
import { writeGaiaPost, fetchGaiaPost } from '@/services/gaia-posts';
import { toUstx } from '@/lib/stx';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';

// ─── Create post ──────────────────────────────────────────────────────────────

export function useCreateOnChainPost() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      images = [],
      senderKey,
      gaiaToken,
    }: {
      content: string;
      images?: string[];
      senderKey: string;
      gaiaToken: string;
    }) => {
      const address = (user as User).walletAddress;
      const postJson = JSON.stringify({ content, images, author: address, createdAt: Date.now() });

      // 1. Write full content to Gaia (instant)
      const gaiaUrl = await writeGaiaPost(address, gaiaToken, postJson);

      // 2. Register content hash + Gaia URL on-chain
      const txId = await createPostOnChain(senderKey, postJson, gaiaUrl);

      return { txId, gaiaUrl };
    },
    onSuccess: ({ txId }) => {
      queryClient.invalidateQueries({ queryKey: ['onchain-feed'] });
      toast.success(`Post submitted! TX: ${txId.slice(0, 10)}…`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

// ─── Like post ────────────────────────────────────────────────────────────────

export function useLikeOnChainPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, senderKey }: { postId: number; senderKey: string }) => {
      return likePostOnChain(senderKey, postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onchain-feed'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

// ─── Tip post ─────────────────────────────────────────────────────────────────

export function useTipOnChainPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      amountStx,
      senderKey,
    }: {
      postId: number;
      amountStx: number;
      senderKey: string;
    }) => {
      return tipPostOnChain(senderKey, postId, toUstx(amountStx));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onchain-feed'] });
      toast.success('Tip sent on-chain!');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

// ─── Read a single post (chain metadata + Gaia content) ──────────────────────

export function useOnChainPost(postId: number, callerAddress: string) {
  return useQuery({
    queryKey: ['onchain-post', postId],
    queryFn: async () => {
      const meta = await getPostFromChain(postId, callerAddress);
      if (!meta) return null;
      const content = await fetchGaiaPost(meta.value['gaia-url'].value as string);
      return { ...meta.value, content };
    },
    enabled: !!postId && !!callerAddress,
  });
}
