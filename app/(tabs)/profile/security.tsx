import { View, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft, Lock, Shield, Key, Eye, EyeOff, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { toast } from 'sonner-native';

export default function SecurityPrivacyScreen() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center gap-3 px-4 pt-12">
          <TouchableOpacity onPress={() => router.back()}>
            <Icon as={ArrowLeft} size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">Security & Privacy</Text>
        </View>

        {/* Security Settings */}
        <View className="mt-6 px-4">
          <Text className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            AUTHENTICATION
          </Text>

          <View className="mb-3 flex-row items-center gap-4 rounded-2xl bg-card p-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={Shield} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Two-Factor Authentication</Text>
              <Text className="text-sm text-muted-foreground">
                Add extra security to your account
              </Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={(value) => {
                setTwoFactorEnabled(value);
                toast.success(value ? '2FA enabled' : '2FA disabled');
              }}
              trackColor={{ false: '#d1d5db', true: '#9333ea' }}
              thumbColor="#ffffff"
            />
          </View>

          <View className="flex-row items-center gap-4 rounded-2xl bg-card p-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={Key} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Biometric Login</Text>
              <Text className="text-sm text-muted-foreground">
                Use fingerprint or face ID
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={(value) => {
                setBiometricEnabled(value);
                toast.success(value ? 'Biometric enabled' : 'Biometric disabled');
              }}
              trackColor={{ false: '#d1d5db', true: '#9333ea' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Change Password */}
        <View className="mt-6 px-4">
          <Text className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            CHANGE PASSWORD
          </Text>

          {/* Current Password */}
          <View className="mb-3">
            <Text className="mb-2 text-sm font-semibold text-muted-foreground">
              Current Password
            </Text>
            <View className="flex-row items-center rounded-2xl bg-card px-4">
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showCurrentPassword}
                className="flex-1 py-4 text-base text-foreground"
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Icon
                  as={showCurrentPassword ? EyeOff : Eye}
                  size={20}
                  className="text-muted-foreground"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View className="mb-3">
            <Text className="mb-2 text-sm font-semibold text-muted-foreground">
              New Password
            </Text>
            <View className="flex-row items-center rounded-2xl bg-card px-4">
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showNewPassword}
                className="flex-1 py-4 text-base text-foreground"
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Icon
                  as={showNewPassword ? EyeOff : Eye}
                  size={20}
                  className="text-muted-foreground"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View className="mb-3">
            <Text className="mb-2 text-sm font-semibold text-muted-foreground">
              Confirm New Password
            </Text>
            <View className="rounded-2xl bg-card p-4">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="text-base text-foreground"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleChangePassword}
            className="items-center rounded-2xl bg-purple-600 py-4"
          >
            <Text className="text-lg font-semibold text-white">Update Password</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet Security */}
        <View className="mt-6 px-4 pb-6">
          <Text className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            WALLET SECURITY
          </Text>

          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/profile/recovery-phrase')}
            className="mb-3 flex-row items-center gap-4 rounded-2xl bg-card p-4"
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={Lock} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Recovery Phrase</Text>
              <Text className="text-sm text-muted-foreground">
                View wallet information and security
              </Text>
            </View>
            <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-4 rounded-2xl bg-card p-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Icon as={Shield} size={24} className="text-purple-600" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Connected Apps</Text>
              <Text className="text-sm text-muted-foreground">
                Manage apps with wallet access
              </Text>
            </View>
            <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
