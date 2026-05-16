import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Rss, PlusCircle } from 'lucide-react-native';

export function EmptyFeed({ onCreatePost }: { onCreatePost: () => void }) {
  return (
    <View className="flex-1 items-center justify-center py-20 px-8">
      <Icon as={Rss} size={48} className="text-muted-foreground" />
      <Text className="mt-4 text-lg font-semibold text-center">No posts yet</Text>
      <Text className="mt-2 text-center text-sm text-muted-foreground">
        Be the first to post on LinkUp — your content is anchored to Bitcoin via Stacks.
      </Text>
      <TouchableOpacity
        onPress={onCreatePost}
        className="mt-6 flex-row items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3"
      >
        <Icon as={PlusCircle} size={18} className="text-white" />
        <Text className="font-semibold text-white">Create First Post</Text>
      </TouchableOpacity>
    </View>
  );
}
