import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  subtitle?: string;
}

export function EmptyState({ icon, message, subtitle }: EmptyStateProps) {
  return (
    <View className="items-center py-20">
      <Icon as={icon} size={64} className="text-muted-foreground" />
      <Text className="mt-4 text-muted-foreground">{message}</Text>
      {subtitle && (
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
