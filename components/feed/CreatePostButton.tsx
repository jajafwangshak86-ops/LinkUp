import { TouchableOpacity } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';

interface CreatePostButtonProps {
  onPress?: () => void;
}

export function CreatePostButton({ onPress }: CreatePostButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to create post screen (to be implemented)
      console.log('Create post');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-purple-600 shadow-lg"
      style={{
        shadowColor: '#9333ea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Icon as={Plus} size={28} className="text-white" />
    </TouchableOpacity>
  );
}
