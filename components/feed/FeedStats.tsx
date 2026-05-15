import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { TokenBadge } from './TokenBadge';

interface FeedStatsProps {
  likesCount: number;
  commentsCount: number;
  isTokenized?: boolean;
}

export function FeedStats({ likesCount, commentsCount, isTokenized }: FeedStatsProps) {
  return (
    <View className="flex-row gap-4">
      <Text className="text-sm text-muted-foreground">{likesCount || 0} likes</Text>
      <Text className="text-sm text-muted-foreground">{commentsCount || 0} comments</Text>
      <TokenBadge isTokenized={isTokenized} />
    </View>
  );
}
