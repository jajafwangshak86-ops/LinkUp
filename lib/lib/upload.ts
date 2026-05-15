import * as ImageManipulator from 'expo-image-manipulator';
import { api } from './api';

export async function convertImageToBase64(uri: string): Promise<string> {
  try {
    // Manipulate image to get base64 with aggressive optimization
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], // Resize to max width 800px (smaller for faster upload)
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true } // Lower compression for smaller size
    );
    
    if (!manipResult.base64) {
      throw new Error('Failed to convert image to base64');
    }
    
    // Add data URI prefix
    return `data:image/jpeg;base64,${manipResult.base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image');
  }
}

export async function uploadImage(uri: string): Promise<string> {
  try {
    const base64Image = await convertImageToBase64(uri);
    const response = await api.uploadImage(base64Image);
    
    if (response.error) {
      console.error('Upload API error:', response.error);
      throw new Error(response.error);
    }
    
    if (!response.data) {
      console.error('No data in response:', response);
      throw new Error('No URL returned from server');
    }
    
    return (response.data as { url: string }).url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function uploadMultipleImages(uris: string[]): Promise<string[]> {
  try {
    // Upload images one by one to avoid payload size issues
    const urls: string[] = [];
    
    for (const uri of uris) {
      const url = await uploadImage(uri);
      urls.push(url);
    }
    
    return urls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}
