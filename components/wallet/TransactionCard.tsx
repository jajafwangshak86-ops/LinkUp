import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';

interface TransactionCardProps {
  type: 'send' | 'receive' | 'swap';
  amount: number;
  token: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  from?: string;
  to?: string;
  onPress?: () => void;
}

export function TransactionCard({
  type,
  amount,
  token,
  timestamp,
  status,
  from,
  to,
  onPress,
}: TransactionCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'send':
        return ArrowUpRight;
      case 'receive':
        return ArrowDownLeft;
      case 'swap':
        return RefreshCw;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'send':
        return 'text-red-600';
      case 'receive':
        return 'text-green-600';
      case 'swap':
        return 'text-purple-600';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
    }
  };

  const formatTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-3 rounded-2xl bg-card p-4"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className={`h-10 w-10 items-center justify-center rounded-full ${
            type === 'send' ? 'bg-red-100 dark:bg-red-950' :
            type === 'receive' ? 'bg-green-100 dark:bg-green-950' :
            'bg-purple-100 dark:bg-purple-950'
          }`}>
            <Icon as={getIcon()} size={20} className={getColor()} />
          </View>
          <View>
            <Text className="font-semibold capitalize">{type}</Text>
            <Text className="text-sm text-muted-foreground">{formatTime(timestamp)}</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className={`font-semibold ${getColor()}`}>
            {type === 'send' ? '-' : '+'}{amount.toFixed(4)} {token}
          </Text>
          <Text className={`text-xs ${getStatusColor()}`}>
            {status}
          </Text>
        </View>
      </View>

      {(from || to) && (
        <View className="mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2">
          {from && (
            <Text className="text-xs text-muted-foreground">
              From: {from.slice(0, 8)}...{from.slice(-6)}
            </Text>
          )}
          {to && (
            <Text className="text-xs text-muted-foreground">
              To: {to.slice(0, 8)}...{to.slice(-6)}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
