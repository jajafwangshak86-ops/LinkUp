import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface PillProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const VARIANTS = {
  default: 'bg-gray-100 dark:bg-gray-800',
  success: 'bg-green-100 dark:bg-green-950',
  warning: 'bg-yellow-100 dark:bg-yellow-950',
  danger:  'bg-red-100 dark:bg-red-950',
  info:    'bg-blue-100 dark:bg-blue-950',
};

const TEXT_VARIANTS = {
  default: 'text-gray-700 dark:text-gray-300',
  success: 'text-green-700 dark:text-green-300',
  warning: 'text-yellow-700 dark:text-yellow-300',
  danger:  'text-red-700 dark:text-red-300',
  info:    'text-blue-700 dark:text-blue-300',
};

export function Pill({ label, variant = 'default' }: PillProps) {
  return (
    <View className={`self-start rounded-full px-3 py-1 ${VARIANTS[variant]}`}>
      <Text className={`text-xs font-medium ${TEXT_VARIANTS[variant]}`}>{label}</Text>
    </View>
  );
}
