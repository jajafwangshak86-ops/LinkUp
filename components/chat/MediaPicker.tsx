import { View, TouchableOpacity } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Image as ImageIcon, Camera } from 'lucide-react-native';
import { useImagePicker } from '@/hooks/useImagePicker';
import { ActivityIndicator } from 'react-native';

interface MediaPickerProps {
  onImageSelected: (url: string) => void;
}

export function MediaPicker({ onImageSelected }: MediaPickerProps) {
  const { pickAndUpload, takePhoto, isUploading } = useImagePicker();

  const handleGallery = async () => {
    const url = await pickAndUpload();
    if (url) onImageSelected(url);
  };

  const handleCamera = async () => {
    const url = await takePhoto();
    if (url) onImageSelected(url);
  };

  if (isUploading) {
    return (
      <View className="h-10 w-10 items-center justify-center">
        <ActivityIndicator size="small" color="#9333ea" />
      </View>
    );
  }

  return (
    <View className="flex-row gap-1">
      <TouchableOpacity onPress={handleGallery}
        className="h-10 w-10 items-center justify-center rounded-full bg-card">
        <Icon as={ImageIcon} size={18} className="text-muted-foreground" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCamera}
        className="h-10 w-10 items-center justify-center rounded-full bg-card">
        <Icon as={Camera} size={18} className="text-muted-foreground" />
      </TouchableOpacity>
    </View>
  );
}
