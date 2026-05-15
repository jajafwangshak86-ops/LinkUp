import { TouchableOpacity, View, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';

export function MiniAppsCard() {
  return (
    <TouchableOpacity
      onPress={() => router.push('/mini-apps')}
      className="mx-4 mt-4 relative overflow-hidden rounded-2xl bg-purple-600 dark:bg-purple-700"
    >
      <Image source={require('@/assets/images/ec1.png')} className='absolute w-[57px] h-[57px] bottom-0 left-0'/>
      <Image source={require('@/assets/images/ec3.png')} className='absolute w-[57px] h-[57px] -bottom-8 right-[120px] rounded-full'/>
      <Image source={require('@/assets/images/ec3.png')} className='absolute w-[19px] h-[19px] bottom-2 right-[160px] rounded-full'/>
      <Image source={require('@/assets/images/ec3.png')} className='absolute w-[19px] h-[19px] top-2 right-[160px] rounded-full'/>
      <Image source={require('@/assets/images/ec2.png')} className='absolute w-[95px] rounded-full h-[95px] -top-16 left-10'/>
      <View className="p-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Icon as={Sparkles} size={24} className="text-white" />
              <Text className="text-xl font-bold text-white">Explore Mini Apps</Text>
            </View>
            <Text className="mt-2 text-sm text-white/90">
              Swap, mint, games & more
            </Text>
            <View className="mt-3 flex-row items-center gap-2">
              <View className="rounded-full bg-white/20 px-3 py-1">
                <Text className="text-xs font-medium text-white">Coming Soon</Text>
              </View>
              <Icon as={ArrowRight} size={14} className="text-white/80" />
            </View>
          </View>
          <Image source={require('@/assets/images/mini.png')} className='w-[96px] h-[101px]'/>
        </View>
      </View>
    </TouchableOpacity>
  );
}
