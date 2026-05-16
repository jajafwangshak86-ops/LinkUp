import { View } from 'react-native';
import { Text } from '@/components/ui/text';

/** Shows that chat/content is stored on Gaia (decentralized) */
export function GaiaStatusBadge() {
  return (
    <View className="flex-row items-center gap-1.5 self-start rounded-full bg-blue-100 dark:bg-blue-950 px-3 py-1">
      <View className="h-2 w-2 rounded-full bg-blue-500" />
      <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
        Stored on Gaia
      </Text>
    </View>
  );
}
