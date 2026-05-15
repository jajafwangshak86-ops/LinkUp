import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NavigationState {
  lastRoute: string | null;
  setLastRoute: (route: string) => void;
  clearLastRoute: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      lastRoute: null,
      setLastRoute: (route: string) => set({ lastRoute: route }),
      clearLastRoute: () => set({ lastRoute: null }),
    }),
    {
      name: 'navigation-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
