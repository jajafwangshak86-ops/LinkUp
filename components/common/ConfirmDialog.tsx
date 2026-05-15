import { Modal, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { AlertTriangle } from 'lucide-react-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm rounded-3xl bg-background p-6">
          {destructive && (
            <View className="mb-4 items-center">
              <Icon as={AlertTriangle} size={48} className="text-red-500" />
            </View>
          )}
          <Text className="mb-2 text-center text-xl font-bold">{title}</Text>
          <Text className="mb-6 text-center text-muted-foreground">{message}</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 rounded-full bg-gray-200 dark:bg-gray-800 py-3"
            >
              <Text className="text-center font-semibold">{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 rounded-full py-3 ${
                destructive ? 'bg-red-600' : 'bg-purple-600'
              }`}
            >
              <Text className="text-center font-semibold text-white">{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
