import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './useAuth';
import type { User } from '@/types';

export function useLanguage() {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const userWithLang = user as User | null;
        // Priority: user profile > AsyncStorage > device language
        if (userWithLang?.language) {
          await i18n.changeLanguage(userWithLang.language);
        } else {
          const savedLang = await AsyncStorage.getItem('userLanguage');
          if (savedLang) {
            await i18n.changeLanguage(savedLang);
          }
        }
      } catch (error) {
        console.error('Error initializing language:', error);
      }
    };

    initializeLanguage();
  }, [user, i18n]);

  return { i18n };
}
