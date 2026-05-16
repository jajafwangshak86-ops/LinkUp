import { View, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { CheckCircle, ExternalLink } from 'lucide-react-native';
import { txUrl } from '@/lib/stacks-explorer';

interface SendSuccessProps {
  txId: string;
  amount: number;
  recipient: string;
  onDone: () => void;
}

export function SendSuccess({ txId, amount, recipient, onDone }: SendSuccessProps) {
  return (
    <View className="items-center p-6">
      <Icon as={CheckCircle} size={64} className="text-green-500" />
      <Text className="mt-4 text-2xl font-bold">Sent!</Text>
      <Text className="mt-2 text-center text-muted-foreground">
        {amount} STX sent to {recipient.slice(0, 8)}...{recipient.slice(-6)}
      </Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(txUrl(txId))}
        className="mt-4 flex-row items-center gap-2"
      >
        <Icon as={ExternalLink} size={16} className="text-purple-600" />
        <Text className="text-purple-600 font-medium">View on Hiro Explorer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDone}
        className="mt-6 w-full rounded-2xl bg-purple-600 py-4"
      >
        <Text className="text-center font-semibold text-white">Done</Text>
      </TouchableOpacity>
    </View>
  );
}
