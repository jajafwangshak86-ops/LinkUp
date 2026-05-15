import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Settings, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface ProfileHeaderProps {
  isOwnProfile: boolean;
  onSettingsPress: () => void;
}

export function ProfileHeader({ isOwnProfile, onSettingsPress }: ProfileHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <View className="flex-row items-center justify-between px-4 pt-12">
      {!isOwnProfile ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Icon as={ArrowLeft} size={24} className="text-white" />
        </TouchableOpacity>
      ) : (
        <Text className="text-2xl font-bold text-white">{t('profile.profile')}</Text>
      )}
      {isOwnProfile && (
        <TouchableOpacity onPress={onSettingsPress}>
          <Icon as={Settings} size={24} className="text-white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
