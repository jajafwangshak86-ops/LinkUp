import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="mb-8">
      <Text className="mb-2 text-3xl font-bold text-foreground">{title}</Text>
      <Text className="text-base text-muted-foreground">{subtitle}</Text>
    </View>
  );
}
