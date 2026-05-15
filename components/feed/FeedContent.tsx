import { Text } from '@/components/ui/text';

interface FeedContentProps {
  content: string;
  numberOfLines?: number;
}

export function FeedContent({ content, numberOfLines }: FeedContentProps) {
  return (
    <Text className="mb-3" numberOfLines={numberOfLines}>
      {content}
    </Text>
  );
}
