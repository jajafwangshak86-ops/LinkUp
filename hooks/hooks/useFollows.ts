import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner-native';

export function useFollows() {
  const queryClient = useQueryClient();

  // Follow user
  const followMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.followUser(userId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('User followed!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Unfollow user
  const unfollowMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.unfollowUser(userId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('User unfollowed');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    followUser: followMutation.mutate,
    unfollowUser: unfollowMutation.mutate,
    isFollowing: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,
  };
}

export function useFollowers(userId?: string) {
  return useQuery({
    queryKey: ['follows', 'followers', userId],
    queryFn: async () => {
      const response = await api.getFollowers(userId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });
}

export function useFollowing(userId?: string) {
  return useQuery({
    queryKey: ['follows', 'following', userId],
    queryFn: async () => {
      const response = await api.getFollowing(userId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });
}

export function useCheckFollowing(userId: string) {
  return useQuery({
    queryKey: ['follows', 'check', userId],
    queryFn: async () => {
      const response = await api.checkIfFollowing(userId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    enabled: !!userId,
  });
}

export function useFollowStats(userId: string) {
  return useQuery({
    queryKey: ['follows', 'stats', userId],
    queryFn: async () => {
      const response = await api.getFollowStats(userId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    enabled: !!userId,
  });
}
