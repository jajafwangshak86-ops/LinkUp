import { View } from 'react-native';
import { Text } from '@/components/ui/text';

type TxStatus = 'pending' | 'success' | 'failed' | 'abort_by_response';

interface TxStatusBadgeProps {
  status: TxStatus;
}

const CONFIG: Record<TxStatus, { label: string; color: string; dot: string }> = {
  pending:           { label: 'Pending',   color: 'bg-yellow-100 dark:bg-yellow-950', dot: 'bg-yellow-500' },
  success:           { label: 'Confirmed', color: 'bg-green-100 dark:bg-green-950',   dot: 'bg-green-500'  },
  failed:            { label: 'Failed',    color: 'bg-red-100 dark:bg-red-950',       dot: 'bg-red-500'    },
  abort_by_response: { label: 'Aborted',   color: 'bg-red-100 dark:bg-red-950',       dot: 'bg-red-500'    },
};

export function TxStatusBadge({ status }: TxStatusBadgeProps) {
  const cfg = CONFIG[status] ?? CONFIG.pending;
  return (
    <View className={`flex-row items-center gap-1.5 self-start rounded-full px-3 py-1 ${cfg.color}`}>
      <View className={`h-2 w-2 rounded-full ${cfg.dot}`} />
      <Text className="text-xs font-medium">{cfg.label}</Text>
    </View>
  );
}
