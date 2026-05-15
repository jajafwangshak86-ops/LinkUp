import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useEffect } from 'react';
import { getFCMToken, setupNotificationHandler } from '@/lib/firebase';

export function useNotifications() {
  const queryClient = useQueryClient();

  // Get notifications
  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.getNotifications();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });

  // Get unread count
  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const response = await api.getUnreadCount();
      if (response.error) throw new Error(response.error);
      return (response.data as any)?.count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.markNotificationAsRead(id);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.markAllNotificationsAsRead();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
  });

  return {
    notifications: notifications || [],
    unreadCount: unreadCount || 0,
    isLoading,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
}

async function registerForPushNotificationsAsync() {
  // Setup notification handler
  setupNotificationHandler();

  // Get FCM token
  const token = await getFCMToken();
  
  if (!token) {
    return;
  }

  try {
    // Register token with backend
    await api.registerPushToken(token);
    console.log('Push token registered with backend');
  } catch (error) {
    console.error('Error registering push token with backend:', error);
  }
}
