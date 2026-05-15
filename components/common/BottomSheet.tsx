import { Modal, View, TouchableOpacity, ScrollView } from 'react-native';
import { ReactNode } from 'react';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  scrollable?: boolean;
}

export function BottomSheet({ visible, onClose, children, scrollable = false }: BottomSheetProps) {
  const content = (
    <View className="rounded-t-3xl bg-background pb-8">
      {/* Handle */}
      <View className="items-center py-4">
        <View className="h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
      </View>
      {children}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 justify-end bg-black/50"
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          {scrollable ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {content}
            </ScrollView>
          ) : (
            content
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
