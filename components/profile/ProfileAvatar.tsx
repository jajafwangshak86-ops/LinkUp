import { View, Image } from 'react-native';
import { Text } from '@/components/ui/text';

interface ProfileAvatarProps {
  avatar?: string;
  name?: string;
  username?: string;
  size?: 'small' | 'medium' | 'large';
}

export function ProfileAvatar({ avatar, name, username, size = 'large' }: ProfileAvatarProps) {
  const sizeClasses = {
    small: 'h-10 w-10',
    medium: 'h-16 w-16',
    large: 'h-24 w-24',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-xl',
    large: 'text-3xl',
  };

  const initial = name?.charAt(0)?.toUpperCase() || username?.charAt(0)?.toUpperCase() || '?';

  if (avatar) {
    return (
      <Image 
        source={{ uri: avatar }} 
        className={`${sizeClasses[size]} rounded-full`}
      />
    );
  }

  return (
    <View className={`${sizeClasses[size]} items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900`}>
      <Text className={`${textSizeClasses[size]} font-bold text-purple-600 dark:text-purple-300`}>
        {initial}
      </Text>
    </View>
  );
}
