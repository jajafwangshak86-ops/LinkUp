import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  isLoading: boolean;
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
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
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    await get().setTheme(newTheme);
  },

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        set({ theme: savedTheme, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      set({ isLoading: false });
    }
  },
}));

// Hook to sync Zustand store with NativeWind
export const useThemeSync = () => {
  const { theme } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  // Sync theme changes
  if (theme) {
    setColorScheme(theme);
  }

  return { theme };
};
