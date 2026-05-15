import { Tabs } from 'expo-router';
import { Home, Wallet, Send, MessageCircle, User, Search } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export default function TabsLayout() {
  const { theme } = useThemeStore();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? 'dark' : 'light';
  });

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => subscription.remove();
  }, []);

  // Determine effective theme
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  const isDark = effectiveTheme === 'dark';
  
  const tabBarBg = isDark ? '#121212' : '#ffffff';
  const tabBarBorderColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#9333ea',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: tabBarBorderColor,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
          href: '/(tabs)/wallet'
        }}
      />
      <Tabs.Screen
        name="pay"
        options={{
          title: 'Pay',
          tabBarIcon: ({ color, size }) => <Send size={size} color={color} />, 
          href: null
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          href: '/(tabs)/chats',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          href: '/(tabs)/profile',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          href: null
        }}
      />
    </Tabs>
  );
}
