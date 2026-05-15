import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import { useAppState } from '@react-native-community/hooks';
import { useEffect } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isLoading: boolean;
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  isLoading: true,

  setTheme: async (theme: Theme) => {
    try {
      await AsyncStorage.setItem('theme', theme);
      set({ theme });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },

  toggleTheme: async () => {
    const currentTheme = get().theme;
    let newTheme: Theme;
    
    if (currentTheme === 'light') {
      newTheme = 'dark';
    } else if (currentTheme === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }
    
    await get().setTheme(newTheme);
  },

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        set({ theme: savedTheme, isLoading: false });
      } else {
        set({ theme: 'system', isLoading: false });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      set({ theme: 'system', isLoading: false });
    }
  },

  getEffectiveTheme: () => {
    const theme = get().theme;
    if (theme === 'system') {
      return Appearance.getColorScheme() || 'light';
    }
    return theme;
  },
}));

// Hook to sync Zustand store with NativeWind
export const useThemeSync = () => {
  const { theme, getEffectiveTheme } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system') {
        setColorScheme(colorScheme || 'light');
      }
    });

    return () => subscription.remove();
  }, [theme, setColorScheme]);

  // Sync theme changes
  const effectiveTheme = getEffectiveTheme();
  if (effectiveTheme) {
    setColorScheme(effectiveTheme);
  }

  return { theme, effectiveTheme };
};
