import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { Avatar } from '@/components/common/Avatar';

interface FeedHeaderProps {
  author: {
    avatar?: string;
    name?: string;
    username: string;
  };
  createdAt: string;
  onAuthorPress?: () => void;
}

export function FeedHeader({ author, createdAt, onAuthorPress }: FeedHeaderProps) {
  const handlePress = () => {
    if (onAuthorPress) {
      onAuthorPress();
    } else {
      router.push(`/(tabs)/profile?username=${author.username}`);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className="flex-row items-center gap-3 mb-3">
      <Avatar uri={author.avatar} name={author.name} username={author.username} size="sm" />
      <View className="flex-1">
        <Text className="font-semibold">{author.name || author.username}</Text>
        <Text className="text-xs text-muted-foreground">
          @{author.username} · {new Date(createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
