import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner-native';
import type { Notification } from '@/types';
import * as ExpoNotifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Initialize Firebase (configure with your Firebase config)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: any;
try {
  firebaseApp = initializeApp(firebaseConfig);
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

// Configure notifications
ExpoNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const queryClient = useQueryClient();

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listen for notifications from Expo
    const subscription1 = ExpoNotifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    const subscription2 = ExpoNotifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response:', response);
      // Handle notification tap
      handleNotificationTap(response.notification.request.content.data);
    });

    // Listen for Firebase messages (web/foreground)
    if (firebaseApp && Platform.OS === 'web') {
      try {
        const messaging = getMessaging(firebaseApp);
        const unsubscribe = onMessage(messaging, (payload: any) => {
          console.log('Firebase message received:', payload);
          // Show notification
          if (payload.notification) {
            ExpoNotifications.scheduleNotificationAsync({
              content: {
                title: payload.notification.title,
                body: payload.notification.body,
                data: payload.data || {},
              },
              trigger: null,
            });
          }
        });
        return () => {
          subscription1.remove();
          subscription2.remove();
          unsubscribe();
        };
      } catch (error) {
        console.warn('Firebase messaging setup failed:', error);
      }
    }

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  // Get notifications with infinite scroll
  const {
    data: notificationsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.getNotifications(pageParam as number, 20);
      if (response.error) throw new Error(response.error);
      return (response.data || []) as Notification[];
    },
    getNextPageParam: (lastPage, pages) => {
      return Array.isArray(lastPage) && lastPage.length === 20 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1 as number,
  });

  // Get unread count
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const response = await api.getUnreadCount();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.markNotificationAsRead(id);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
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
      toast.success('All notifications marked as read');
    },
  });

  const notifications = notificationsData?.pages.flat() || [];
  const unreadCount = (unreadData as { count?: number })?.count || 0;

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await ExpoNotifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: ExpoNotifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await ExpoNotifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permissions!');
    return;
  }

  try {
    // Get Firebase token for native platforms
    if (firebaseApp && (Platform.OS === 'ios' || Platform.OS === 'android')) {
      try {
        const messaging = getMessaging(firebaseApp);
        token = await getToken(messaging, {
          vapidKey: process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY,
        });
        console.log('Firebase token:', token);
      } catch (firebaseError) {
        console.warn('Firebase token retrieval failed, falling back to Expo token:', firebaseError);
      }
    }

    // Fallback to Expo token
    if (!token) {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        console.warn('EAS project ID not found. Push notifications require EAS Build.');
        return;
      }
      
      token = (await ExpoNotifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Expo push token:', token);
    }

    // Register token with backend
    if (token) {
      await api.registerPushToken(token);
    }
  } catch (error: any) {
    if (__DEV__) {
      console.log('Push notifications not fully available in development build.');
      console.log('To enable push notifications:');
      console.log('1. Build with EAS: eas build --profile development --platform android');
      console.log('2. Configure Firebase credentials in .env');
    } else {
      console.error('Error getting push token:', error?.message || error);
    }
  }

  return token;
}

function handleNotificationTap(data: any) {
  // Handle navigation based on notification data
  if (!data) return;

  // This would typically use router.push() to navigate
  // Example: if (data.postId) router.push(`/post/${data.postId}`);
  console.log('Notification tapped with data:', data);
}
