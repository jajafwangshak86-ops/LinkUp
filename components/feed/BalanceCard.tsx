import { View, TouchableOpacity, ImageBackground, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Eye, EyeOff, Copy, RefreshCw, Bell, ArrowUpRight, ArrowDownLeft, Circle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Badge } from '@/components/common/Badge';
import { useTranslation } from 'react-i18next';

interface BalanceCardProps {
  balance: number;
  walletAddress: string;
  isLoading: boolean;
  showBalance: boolean;
  unreadCount: number;
  onToggleBalance: () => void;
  onCopyAddress: () => void;
  onRefresh: () => void;
}

export function BalanceCard({
  balance,
  walletAddress,
  isLoading,
  showBalance,
  unreadCount,
  onToggleBalance,
  onCopyAddress,
  onRefresh,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isSmall = width < 375;
  
  return (
    <View className="overflow-hidden rounded-b-3xl bg-purple-600 shadow-lg">
      <ImageBackground
        source={require('@/assets/images/wrapper.png')}
        resizeMode="cover"
        imageStyle={{ opacity: 0.1 }}
      >
        <View className="p-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-purple-200">{t('wallet.totalBalance')}</Text>
                <TouchableOpacity onPress={onToggleBalance} className="rounded-full p-1">
                  <Icon as={showBalance ? Eye : EyeOff} size={16} className="text-purple-200" />
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <ActivityIndicator size="large" color="#ffffff" className="mt-2" />
              ) : (
                <Text className={`mt-1 ${isSmall ? 'text-3xl' : 'text-4xl'} font-bold text-white`}>
                  {showBalance ? `${balance.toFixed(2)} SOL` : '••••••'}
                </Text>
              )}

              <Pressable onPress={onCopyAddress} className="mt-2 flex-row items-center gap-2 rounded-lg p-1">
                <Text className="text-sm text-purple-200">
                  {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
                </Text>
                <Icon as={Copy} size={14} className="text-purple-200" />
              </Pressable>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={onRefresh}
                disabled={isLoading}
                className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
              >
                <Icon as={RefreshCw} size={18} className="text-white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/notifications')}
                className="relative h-10 w-10 items-center justify-center rounded-full bg-white/20"
              >
                <Icon as={Bell} size={18} className="text-white" />
                {unreadCount > 0 && (
                  <View className="absolute right-0 top-0">
                    <Badge count={unreadCount} variant="danger" size="sm" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push('/wallet/send')}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-white py-3.5 shadow-sm"
            >
              <Icon as={ArrowUpRight} size={18} className="text-purple-600" />
              <Text className="font-semibold text-purple-600">{t('common.send')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/wallet/receive')}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-purple-700 py-3.5 shadow-sm"
            >
              <Icon as={ArrowDownLeft} size={18} className="text-white" />
              <Text className="font-semibold text-white">{t('common.receive')}</Text>
            </TouchableOpacity>
          </View>

          {/* Network Badge */}
          <View className="mt-4 flex-row items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1.5">
            <Icon as={Circle} size={8} className="text-green-400" fill="#4ade80" />
            <Text className="text-xs font-medium text-white">{t('wallet.solanaDevnet')}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
