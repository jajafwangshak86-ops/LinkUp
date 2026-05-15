import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react-native';

interface TokenCardProps {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h?: number;
  icon?: LucideIcon;
  onPress?: () => void;
}

export function TokenCard({
  symbol,
  name,
  balance,
  value,
  change24h = 0,
  icon: IconComponent,
  onPress,
}: TokenCardProps) {
  const isPositive = change24h >= 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-3 rounded-2xl bg-card p-4"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {IconComponent && (
            <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Icon as={IconComponent} size={24} className="text-purple-600 dark:text-purple-300" />
            </View>
          )}
          <View>
            <Text className="font-semibold">{symbol}</Text>
            <Text className="text-sm text-muted-foreground">{name}</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="font-semibold">{balance.toFixed(4)}</Text>
          <Text className="text-sm text-muted-foreground">${value.toFixed(2)}</Text>
          {change24h !== 0 && (
            <View className="flex-row items-center gap-1">
              <Icon
                as={isPositive ? TrendingUp : TrendingDown}
                size={12}
                className={isPositive ? 'text-green-600' : 'text-red-600'}
              />
              <Text className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{change24h.toFixed(2)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
