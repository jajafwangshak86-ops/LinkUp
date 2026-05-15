import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowUpRight, ArrowDownLeft, QrCode, Users } from 'lucide-react-native';
import { router } from 'expo-router';

const quickActions = [
  {
    id: '1',
    title: 'Scan QR Code',
    description: 'Pay with camera',
    icon: QrCode,
    route: '/pay/scan',
    color: 'bg-purple-100',
  },
  {
    id: '2',
    title: 'Pay from Contacts',
    description: 'Choose from your network',
    icon: Users,
    route: '/pay/contacts',
    color: 'bg-purple-100',
  },
];

export default function PayScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-4 pt-12">
          <Text className="text-3xl font-bold">Pay</Text>
        </View>

        {/* Send or Receive */}
        <View className="mt-6 px-4">
          <Text className="mb-4 text-muted-foreground">Send or receive money instantly</Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => router.push('/wallet/send')}
              className="flex-1 rounded-3xl bg-purple-600 p-6"
            >
              <Icon as={ArrowUpRight} size={32} className="text-white" />
              <Text className="mt-4 text-xl font-bold text-white">Send</Text>
              <Text className="mt-1 text-sm text-purple-200">Transfer to anyone</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/wallet/receive')}
              className="flex-1 rounded-3xl bg-card p-6"
            >
              <Icon as={ArrowDownLeft} size={32} className="text-foreground" />
              <Text className="mt-4 text-xl font-bold">Receive</Text>
              <Text className="mt-1 text-sm text-muted-foreground">Get paid easily</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mt-8 px-4">
          <Text className="mb-4 text-xl font-bold">Quick Actions</Text>
          <View className="gap-3">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => router.push(action.route as any)}
                className="flex-row items-center gap-4 rounded-2xl bg-card p-4"
              >
                <View className={`h-12 w-12 items-center justify-center rounded-full ${action.color}`}>
                  <Icon as={action.icon} size={24} className="text-purple-600" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold">{action.title}</Text>
                  <Text className="text-sm text-muted-foreground">{action.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
