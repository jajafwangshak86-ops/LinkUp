import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft, User, Bell, Lock, Shield, HelpCircle, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { BiometricSettings, TwoFactorSettings, LanguageSelector } from '@/components/settings';

export default function SettingsScreen() {
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border bg-card px-4 pb-4 pt-12">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Icon as={ArrowLeft} size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">Settings</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View className="px-4 pt-6">
          <Text className="mb-3 text-sm font-semibold text-muted-foreground">ACCOUNT</Text>
          
          <View className="gap-3">
            <TouchableOpacity className="flex-row items-center justify-between rounded-2xl bg-card p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                  <Icon as={User} size={20} className="text-purple-600 dark:text-purple-300" />
                </View>
                <View>
                  <Text className="font-semibold">Profile Settings</Text>
                  <Text className="text-sm text-muted-foreground">Edit your profile information</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between rounded-2xl bg-card p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Icon as={Bell} size={20} className="text-blue-600 dark:text-blue-300" />
                </View>
                <View>
                  <Text className="font-semibold">Notifications</Text>
                  <Text className="text-sm text-muted-foreground">Manage notification preferences</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="mt-3">
            <LanguageSelector />
          </View>
        </View>

        {/* Security Section */}
        <View className="px-4 pt-6">
          <Text className="mb-3 text-sm font-semibold text-muted-foreground">SECURITY</Text>
          
          <View className="gap-3">
            <BiometricSettings />

            <TwoFactorSettings />

            <TouchableOpacity className="flex-row items-center justify-between rounded-2xl bg-card p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <Icon as={Lock} size={20} className="text-green-600 dark:text-green-300" />
                </View>
                <View>
                  <Text className="font-semibold">Change Password</Text>
                  <Text className="text-sm text-muted-foreground">Update your password</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between rounded-2xl bg-card p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                  <Icon as={Shield} size={20} className="text-orange-600 dark:text-orange-300" />
                </View>
                <View>
                  <Text className="font-semibold">Privacy</Text>
                  <Text className="text-sm text-muted-foreground">Control your privacy settings</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View className="px-4 pt-6">
          <Text className="mb-3 text-sm font-semibold text-muted-foreground">HELP & SUPPORT</Text>
          
          <View className="gap-3">
            <TouchableOpacity className="flex-row items-center justify-between rounded-2xl bg-card p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Icon as={HelpCircle} size={20} className="text-gray-600 dark:text-gray-300" />
                </View>
                <View>
                  <Text className="font-semibold">Help & Support</Text>
                  <Text className="text-sm text-muted-foreground">Get help with your account</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out */}
        <View className="px-4 py-6">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-red-50 p-4 dark:bg-red-950/30"
          >
            <Icon as={LogOut} size={20} className="text-red-600" />
            <Text className="font-semibold text-red-600">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
