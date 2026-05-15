import { View, ScrollView, TouchableOpacity, Share, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft, Copy, Share2, Download } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { toast } from 'sonner-native';
import * as Clipboard from 'expo-clipboard';
import { useWallet } from '@/hooks/useWallet';

export default function ReceiveMoneyScreen() {
  const { walletAddress, balance } = useWallet();
  const [showAddress, setShowAddress] = useState(false);

  const copyToClipboard = async () => {
    if (walletAddress) {
      await Clipboard.setStringAsync(walletAddress);
      toast.success('Address copied to clipboard');
    }
  };

  const shareAddress = async () => {
    if (!walletAddress) return;
    
    try {
      await Share.share({
        message: `Send STX to my wallet:\n${walletAddress}`,
        title: 'My Stacks Wallet Address',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center gap-3 px-4 pt-12">
          <TouchableOpacity onPress={() => router.back()}>
            <Icon as={ArrowLeft} size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">Receive STX</Text>
        </View>

        {/* Balance Display */}
        <View className="mx-4 mt-6 rounded-2xl bg-purple-50 p-4">
          <Text className="text-sm text-muted-foreground">Current Balance</Text>
          <Text className="mt-1 text-2xl font-bold text-purple-600">{balance.toFixed(4)} STX</Text>
        </View>

        {/* QR Code Section */}
        <View className="mt-8 items-center px-4">
          {showAddress ? (
            <View className="w-full items-center rounded-3xl bg-card p-6">
              <Text className="text-sm text-muted-foreground">Your Wallet Address</Text>
              <View className="mt-4 w-full rounded-2xl bg-gray-50 p-4">
                <Text className="break-all font-mono text-sm text-foreground">
                  {walletAddress}
                </Text>
              </View>
              
              <View className="mt-6 w-full flex-row gap-3">
                <TouchableOpacity 
                  onPress={copyToClipboard}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-purple-600 py-3"
                >
                  <Icon as={Copy} size={18} className="text-white" />
                  <Text className="font-semibold text-white">Copy</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={shareAddress}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-purple-600 py-3"
                >
                  <Icon as={Share2} size={18} className="text-white" />
                  <Text className="font-semibold text-white">Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="items-center rounded-3xl bg-card p-8">
              <View className="rounded-2xl bg-white p-6 shadow-lg">
                {walletAddress ? (
                  <QRCode
                    value={walletAddress}
                    size={240}
                    backgroundColor="white"
                    color="black"
                  />
                ) : (
                  <View className="h-60 w-60 items-center justify-center">
                    <Text className="text-muted-foreground">Loading...</Text>
                  </View>
                )}
              </View>
              <Text className="mt-6 text-center text-sm text-muted-foreground">
                Scan this QR code to send STX to this wallet
              </Text>
              
              {/* Wallet Address Preview */}
              <View className="mt-4 rounded-xl bg-gray-50 px-4 py-2">
                <Text className="font-mono text-xs text-muted-foreground">
                  {walletAddress ? shortenAddress(walletAddress) : ''}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Toggle Button */}
        <View className="mt-6 px-4">
          <TouchableOpacity
            onPress={() => setShowAddress(!showAddress)}
            className="items-center rounded-2xl bg-purple-100 py-4"
          >
            <Text className="font-semibold text-purple-600">
              {showAddress ? 'Show QR Code' : 'Show Full Address'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="mt-6 px-4">
          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={copyToClipboard}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-2 border-purple-600 py-3"
            >
              <Icon as={Copy} size={18} className="text-purple-600" />
              <Text className="font-semibold text-purple-600">Copy Address</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={shareAddress}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3"
            >
              <Icon as={Share2} size={18} className="text-white" />
              <Text className="font-semibold text-white">Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How to Receive */}
        <View className="mt-6 px-4 pb-6">
          <View className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-6">
            <Text className="text-lg font-semibold text-purple-900">How to Receive STX</Text>
            <View className="mt-4 gap-3">
              <View className="flex-row gap-3">
                <View className="h-6 w-6 items-center justify-center rounded-full bg-purple-600">
                  <Text className="text-xs font-bold text-white">1</Text>
                </View>
                <Text className="flex-1 text-sm text-muted-foreground">
                  Share your wallet address or QR code with the sender
                </Text>
              </View>
              
              <View className="flex-row gap-3">
                <View className="h-6 w-6 items-center justify-center rounded-full bg-purple-600">
                  <Text className="text-xs font-bold text-white">2</Text>
                </View>
                <Text className="flex-1 text-sm text-muted-foreground">
                  Sender enters the amount and confirms the transaction
                </Text>
              </View>
              
              <View className="flex-row gap-3">
                <View className="h-6 w-6 items-center justify-center rounded-full bg-purple-600">
                  <Text className="text-xs font-bold text-white">3</Text>
                </View>
                <Text className="flex-1 text-sm text-muted-foreground">
                  Funds arrive in your wallet within seconds on Stacks
                </Text>
              </View>
            </View>
          </View>

          {/* Network Info */}
          <View className="mt-4 rounded-2xl bg-gray-50 p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">Network</Text>
              <Text className="text-sm font-medium">Stacks Testnet</Text>
            </View>
            <View className="mt-2 flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">Transaction Speed</Text>
              <Text className="text-sm font-medium">~10s</Text>
            </View>
            <View className="mt-2 flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">Network Fee</Text>
              <Text className="text-sm font-medium">~0.001 STX</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
