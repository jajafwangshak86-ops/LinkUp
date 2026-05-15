import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { AlertCircle, RefreshCw } from 'lucide-react-native';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <View className="items-center py-20">
      <Icon as={AlertCircle} size={64} className="text-red-500" />
      <Text className="mt-4 text-center text-muted-foreground">{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="mt-4 flex-row items-center gap-2 rounded-full bg-purple-600 px-6 py-3"
        >
          <Icon as={RefreshCw} size={18} className="text-white" />
          <Text className="font-semibold text-white">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
