import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

export function useOnboarding() {
  const [isFirstTimeUser, setIsFirstTimeUserState] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is first time on app load
  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const firstTime = await storage.isFirstTimeUser();
      setIsFirstTimeUserState(firstTime);
    } catch (error) {
      console.error('Error checking first time user:', error);
      setIsFirstTimeUserState(true); // Default to true on error
    } finally {
      setIsLoading(false);
    }
  };

  const setIsFirstTimeUser = async (value: boolean) => {
    try {
      await storage.setFirstTimeUser(value);
      setIsFirstTimeUserState(value);
    } catch (error) {
      console.error('Error setting first time user:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await storage.setOnboardingCompleted();
      await setIsFirstTimeUser(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return {
    isFirstTimeUser,
    setIsFirstTimeUser,
    completeOnboarding,
    isLoading,
  };
}
