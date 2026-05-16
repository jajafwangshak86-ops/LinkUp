import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Copy } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { toast } from 'sonner-native';
import { shortenAddress } from '@/lib/format';

interface ReceiveQRProps {
  address: string;
  size?: number;
}

export function ReceiveQR({ address, size = 200 }: ReceiveQRProps) {
  const copy = async () => {
    await Clipboard.setStringAsync(address);
    toast.success('Address copied!');
  };

  return (
    <View className="items-center">
      <View className="rounded-2xl bg-white p-4 shadow-md">
        {address ? (
          <QRCode value={address} size={size} backgroundColor="white" color="black" />
        ) : (
          <View style={{ width: size, height: size }} className="items-center justify-center">
            <Text className="text-muted-foreground">Loading...</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={copy}
        className="mt-3 flex-row items-center gap-2 rounded-xl bg-purple-100 dark:bg-purple-950 px-4 py-2"
      >
        <Icon as={Copy} size={14} className="text-purple-600" />
        <Text className="text-sm font-medium text-purple-600">
          {shortenAddress(address)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
