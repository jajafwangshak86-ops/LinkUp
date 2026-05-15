import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Heart, MessageCircle, DollarSign, Coins, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types';
import { useTranslation } from 'react-i18next';

interface FeedPostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => void;
  onTip: (post: Post) => void;
  onBuyToken: (post: Post) => void;
  onNavigateToProfile: (username: string) => void;
}

export function FeedPostCard({
  post,
  onLike,
  onTip,
  onBuyToken,
  onNavigateToProfile,
}: FeedPostCardProps) {
  const { t } = useTranslation();
  
  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: false }).replace('about ', '');
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/post/${post.id}`)}
      className="border-b border-border bg-card p-4"
    >
      <View className="flex-row gap-3">
        <TouchableOpacity onPress={() => onNavigateToProfile(post.author.username)}>
          {post.author.avatar ? (
            <Image source={{ uri: post.author.avatar }} className="h-10 w-10 rounded-full" />
          ) : (
            <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900">
              <Icon as={User} size={20} className="text-purple-600 dark:text-purple-300" />
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => onNavigateToProfile(post.author.username)}>
              <Text className="font-semibold">{post.author.name || post.author.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigateToProfile(post.author.username)}>
              <Text className="text-sm text-muted-foreground">@{post.author.username}</Text>
            </TouchableOpacity>
            <Text className="text-sm text-muted-foreground">· {formatTime(post.createdAt)}</Text>
          </View>

          <Text className="mt-2">{post.content}</Text>


          {/* Token Badge */}
          {post.isTokenized && (
            <View className="mt-2 flex-row items-center gap-2 self-start rounded-full bg-purple-100 dark:bg-purple-950 px-3 py-1">
              <Icon as={Coins} size={14} className="text-purple-600 dark:text-purple-400" />
              <Text className="text-xs font-medium text-purple-600 dark:text-purple-400">
                {post.tokenSupply} tokens @ {post.tokenPrice} SOL
              </Text>
            </View>
          )}

          {/* Images Grid */}
          {post.images && post.images.length > 0 && (
            <View className={`mt-3 gap-2 ${post.images.length === 1 ? '' : 'flex-row flex-wrap'}`}>
              {post.images.slice(0, 4).map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: img }}
                  className={`rounded-xl ${
                    post.images.length === 1 ? 'h-64 w-full' : 'h-32 w-[48%]'
                  }`}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View className="mt-3 flex-row flex-wrap gap-4">
            <TouchableOpacity
              onPress={() => onLike(post.id, post.isLiked)}
              className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${
                post.isLiked ? 'bg-purple-50 dark:bg-purple-950' : ''
              }`}
            >
              <Icon
                as={Heart}
                size={18}
                className={post.isLiked ? "text-purple-600" : "text-muted-foreground"}
                fill={post.isLiked ? "#9333ea" : "none"}
              />
              <Text className={`text-sm ${post.isLiked ? 'text-purple-600 font-semibold' : 'text-muted-foreground'}`}>
                {post.likesCount}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center gap-1">
              <Icon as={MessageCircle} size={18} className="text-muted-foreground" />
              <Text className="text-sm text-muted-foreground">{post.commentsCount}</Text>
            </View>

            <TouchableOpacity
              onPress={() => onTip(post)}
              className="flex-row items-center gap-1"
            >
              <Icon as={DollarSign} size={18} className="text-green-600" />
              <Text className="text-sm text-green-600">
                {t('common.tip')} ({post.tipsCount || 0})
              </Text>
            </TouchableOpacity>

            {post.isTokenized && (
              <TouchableOpacity
                onPress={() => onBuyToken(post)}
                className="flex-row items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-950 px-3 py-1"
              >
                <Icon as={Coins} size={16} className="text-purple-600 dark:text-purple-400" />
                <Text className="text-xs font-medium text-purple-600 dark:text-purple-400">{t('feed.buy')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tips Display */}
          {post.totalTipsAmount > 0 && (
            <View className="mt-2 rounded-lg bg-green-50 dark:bg-green-950 p-2">
              <Text className="text-xs text-green-700 dark:text-green-300">
                💰 {t('feed.receivedTips', { amount: post.totalTipsAmount.toFixed(4) })}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
