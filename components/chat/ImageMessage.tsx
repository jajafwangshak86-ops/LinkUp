import { View, Image, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Download } from 'lucide-react-native';

interface ImageMessageProps {
  uri: string;
  isMine: boolean;
  timestamp: string;
}

export function ImageMessage({ uri, isMine, timestamp }: ImageMessageProps) {
  return (
    <View className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
      <TouchableOpacity onLongPress={() => Linking.openURL(uri)}>
        <Image source={{ uri }} className="h-48 w-64 rounded-2xl" resizeMode="cover" />
      </TouchableOpacity>
      <View className="mt-1 flex-row items-center gap-1">
        <Text className="text-xs text-muted-foreground">{timestamp}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(uri)}>
          <Icon as={Download} size={12} className="text-muted-foreground" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
