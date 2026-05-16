import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { toast } from 'sonner-native';
import { uploadImage } from '@/lib/upload';

export function useImagePicker() {
  const [isUploading, setIsUploading] = useState(false);

  const pickAndUpload = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toast.error('Photo library permission required');
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return null;

    setIsUploading(true);
    try {
      const url = await uploadImage(result.assets[0].uri);
      return url;
    } catch {
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      toast.error('Camera permission required');
      return null;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (result.canceled || !result.assets[0]) return null;

    setIsUploading(true);
    try {
      return await uploadImage(result.assets[0].uri);
    } catch {
      toast.error('Failed to upload photo');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { pickAndUpload, takePhoto, isUploading };
}
