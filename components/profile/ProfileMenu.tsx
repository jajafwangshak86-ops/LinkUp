import { Modal, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Share, Edit, Settings } from 'lucide-react-native';
import { router } from 'expo-router';

interface ProfileMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileMenu({ visible, onClose }: ProfileMenuProps) {
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
        <View className="rounded-t-3xl bg-background pb-8">
          {/* Handle */}
          <View className="items-center py-4">
            <View className="h-1 w-12 rounded-full bg-gray-300" />
          </View>

          {/* Menu Items */}
          <TouchableOpacity
            onPress={() => {
              onClose();
              // Handle share
            }}
            className="flex-row items-center gap-4 border-b border-border px-6 py-5"
          >
            <Icon as={Share} size={24} className="text-foreground" />
            <Text className="text-lg font-semibold">Share Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onClose();
              router.push('/profile/edit');
            }}
            className="flex-row items-center gap-4 border-b border-border px-6 py-5"
          >
            <Icon as={Edit} size={24} className="text-foreground" />
            <Text className="text-lg font-semibold">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onClose();
              router.push('/settings');
            }}
            className="flex-row items-center gap-4 px-6 py-5"
          >
            <Icon as={Settings} size={24} className="text-foreground" />
            <Text className="text-lg font-semibold">Settings</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
