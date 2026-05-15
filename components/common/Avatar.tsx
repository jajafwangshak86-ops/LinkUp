import { View, Image } from 'react-native';
import { Text } from '@/components/ui/text';

interface AvatarProps {
  uri?: string;
  name?: string;
  username?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  xs: { container: 'h-6 w-6', text: 'text-xs' },
  sm: { container: 'h-10 w-10', text: 'text-sm' },
  md: { container: 'h-16 w-16', text: 'text-xl' },
  lg: { container: 'h-24 w-24', text: 'text-3xl' },
  xl: { container: 'h-32 w-32', text: 'text-4xl' },
};

export function Avatar({ uri, name, username, size = 'md' }: AvatarProps) {
  const { container, text } = sizeMap[size];
  const initial = name?.charAt(0)?.toUpperCase() || username?.charAt(0)?.toUpperCase() || '?';

  if (uri) {
    return <Image source={{ uri }} className={`${container} rounded-full`} />;
  }

  return (
    <View className={`${container} items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900`}>
      <Text className={`${text} font-bold text-purple-600 dark:text-purple-300`}>
        {initial}
      </Text>
    </View>
  );
}
