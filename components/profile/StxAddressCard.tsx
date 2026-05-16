import { View, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Copy, ExternalLink } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { toast } from 'sonner-native';

interface StxAddressCardProps {
  address: string;
  label?: string;
}

export function StxAddressCard({ address, label = 'Stacks Address' }: StxAddressCardProps) {
  const copy = async () => {
    await Clipboard.setStringAsync(address);
    toast.success('Address copied!');
  };

  return (
    <View className="rounded-2xl bg-card p-4">
      <Text className="text-xs text-muted-foreground mb-1">{label}</Text>
      <View className="flex-row items-center justify-between">
        <Text className="font-mono text-sm flex-1 text-foreground" numberOfLines={1}>
          {address.slice(0, 14)}...{address.slice(-8)}
        </Text>
        <View className="flex-row gap-3 ml-2">
          <TouchableOpacity onPress={copy}>
            <Icon as={Copy} size={16} className="text-muted-foreground" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(`https://explorer.hiro.so/address/${address}`)}
          >
            <Icon as={ExternalLink} size={16} className="text-purple-600" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
