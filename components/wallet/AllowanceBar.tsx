import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface AllowanceBarProps {
  used: number;   // in STX
  limit?: number; // in STX
}

export function AllowanceBar({ used, limit = 1000 }: AllowanceBarProps) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <View className="mx-4 mt-3 rounded-2xl bg-card p-4">
      <View className="flex-row justify-between">
        <Text className="text-xs text-muted-foreground">Daily limit used</Text>
        <Text className="text-xs font-semibold">{used.toFixed(2)} / {limit} STX</Text>
      </View>
      <View className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <View className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </View>
      <Text className="mt-1 text-xs text-muted-foreground">
        {(limit - used).toFixed(2)} STX remaining today
      </Text>
    </View>
  );
}
