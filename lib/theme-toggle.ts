import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveThemePreference(theme: 'light' | 'dark') {
  try {
    await AsyncStorage.setItem('theme', theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
}

export async function getThemePreference(): Promise<'light' | 'dark' | null> {
  try {
    const theme = await AsyncStorage.getItem('theme');
    return theme as 'light' | 'dark' | null;
  } catch (error) {
    console.error('Error getting theme:', error);
    return null;
  }
}
