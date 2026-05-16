import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';

interface FollowButtonProps {
  isFollowing: boolean;
  isLoading?: boolean;
  onPress: () => void;
}

export function FollowButton({ isFollowing, isLoading, onPress }: FollowButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className={`rounded-full px-5 py-2 ${
        isFollowing
          ? 'border border-border bg-background'
          : 'bg-purple-600'
      }`}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isFollowing ? '#9333ea' : '#ffffff'} />
      ) : (
        <Text className={`font-semibold text-sm ${isFollowing ? 'text-foreground' : 'text-white'}`}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      )}
    </TouchableOpacity>
  );
}
