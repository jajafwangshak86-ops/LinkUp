import { Text } from '@/components/ui/text';

interface TokenBadgeProps {
  isTokenized?: boolean;
}

export function TokenBadge({ isTokenized }: TokenBadgeProps) {
  if (!isTokenized) return null;

  return (
    <Text className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
      🪙 Tokenized
    </Text>
  );
}
