import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { MoreVertical, Copy, UserPlus, UserMinus, MessageCircle } from 'lucide-react-native';
import { Link } from 'expo-router';
import { ProfileAvatar } from './ProfileAvatar';
import type { User } from '@/types';

interface ProfileCardProps {
  user: User;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  isCreatingChat?: boolean;
  onMenuPress: () => void;
  onFollowToggle: () => void;
  onMessagePress: () => void;
  onCopyAddress: () => void;
}

export function ProfileCard({
  user,
  isOwnProfile,
  isFollowing = false,
  isCreatingChat = false,
  onMenuPress,
  onFollowToggle,
  onMessagePress,
  onCopyAddress,
}: ProfileCardProps) {
  return (
    <View className="mx-4 mt-6 rounded-3xl bg-card p-6">
      <View className="flex-row items-start justify-between">
        <ProfileAvatar 
          avatar={user.avatar}
          name={user.name}
          username={user.username}
          size="large"
        />
        {isOwnProfile ? (
          <TouchableOpacity onPress={onMenuPress}>
            <Icon as={MoreVertical} size={24} className="text-foreground" />
          </TouchableOpacity>
        ) : (
          <View className="flex-row gap-2">
            <TouchableOpacity 
              onPress={onMessagePress}
              disabled={isCreatingChat}
              className="items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 p-3"
            >
              <Icon as={MessageCircle} size={20} className="text-purple-600 dark:text-purple-300" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onFollowToggle}
              className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${isFollowing ? 'bg-gray-200 dark:bg-black' : 'bg-purple-600'}`}
            >
              <Icon as={isFollowing ? UserMinus : UserPlus} size={18} className={isFollowing ? "text-foreground" : "text-white"} />
              <Text className={`font-semibold ${isFollowing ? 'text-foreground' : 'text-white'}`}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="mt-4">
        <Text className="text-2xl font-bold">{user.name || user.username}</Text>
        <Text className="text-muted-foreground">@{user.username}</Text>
        <Text className="mt-2">{user.bio || 'No bio yet'}</Text>
      </View>

      <View className="mt-4 flex-row gap-6">
        <Link href={`/follows/${user.id}?tab=following`} asChild>
          <TouchableOpacity>
            <Text className="text-xl font-bold">{user.followingCount || 0}</Text>
            <Text className="text-sm text-muted-foreground">Following</Text>
          </TouchableOpacity>
        </Link>
        <Link href={`/follows/${user.id}?tab=followers`} asChild>
          <TouchableOpacity>
            <Text className="text-xl font-bold">{user.followersCount || 0}</Text>
            <Text className="text-sm text-muted-foreground">Followers</Text>
          </TouchableOpacity>
        </Link>
        <View>
          <Text className="text-xl font-bold">{user.postsCount || 0}</Text>
          <Text className="text-sm text-muted-foreground">Posts</Text>
        </View>
      </View>

      {/* Wallet Address */}
      <View className="mt-4 rounded-2xl bg-gray-50 dark:bg-muted-foreground p-4">
        <Text className="text-sm text-muted-foreground">Wallet Address</Text>
        <View className="mt-1 flex-row items-center justify-between">
          <Text className="text-lg font-bold">
            {user.walletAddress?.slice(0, 8)}...{user.walletAddress?.slice(-4)}
          </Text>
          <TouchableOpacity onPress={onCopyAddress}>
            <Icon as={Copy} size={20} className="text-purple-600" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
