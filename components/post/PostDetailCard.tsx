import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { FeedHeader, FeedContent, FeedImages } from '@/components/feed';
import type { Post } from '@/types';

interface PostDetailCardProps {
  post: Post;
}

export function PostDetailCard({ post }: PostDetailCardProps) {
  return (
    <View className="bg-card p-4">
      <FeedHeader
        author={{
          avatar: post.author?.avatar,
          name: post.author?.name,
          username: post.author?.username || '',
        }}
        createdAt={post.createdAt}
      />
      <FeedContent content={post.content} />
      <FeedImages images={post.images || []} />
      
      {/* Stats */}
      <View className="mt-4 flex-row gap-6 border-t border-border pt-4">
        <View>
          <Text className="text-2xl font-bold">{post.likesCount || 0}</Text>
          <Text className="text-sm text-muted-foreground">Likes</Text>
        </View>
        <View>
          <Text className="text-2xl font-bold">{post.commentsCount || 0}</Text>
          <Text className="text-sm text-muted-foreground">Comments</Text>
        </View>
        {post.isTokenized && (
          <View>
            <Text className="text-2xl font-bold">{post.tokenSupply}</Text>
            <Text className="text-sm text-muted-foreground">Tokens</Text>
          </View>
        )}
      </View>
    </View>
  );
}
