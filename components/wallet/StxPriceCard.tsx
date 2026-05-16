import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useStxPrice } from '@/hooks/useStxPrice';

export function StxPriceCard() {
  const { data, isLoading } = useStxPrice();
  const isUp = (data?.change24h ?? 0) >= 0;

  return (
    <View className="mx-4 mt-3 flex-row items-center justify-between rounded-2xl bg-card px-4 py-3">
      <View>
        <Text className="text-xs text-muted-foreground">STX / USD</Text>
        <Text className="text-lg font-bold">
          {isLoading ? '...' : `$${data?.usd.toFixed(4)}`}
        </Text>
      </View>
      <View className={`flex-row items-center gap-1 rounded-full px-3 py-1 ${
        isUp ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'
      }`}>
        <Icon
          as={isUp ? TrendingUp : TrendingDown}
          size={14}
          className={isUp ? 'text-green-600' : 'text-red-600'}
        />
        <Text className={`text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
          {isLoading ? '...' : `${data?.change24h.toFixed(2)}%`}
        </Text>
      </View>
    </View>
  );
}
