import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner-native';
import { useEffect } from 'react';
import pusher from '@/lib/pusher';
import { useAuth } from '@/hooks/useAuth';
import type { Chat, Message, User } from '@/types';

export function useChats() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const typedUser = user as User | undefined;

  // Get all chats
  const { data: chats, isLoading, refetch } = useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await api.getChats();
      if (response.error) throw new Error(response.error);
      //console.log('Chats',response.data)
      return response.data as Chat[];
    },
  });

  // Subscribe to real-time chat updates
  useEffect(() => {
    if (!typedUser?.id) return;

    const channel = pusher.subscribe(`user-${typedUser.id}`);
    
    channel.bind('chat-updated', (data: any) => {
      // Invalidate chats query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    });

    return () => {
      channel.unbind('chat-updated');
      pusher.unsubscribe(`user-${typedUser.id}`);
    };
  }, [typedUser?.id, queryClient]);

  // Create chat
  const createChatMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const response = await api.createChat(participantId);
      if (response.error) throw new Error(response.error);
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    chats: chats || [],
    isLoading,
    refetch,
    createChat: createChatMutation.mutateAsync,
    isCreatingChat: createChatMutation.isPending,
  };
}

export function useChat(chatId: string) {
  return useQuery<Chat>({
    queryKey: ['chats', chatId],
    queryFn: async () => {
      const response = await api.getChat(chatId);
      if (response.error) throw new Error(response.error);
      return response.data as Chat;
    },
    enabled: !!chatId,
  });
}

export function useMessages(chatId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const typedUser = user as User | undefined;

  // Get messages
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<Message[]>({
    queryKey: ['messages', chatId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getMessages(chatId, pageParam as number, 50);
      if (response.error) throw new Error(response.error);
      //console.log(response.data)
      return response.data as Message[];
    },
    getNextPageParam: (lastPage, pages) => {
      return Array.isArray(lastPage) && lastPage.length === 50 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1 as number,
    enabled: !!chatId,
  });

  // Subscribe to real-time messages
  useEffect(() => {
    if (!chatId) return;

    const channel = pusher.subscribe(`chat-${chatId}`);
    
    channel.bind('new-message', (newMessage: Message) => {
      // Add isMine flag based on current user
      const messageWithFlag = {
        ...newMessage,
        isMine: newMessage.sender && (newMessage.sender as any)._id === typedUser?.id,
      };

      // Update messages cache
      queryClient.setQueryData(['messages', chatId], (oldData: any) => {
        if (!oldData) return oldData;
        
        const firstPage = oldData.pages[0] || [];
        const messageExists = firstPage.some((msg: Message) => msg.id === newMessage.id);
        
        if (messageExists) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: Message[], index: number) => 
            index === 0 ? [...page, messageWithFlag] : page
          ),
        };
      });

      // Also invalidate chats to update last message
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    });

    return () => {
      channel.unbind('new-message');
      pusher.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId, queryClient, typedUser?.id]);

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, type }: { content: string; type?: string }) => {
      const response = await api.sendMessage(chatId, content, type);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Send tip
  const sendTipMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await api.sendTip(chatId, amount);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Tip sent!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await api.markChatAsRead(chatId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  const messages = data?.pages.flat() || [];

  return {
    messages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    sendMessage: sendMessageMutation.mutate,
    isSendingMessage: sendMessageMutation.isPending,
    sendTip: sendTipMutation.mutate,
    isSendingTip: sendTipMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
  };
}
