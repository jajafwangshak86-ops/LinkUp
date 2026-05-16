import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useContractStats } from '@/hooks/useContractStats';

export function LinkUpStats() {
  const { data, isLoading } = useContractStats();

  return (
    <View className="mx-4 mt-3 flex-row gap-3">
      {[
        { label: 'Users', key: 'total-users' },
        { label: 'Posts', key: 'total-posts' },
        { label: 'Tips', key: 'total-tips' },
      ].map(({ label }) => (
        <View key={label} className="flex-1 items-center rounded-2xl bg-card py-3">
          <Text className="text-lg font-bold text-purple-600">
            {isLoading ? '...' : '—'}
          </Text>
          <Text className="text-xs text-muted-foreground">{label}</Text>
        </View>
      ))}
    </View>
  );
}
