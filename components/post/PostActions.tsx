import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Heart, MessageCircle, Share2, DollarSign, Coins } from 'lucide-react-native';

interface PostActionsProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  isTokenized?: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare?: () => void;
  onTip?: () => void;
  onBuyToken?: () => void;
}

export function PostActions({
  isLiked,
  likesCount,
  commentsCount,
  isTokenized,
  onLike,
  onComment,
  onShare,
  onTip,
  onBuyToken,
}: PostActionsProps) {
  return (
    <View className="border-t border-border bg-card p-4">
      <View className="flex-row items-center justify-around">
        <TouchableOpacity
          onPress={onLike}
          className="flex-row items-center gap-2"
        >
          <Icon
            as={Heart}
            size={24}
            className={isLiked ? 'text-red-500' : 'text-muted-foreground'}
            fill={isLiked ? '#ef4444' : 'none'}
          />
          <Text className={isLiked ? 'text-red-500 font-semibold' : 'text-muted-foreground'}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onComment}
          className="flex-row items-center gap-2"
        >
          <Icon as={MessageCircle} size={24} className="text-muted-foreground" />
          <Text className="text-muted-foreground">{commentsCount}</Text>
        </TouchableOpacity>

        {onShare && (
          <TouchableOpacity onPress={onShare}>
            <Icon as={Share2} size={24} className="text-muted-foreground" />
          </TouchableOpacity>
        )}

        {onTip && (
          <TouchableOpacity onPress={onTip}>
            <Icon as={DollarSign} size={24} className="text-green-600" />
          </TouchableOpacity>
        )}

        {isTokenized && onBuyToken && (
          <TouchableOpacity onPress={onBuyToken}>
            <Icon as={Coins} size={24} className="text-purple-600" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
