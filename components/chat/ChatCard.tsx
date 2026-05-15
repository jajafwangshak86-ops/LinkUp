import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { formatDistanceToNow } from 'date-fns';

interface ChatCardProps {
  id: string;
  participant: {
    avatar?: string;
    name?: string;
    username: string;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
  onPress: () => void;
}

export function ChatCard({
  participant,
  lastMessage,
  unreadCount,
  onPress,
}: ChatCardProps) {
  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: false });
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-3 border-b border-border bg-card p-4"
    >
      <Avatar
        uri={participant.avatar}
        name={participant.name}
        username={participant.username}
        size="md"
      />

      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold">{participant.name || participant.username}</Text>
          {lastMessage && (
            <Text className="text-xs text-muted-foreground">
              {formatTime(lastMessage.timestamp)}
            </Text>
          )}
        </View>

        <View className="mt-1 flex-row items-center justify-between">
          <Text
            className={`flex-1 text-sm ${
              unreadCount > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'
            }`}
            numberOfLines={1}
          >
            {lastMessage?.content || 'No messages yet'}
          </Text>
          {unreadCount > 0 && (
            <View className="ml-2">
              <Badge count={unreadCount} variant="primary" size="sm" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
