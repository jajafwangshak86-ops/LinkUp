import { View, Image } from 'react-native';

interface FeedImagesProps {
  images: string[];
}

export function FeedImages({ images }: FeedImagesProps) {
  if (!images || images.length === 0) return null;

  return (
    <View className="mb-3 flex-row flex-wrap gap-2">
      {images.slice(0, 4).map((img, idx) => (
        <Image
          key={idx}
          source={{ uri: img }}
          className={`rounded-xl ${
            images.length === 1
              ? 'h-64 w-full'
              : images.length === 2
              ? 'h-48 w-[48%]'
              : 'h-32 w-[48%]'
          }`}
          resizeMode="cover"
        />
      ))}
    </View>
  );
}
