import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { ProfileAvatar } from './ProfileAvatar';
import type { Post } from '@/types';
import { useTranslation } from 'react-i18next';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity 
      onPress={() => router.push(`/post/${post.id}`)}
      className="mb-4 rounded-2xl bg-card p-4"
    >
      <View className="flex-row items-center gap-3 mb-3">
        <ProfileAvatar 
          avatar={post.author?.avatar}
          name={post.author?.name}
          username={post.author?.username}
          size="small"
        />
        <View className="flex-1">
          <Text className="font-semibold">{post.author?.name || post.author?.username}</Text>
          <Text className="text-xs text-muted-foreground">
            @{post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text className="mb-3">{post.content}</Text>
      {post.images && post.images.length > 0 && (
        <View className="mb-3 flex-row flex-wrap gap-2">
          {post.images.slice(0, 4).map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img }}
              className={`rounded-xl ${
                post.images.length === 1
                  ? 'h-64 w-full'
                  : post.images.length === 2
                  ? 'h-48 w-[48%]'
                  : 'h-32 w-[48%]'
              }`}
              resizeMode="cover"
            />
          ))}
        </View>
      )}
      <View className="flex-row gap-4">
        <Text className="text-sm text-muted-foreground">{post.likesCount || 0} {t('profile.likesCount')}</Text>
        <Text className="text-sm text-muted-foreground">{post.commentsCount || 0} {t('profile.commentsCount')}</Text>
        {post.isTokenized && (
          <Text className="text-sm text-purple-600 font-semibold">🪙 {t('profile.tokenized')}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
