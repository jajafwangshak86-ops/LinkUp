import { View, TouchableOpacity, Alert, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Eye } from 'lucide-react-native';
import { useState } from 'react';

interface ViewOnceMessageProps {
  content: string;
  type: 'text' | 'image';
  isMine: boolean;
}

export function ViewOnceMessage({ content, type, isMine }: ViewOnceMessageProps) {
  const [revealed, setRevealed] = useState(false);

  const reveal = () => {
    Alert.alert('View Once', 'This can only be viewed once.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'View', onPress: () => setRevealed(true) },
    ]);
  };

  if (!revealed) {
    return (
      <TouchableOpacity onPress={reveal}
        className={`flex-row items-center gap-2 rounded-2xl px-4 py-3 ${isMine ? 'bg-purple-600' : 'bg-card'}`}>
        <Icon as={Eye} size={16} className={isMine ? 'text-white' : 'text-purple-600'} />
        <Text className={`text-sm font-medium ${isMine ? 'text-white' : 'text-foreground'}`}>
          {type === 'image' ? 'View once photo' : 'View once message'}
        </Text>
      </TouchableOpacity>
    );
  }

  if (type === 'image') {
    return <Image source={{ uri: content }} className="h-48 w-64 rounded-2xl" resizeMode="cover" />;
  }

  return (
    <View className={`rounded-2xl px-4 py-3 ${isMine ? 'bg-purple-600' : 'bg-card'}`}>
      <Text className={isMine ? 'text-white' : 'text-foreground'}>{content}</Text>
    </View>
  );
}
