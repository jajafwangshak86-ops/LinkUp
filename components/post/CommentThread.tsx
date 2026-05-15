import { View } from 'react-native';
import { CommentCard } from './CommentCard';
import { LoadingSpinner } from '@/components/common';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Comment } from '@/types';

interface CommentThreadProps {
  comment: Comment & { isLiked: boolean };
  onLike: (commentId: string) => void;
  onReply: (commentId: string, username: string) => void;
  onAuthorPress: (username: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  level?: number;
}

export function CommentThread({
  comment,
  onLike,
  onReply,
  onAuthorPress,
  isExpanded,
  onToggleExpand,
  level = 0,
}: CommentThreadProps) {
  // Fetch replies when expanded
  const { data: repliesData, isLoading } = useQuery({
    queryKey: ['replies', comment.id],
    queryFn: async () => {
      const response = await api.getReplies(comment.id);
      return response.data || [];
    },
    enabled: isExpanded && (comment.repliesCount || 0) > 0,
  });

  const replies = (repliesData as any[]) || [];

  return (
    <View>
      <CommentCard
        comment={comment}
        onLike={() => onLike(comment.id)}
        onReply={() => onReply(comment.id, comment.author.username)}
        onAuthorPress={() => onAuthorPress(comment.author.username)}
        onViewReplies={(comment.repliesCount || 0) > 0 ? onToggleExpand : undefined}
        showReplies={isExpanded}
        level={level}
        replies={
          isExpanded && (
            <View>
              {isLoading && <LoadingSpinner />}
              {!isLoading && replies.map((reply: any) => (
                <CommentThread
                  key={reply.id}
                  comment={{ ...reply, isLiked: false }}
                  onLike={onLike}
                  onReply={onReply}
                  onAuthorPress={onAuthorPress}
                  isExpanded={false}
                  onToggleExpand={() => {}}
                  level={level + 1}
                />
              ))}
            </View>
          )
        }
      />
    </View>
  );
}
