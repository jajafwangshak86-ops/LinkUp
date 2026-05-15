import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner-native';

export function useComments(postId: string) {
  const queryClient = useQueryClient();

  // Get comments
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getComments(postId, pageParam, 20);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    getNextPageParam: (lastPage: any, pages) => {
      return lastPage && Array.isArray(lastPage) && lastPage.length === 20 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!postId,
  });

  // Create comment
  const createCommentMutation = useMutation({
    mutationFn: async ({ content, parentCommentId }: { content: string; parentCommentId?: string }) => {
      const response = await api.createComment(postId, content, parentCommentId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
      toast.success('Comment added!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Like comment
  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      console.log('[Like Comment] Sending request for:', commentId);
      const response = await api.likeComment(commentId);
      if (response.error) throw new Error(response.error);
      console.log('[Like Comment] Success:', response.data);
      return response.data;
    },
    onMutate: async (commentId) => {
      console.log('[Like Comment] Optimistic update for:', commentId);
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      // Snapshot previous value
      const previousComments = queryClient.getQueryData(['comments', postId]);

      // Optimistically update
      queryClient.setQueryData(['comments', postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any[]) =>
            page.map((comment: any) =>
              comment.id === commentId
                ? { ...comment, isLiked: true, likesCount: comment.likesCount + 1 }
                : comment
            )
          ),
        };
      });

      return { previousComments };
    },
    onError: (error: Error, commentId, context: any) => {
      console.error('[Like Comment] Error:', error);
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments);
      }
      toast.error(`Failed to like comment: ${error.message}`);
    },
    onSettled: () => {
      console.log('[Like Comment] Refetching comments');
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  // Unlike comment
  const unlikeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      console.log('[Unlike Comment] Sending request for:', commentId);
      const response = await api.unlikeComment(commentId);
      if (response.error) throw new Error(response.error);
      console.log('[Unlike Comment] Success:', response.data);
      return response.data;
    },
    onMutate: async (commentId) => {
      console.log('[Unlike Comment] Optimistic update for:', commentId);
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      // Snapshot previous value
      const previousComments = queryClient.getQueryData(['comments', postId]);

      // Optimistically update
      queryClient.setQueryData(['comments', postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any[]) =>
            page.map((comment: any) =>
              comment.id === commentId
                ? { ...comment, isLiked: false, likesCount: Math.max(0, comment.likesCount - 1) }
                : comment
            )
          ),
        };
      });

      return { previousComments };
    },
    onError: (error: Error, commentId, context: any) => {
      console.error('[Unlike Comment] Error:', error);
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments);
      }
      toast.error(`Failed to unlike comment: ${error.message}`);
    },
    onSettled: () => {
      console.log('[Unlike Comment] Refetching comments');
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const comments = data?.pages.flat() || [];

  return {
    comments,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createComment: createCommentMutation.mutate,
    isCreatingComment: createCommentMutation.isPending,
    likeComment: likeCommentMutation.mutate,
    unlikeComment: unlikeCommentMutation.mutate,
  };
}

export function useReplies(commentId: string) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ['replies', commentId],
    queryFn: async () => {
      const response = await api.getCommentReplies(commentId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    enabled: !!commentId,
  });

  // Like reply
  const likeReplyMutation = useMutation({
    mutationFn: async (replyId: string) => {
      console.log('[Like Reply] Sending request for:', replyId);
      const response = await api.likeComment(replyId);
      if (response.error) throw new Error(response.error);
      console.log('[Like Reply] Success:', response.data);
      return response.data;
    },
    onMutate: async (replyId) => {
      console.log('[Like Reply] Optimistic update for:', replyId);
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['replies', commentId] });

      // Snapshot previous value
      const previousReplies = queryClient.getQueryData(['replies', commentId]);

      // Optimistically update
      queryClient.setQueryData(['replies', commentId], (old: any) => {
        if (!old || !Array.isArray(old)) return old;
        return old.map((reply: any) =>
          reply.id === replyId
            ? { ...reply, isLiked: true, likesCount: reply.likesCount + 1 }
            : reply
        );
      });

      return { previousReplies };
    },
    onError: (error: Error, replyId, context: any) => {
      console.error('[Like Reply] Error:', error);
      // Rollback on error
      if (context?.previousReplies) {
        queryClient.setQueryData(['replies', commentId], context.previousReplies);
      }
      toast.error(`Failed to like reply: ${error.message}`);
    },
    onSettled: () => {
      console.log('[Like Reply] Refetching replies');
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['replies', commentId] });
    },
  });

  // Unlike reply
  const unlikeReplyMutation = useMutation({
    mutationFn: async (replyId: string) => {
      console.log('[Unlike Reply] Sending request for:', replyId);
      const response = await api.unlikeComment(replyId);
      if (response.error) throw new Error(response.error);
      console.log('[Unlike Reply] Success:', response.data);
      return response.data;
    },
    onMutate: async (replyId) => {
      console.log('[Unlike Reply] Optimistic update for:', replyId);
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['replies', commentId] });

      // Snapshot previous value
      const previousReplies = queryClient.getQueryData(['replies', commentId]);

      // Optimistically update
      queryClient.setQueryData(['replies', commentId], (old: any) => {
        if (!old || !Array.isArray(old)) return old;
        return old.map((reply: any) =>
          reply.id === replyId
            ? { ...reply, isLiked: false, likesCount: Math.max(0, reply.likesCount - 1) }
            : reply
        );
      });

      return { previousReplies };
    },
    onError: (error: Error, replyId, context: any) => {
      console.error('[Unlike Reply] Error:', error);
      // Rollback on error
      if (context?.previousReplies) {
        queryClient.setQueryData(['replies', commentId], context.previousReplies);
      }
      toast.error(`Failed to unlike reply: ${error.message}`);
    },
    onSettled: () => {
      console.log('[Unlike Reply] Refetching replies');
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['replies', commentId] });
    },
  });

  return {
    replies: data || [],
    isLoading,
    likeReply: likeReplyMutation.mutate,
    unlikeReply: unlikeReplyMutation.mutate,
  };
}
