import { View, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/ui/text';

interface OnChainBadgeProps {
  postId: number;
  txId?: string;
}

export function OnChainBadge({ postId, txId }: OnChainBadgeProps) {
  const handlePress = () => {
    if (txId) Linking.openURL(`https://explorer.hiro.so/txid/${txId}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!txId}
      className="mt-1 flex-row items-center gap-1 self-start rounded-full bg-orange-100 dark:bg-orange-950 px-2 py-0.5"
    >
      <Text className="text-xs text-orange-600 dark:text-orange-400">
        ⛓ #{postId} on Bitcoin
      </Text>
    </TouchableOpacity>
  );
}
