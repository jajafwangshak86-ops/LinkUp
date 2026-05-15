import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Globe, Check, X } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { toast } from 'sonner-native';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
];

export function LanguageSelector() {
  const [showModal, setShowModal] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    console.log('LanguageSelector mounted');
  }, []);

  const currentLanguage = LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0];

  const handlePress = () => {
    console.log('Language button pressed');
    setShowModal(true);
  };

  const handleLanguageChange = (languageCode: string) => {
    console.log('Language selected:', languageCode);
    try {
      // For now, just update local state
      // i18n integration will be added later
      setCurrentLang(languageCode);
      const language = LANGUAGES.find(lang => lang.code === languageCode);
      toast.success(`Language changed to ${language?.nativeName}`);
      setShowModal(false);
    } catch (error) {
      console.error('Language change error:', error);
      toast.error('Failed to change language');
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center justify-between rounded-2xl bg-card p-4"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Icon as={Globe} size={20} className="text-blue-600 dark:text-blue-300" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold">Language</Text>
            <Text className="text-sm text-muted-foreground">
              {currentLanguage.nativeName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="rounded-t-3xl bg-background p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold">Select Language</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon as={X} size={24} className="text-foreground" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => handleLanguageChange(language.code)}
                  className="flex-row items-center justify-between rounded-xl bg-card p-4 mb-2"
                  activeOpacity={0.7}
                >
                  <View>
                    <Text className="font-semibold">{language.nativeName}</Text>
                    <Text className="text-sm text-muted-foreground">{language.name}</Text>
                  </View>
                  {currentLang === language.code && (
                    <Icon as={Check} size={20} className="text-purple-600" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
