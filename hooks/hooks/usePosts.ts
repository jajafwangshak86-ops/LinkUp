import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner-native';
import type { Post } from '@/types';

export function usePosts() {
  const queryClient = useQueryClient();

  // Get feed with infinite scroll
  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingFeed,
    refetch: refetchFeed,
  } = useInfiniteQuery<Post[]>({
    queryKey: ['posts', 'feed'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getFeed(pageParam as number, 20);
      if (response.error) throw new Error(response.error);
      const data = response.data as Post[];
      console.log(data[0]);
      return data || [];
    },
    getNextPageParam: (lastPage, pages) => {
      return Array.isArray(lastPage) && lastPage.length === 20 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1 as number,
  });

  // Create post
  const createPostMutation = useMutation({
    mutationFn: async (data: { 
      content: string; 
      images?: string[];
      isTokenized?: boolean;
      tokenSupply?: number;
      tokenPrice?: number;
    }) => {
      const response = await api.createPost(data);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
      toast.success('Post created!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Like post
  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.likePost(postId);
      if (response.error) throw new Error(response.error);
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Unlike post
  const unlikePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.unlikePost(postId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete post
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.deletePost(postId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Buy post token
  const buyTokenMutation = useMutation({
    mutationFn: async ({ postId, amount }: { postId: string; amount: number }) => {
      const response = await api.buyPostToken(postId, amount);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Tokens purchased!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Tip post
  const tipPostMutation = useMutation({
    mutationFn: async ({ postId, amount, message }: { postId: string; amount: number; message?: string }) => {
      const response = await api.tipPost(postId, amount, message);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Tip sent!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const posts = feedData?.pages.flat() || [];

  return {
    posts,

    isLoadingFeed,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetchFeed,
    createPost: createPostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,
    likePost: likePostMutation.mutate,
    unlikePost: unlikePostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    buyToken: buyTokenMutation.mutate,
    isBuyingToken: buyTokenMutation.isPending,
    tipPost: tipPostMutation.mutate,
    isTippingPost: tipPostMutation.isPending,
  };
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: async () => {
      const response = await api.getPost(postId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    enabled: !!postId,
  });
}

export function useUserPosts(username: string, enabled: boolean = true) {
  console.log('[useUserPosts] Hook called with username:', username, 'enabled:', enabled, 'condition:', !!username && enabled);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<Post[]>({
    queryKey: ['posts', 'user', username],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('[useUserPosts] Fetching posts for username:', username, 'page:', pageParam);
      const response = await api.getUserPosts(username, pageParam as number, 20);
      console.log('[useUserPosts] Response:', response);
      if (response.error) {
        console.error('[useUserPosts] Error:', response.error);
        throw new Error(response.error);
      }
      console.log('[useUserPosts] Posts data:', response.data);
      return response.data as Post[];
    },
    getNextPageParam: (lastPage, pages) => {
      return Array.isArray(lastPage) && lastPage.length === 20 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1 as number,
    enabled: !!username && enabled,
    staleTime: 0, // Always refetch
  });

  const posts = data?.pages.flat() || [];
  console.log('[useUserPosts] isLoading:', isLoading, 'data:', data, 'Final posts array:', posts.length, 'posts');

  return {
    posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}

export function useUserComments(username: string, enabled: boolean = true) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['user-comments', username],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getUserComments(username, pageParam as number, 20);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return Array.isArray(lastPage) && lastPage.length === 20 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1 as number,
    enabled: !!username && enabled,
  });

  const comments = data?.pages.flat() || [];

  return {
    comments,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}

export function useUserLikes(username: string, enabled: boolean = true) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<Post[]>({
    queryKey: ['user-likes', username],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getUserLikes(username, pageParam as number, 20);
      if (response.error) throw new Error(response.error);
      return response.data as Post[];
    },
    getNextPageParam: (lastPage, pages) => {
      return Array.isArray(lastPage) && lastPage.length === 20 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1 as number,
    enabled: !!username && enabled,
  });

  const posts = data?.pages.flat() || [];

  return {
    posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
