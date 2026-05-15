import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/common/Avatar';
import { formatDistanceToNow } from 'date-fns';

interface PostSearchCardProps {
  post: {
    id: string;
    content: string;
    author: {
      username: string;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    likesCount: number;
    commentsCount: number;
  };
  onPress: () => void;
}

export function PostSearchCard({ post, onPress }: PostSearchCardProps) {
  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="border-b border-border py-4"
    >
      <View className="flex-row items-start gap-3">
        <Avatar
          uri={post.author.avatar}
          name={post.author.name}
          username={post.author.username}
          size="sm"
        />
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="font-semibold">{post.author.name || post.author.username}</Text>
            <Text className="text-sm text-muted-foreground">@{post.author.username}</Text>
            <Text className="text-sm text-muted-foreground">· {formatTime(post.createdAt)}</Text>
          </View>
          <Text className="mt-1" numberOfLines={3}>{post.content}</Text>
          <View className="mt-2 flex-row gap-4">
            <Text className="text-sm text-muted-foreground">{post.likesCount} likes</Text>
            <Text className="text-sm text-muted-foreground">{post.commentsCount} comments</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
