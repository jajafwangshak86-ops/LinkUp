import { View } from 'react-native';
import { Text } from '@/components/ui/text';

/** Shows that a transaction is anchored to Bitcoin via Stacks */
export function BitcoinAnchorBadge() {
  return (
    <View className="flex-row items-center gap-1.5 self-start rounded-full bg-orange-100 dark:bg-orange-950 px-3 py-1">
      <Text className="text-xs">₿</Text>
      <Text className="text-xs font-medium text-orange-700 dark:text-orange-300">
        Anchored to Bitcoin
      </Text>
    </View>
  );
}
