import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Heart, MessageCircle, Share2, DollarSign } from 'lucide-react-native';

interface FeedActionsProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare?: () => void;
  onTip?: () => void;
  showTip?: boolean;
}

export function FeedActions({
  isLiked,
  likesCount,
  commentsCount,
  onLike,
  onComment,
  onShare,
  onTip,
  showTip = false,
}: FeedActionsProps) {
  return (
    <View className="flex-row items-center gap-6 pt-3 border-t border-border">
      <TouchableOpacity onPress={onLike} className="flex-row items-center gap-2">
        <Icon
          as={Heart}
          size={20}
          className={isLiked ? 'text-red-500' : 'text-muted-foreground'}
          fill={isLiked ? '#ef4444' : 'none'}
        />
        <Text className={isLiked ? 'text-red-500' : 'text-muted-foreground'}>
          {likesCount || 0}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onComment} className="flex-row items-center gap-2">
        <Icon as={MessageCircle} size={20} className="text-muted-foreground" />
        <Text className="text-muted-foreground">{commentsCount || 0}</Text>
      </TouchableOpacity>

      {onShare && (
        <TouchableOpacity onPress={onShare} className="flex-row items-center gap-2">
          <Icon as={Share2} size={20} className="text-muted-foreground" />
        </TouchableOpacity>
      )}

      {showTip && onTip && (
        <TouchableOpacity onPress={onTip} className="ml-auto flex-row items-center gap-2">
          <Icon as={DollarSign} size={20} className="text-purple-600" />
          <Text className="text-purple-600 font-semibold">Tip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
