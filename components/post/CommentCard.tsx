import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Avatar } from '@/components/common/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface CommentCardProps {
  comment: {
    id: string;
    content: string;
    author: {
      avatar?: string;
      name?: string;
      username: string;
    };
    createdAt: string;
    likesCount: number;
    repliesCount?: number;
    isLiked: boolean;
  };
  onLike: () => void;
  onReply?: () => void;
  onAuthorPress?: () => void;
  onViewReplies?: () => void;
  showReplies?: boolean;
  replies?: React.ReactNode;
  level?: number;
}

export function CommentCard({
  comment,
  onLike,
  onReply,
  onAuthorPress,
  onViewReplies,
  showReplies = false,
  replies,
  level = 0,
}: CommentCardProps) {
  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const hasReplies = (comment.repliesCount || 0) > 0;
  const isNested = level > 0;

  return (
    <View className={`border-b border-border bg-card ${isNested ? 'ml-12' : ''}`}>
      <View className="p-4">
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={onAuthorPress}>
            <Avatar
              uri={comment.author.avatar}
              name={comment.author.name}
              username={comment.author.username}
              size="sm"
            />
          </TouchableOpacity>

          <View className="flex-1">
            <View className="flex-row items-center gap-2 flex-wrap">
              <TouchableOpacity onPress={onAuthorPress}>
                <Text className="font-semibold">
                  {comment.author.name || comment.author.username}
                </Text>
              </TouchableOpacity>
              <Text className="text-sm text-muted-foreground">
                @{comment.author.username}
              </Text>
              <Text className="text-sm text-muted-foreground">
                · {formatTime(comment.createdAt)}
              </Text>
            </View>

            <Text className="mt-2">{comment.content}</Text>

            <View className="mt-3 flex-row gap-4">
              <TouchableOpacity
                onPress={onLike}
                className="flex-row items-center gap-1"
              >
                <Icon
                  as={Heart}
                  size={16}
                  className={comment.isLiked ? 'text-red-500' : 'text-muted-foreground'}
                  fill={comment.isLiked ? '#ef4444' : 'none'}
                />
                <Text className={`text-sm ${comment.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {comment.likesCount || 0}
                </Text>
              </TouchableOpacity>

              {onReply && (
                <TouchableOpacity
                  onPress={onReply}
                  className="flex-row items-center gap-1"
                >
                  <Icon as={MessageCircle} size={16} className="text-muted-foreground" />
                  <Text className="text-sm text-muted-foreground">Reply</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* View Replies Button */}
      {hasReplies && onViewReplies && (
        <TouchableOpacity
          onPress={onViewReplies}
          className="flex-row items-center gap-2 px-4 pb-3"
        >
          <View className="h-px flex-1 bg-border" />
          <View className="flex-row items-center gap-1">
            <Icon
              as={showReplies ? ChevronUp : ChevronDown}
              size={16}
              className="text-purple-600"
            />
            <Text className="text-sm font-medium text-purple-600">
              {showReplies ? 'Hide' : 'View'} {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
            </Text>
          </View>
          <View className="h-px flex-1 bg-border" />
        </TouchableOpacity>
      )}

      {/* Nested Replies */}
      {showReplies && replies}
    </View>
  );
}
