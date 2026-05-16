import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Heart, MessageCircle, DollarSign } from 'lucide-react-native';

interface PostStatsProps {
  likes: number;
  comments: number;
  tipsStx: number;
  isLiked?: boolean;
}

export function PostStats({ likes, comments, tipsStx, isLiked }: PostStatsProps) {
  return (
    <View className="flex-row gap-4">
      <View className="flex-row items-center gap-1">
        <Icon as={Heart} size={16} className={isLiked ? 'text-purple-600' : 'text-muted-foreground'} fill={isLiked ? '#9333ea' : 'none'} />
        <Text className="text-sm text-muted-foreground">{likes}</Text>
      </View>
      <View className="flex-row items-center gap-1">
        <Icon as={MessageCircle} size={16} className="text-muted-foreground" />
        <Text className="text-sm text-muted-foreground">{comments}</Text>
      </View>
      {tipsStx > 0 && (
        <View className="flex-row items-center gap-1">
          <Icon as={DollarSign} size={16} className="text-green-600" />
          <Text className="text-sm text-green-600">{tipsStx.toFixed(2)} STX</Text>
        </View>
      )}
    </View>
  );
}
