import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/common/Avatar';

interface UserSearchCardProps {
  user: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  onPress: () => void;
}

export function UserSearchCard({ user, onPress }: UserSearchCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-3 border-b border-border py-4"
    >
      <Avatar
        uri={user.avatar}
        name={user.name}
        username={user.username}
        size="md"
      />
      <View className="flex-1">
        <Text className="font-semibold">{user.name || user.username}</Text>
        <Text className="text-sm text-muted-foreground">@{user.username}</Text>
      </View>
    </TouchableOpacity>
  );
}
