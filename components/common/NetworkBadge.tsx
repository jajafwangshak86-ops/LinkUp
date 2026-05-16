import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface NetworkBadgeProps {
  network?: 'mainnet' | 'testnet';
}

export function NetworkBadge({ network = 'mainnet' }: NetworkBadgeProps) {
  const isMainnet = network === 'mainnet';
  return (
    <View className={`flex-row items-center gap-1.5 self-start rounded-full px-3 py-1 ${
      isMainnet ? 'bg-green-100 dark:bg-green-950' : 'bg-yellow-100 dark:bg-yellow-950'
    }`}>
      <View className={`h-2 w-2 rounded-full ${isMainnet ? 'bg-green-500' : 'bg-yellow-500'}`} />
      <Text className={`text-xs font-medium ${
        isMainnet ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
      }`}>
        Stacks {isMainnet ? 'Mainnet' : 'Testnet'}
      </Text>
    </View>
  );
}
