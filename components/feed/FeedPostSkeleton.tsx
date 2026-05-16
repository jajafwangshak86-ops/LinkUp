import { View } from 'react-native';

export function FeedPostSkeleton() {
  return (
    <View className="border-b border-border bg-card p-4 animate-pulse">
      <View className="flex-row gap-3">
        <View className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
        <View className="flex-1 gap-2">
          <View className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <View className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <View className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <View className="mt-2 flex-row gap-4">
            <View className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <View className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <View className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          </View>
        </View>
      </View>
    </View>
  );
}
