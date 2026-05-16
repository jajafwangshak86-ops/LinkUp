import { View, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { DollarSign, ExternalLink } from 'lucide-react-native';
import { fromUstx } from '@/lib/stx';
import { txUrl } from '@/lib/stacks-explorer';

interface PaymentMessageProps {
  amount?: number; // micro-STX
  txId?: string;
  isMine: boolean;
  createdAt: number;
}

export function PaymentMessage({ amount, txId, isMine, createdAt }: PaymentMessageProps) {
  const stx = amount ? fromUstx(amount) : 0;

  return (
    <View className="rounded-2xl bg-green-100 dark:bg-green-950 p-4 max-w-[75%]">
      <View className="flex-row items-center gap-2">
        <Icon as={DollarSign} size={16} className="text-green-600" />
        <Text className="font-semibold text-green-700 dark:text-green-300">
          {isMine ? 'Sent' : 'Received'} {stx.toFixed(4)} STX
        </Text>
      </View>
      {txId && (
        <TouchableOpacity
          onPress={() => Linking.openURL(txUrl(txId))}
          className="mt-1 flex-row items-center gap-1"
        >
          <Icon as={ExternalLink} size={12} className="text-green-600" />
          <Text className="text-xs text-green-600">View on Explorer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
