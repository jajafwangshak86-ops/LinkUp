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
      console.log("Comments", response.data)
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
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

  const comments = data?.pages.flat() || [];

  return {
    comments,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createComment: createCommentMutation.mutate,
    isCreatingComment: createCommentMutation.isPending,
  };
}

export function useReplies(commentId: string) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['replies', commentId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getReplies(commentId, pageParam, 10);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage && Array.isArray(lastPage) && lastPage.length === 10 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!commentId,
  });

  const replies = data?.pages.flat() || [];

  return {
    replies,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
