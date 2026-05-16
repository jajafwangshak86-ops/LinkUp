import {
  View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator, RefreshControl, Modal, Image, Pressable, Alert,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft, Send, DollarSign, X, Image as ImageIcon, Copy, Eye, EyeOff } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { useMessages, useChat } from '@/hooks/useChats';
import type { Message } from '@/types';
import { formatChatTime } from '@/lib/format';
import { PusherStatus } from '@/components/PusherStatus';
import { GaiaStatusBadge } from '@/components/common';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { toast } from 'sonner-native';
import { uploadImage } from '@/lib/upload';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: chat, isLoading: isLoadingChat } = useChat(id);
  const { messages, isLoading, refetch, sendMessage, isSendingMessage, sendTip, isSendingTip } = useMessages(id);
  const [message, setMessage] = useState('');
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [isViewOnce, setIsViewOnce] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  // Track which view-once messages have been opened
  const [openedViewOnce, setOpenedViewOnce] = useState<Set<string>>(new Set());
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || isSendingMessage) return;
    sendMessage({ content: message, viewOnce: isViewOnce });
    setMessage('');
    setIsViewOnce(false);
  };

  const handleSendTip = () => {
    const amount = parseFloat(tipAmount);
    if (!amount || amount <= 0 || isSendingTip) return;
    sendTip(amount);
    setTipAmount('');
    setShowTipModal(false);
  };

  // Copy message text to clipboard
  const handleCopyMessage = async (text: string) => {
    await Clipboard.setStringAsync(text);
    toast.success('Copied to clipboard');
  };

  // Paste from clipboard into input
  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) setMessage(prev => prev + text);
  };

  // Pick and send image
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toast.error('Photo library permission required');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;

    setIsUploadingImage(true);
    try {
      const url = await uploadImage(result.assets[0].uri);
      sendMessage({ content: url, type: 'image', viewOnce: isViewOnce });
      setIsViewOnce(false);
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Open a view-once message (can only be seen once)
  const handleOpenViewOnce = (msgId: string) => {
    Alert.alert(
      'View Once',
      'This message can only be viewed once. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'View',
          onPress: () => setOpenedViewOnce(prev => new Set([...prev, msgId])),
        },
      ]
    );
  };

  const formatTime = (date: string | number) => {
    try {
      const d = new Date(typeof date === 'number' ? date : date);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch { return ''; }
  };

  const otherParticipant = chat?.otherParticipant;

  const renderMessage = (msg: Message) => {
    const isViewOnceMsg = (msg as any).viewOnce;
    const hasOpened = openedViewOnce.has(msg.id);

    if (msg.type === 'payment') {
      return (
        <View className="flex-row items-center gap-2">
          {!msg.isMine && <AvatarBubble participant={otherParticipant} />}
          <View className="rounded-2xl bg-green-100 dark:bg-green-950 p-4">
            <View className="flex-row items-center gap-2">
              <Icon as={DollarSign} size={16} className="text-green-600" />
              <Text className="font-semibold text-green-600">
                {msg.isMine ? 'Sent' : 'Received'} {msg.paymentAmount} STX
              </Text>
            </View>
            <Text className="mt-1 text-xs text-muted-foreground">{formatTime(msg.createdAt)}</Text>
          </View>
        </View>
      );
    }

    if ((msg as any).type === 'image') {
      return (
        <View className="flex-row items-end gap-2">
          {!msg.isMine && <AvatarBubble participant={otherParticipant} />}
          <View className="max-w-[75%]">
            {isViewOnceMsg && !hasOpened ? (
              <TouchableOpacity
                onPress={() => handleOpenViewOnce(msg.id)}
                className={`rounded-2xl px-4 py-3 items-center gap-2 ${msg.isMine ? 'bg-purple-600' : 'bg-card'}`}
              >
                <Icon as={Eye} size={20} className={msg.isMine ? 'text-white' : 'text-purple-600'} />
                <Text className={`text-sm font-medium ${msg.isMine ? 'text-white' : 'text-foreground'}`}>
                  View once photo
                </Text>
              </TouchableOpacity>
            ) : (
              <Image
                source={{ uri: msg.content }}
                className="h-48 w-64 rounded-2xl"
                resizeMode="cover"
              />
            )}
            <Text className={`mt-1 text-xs ${msg.isMine ? 'text-right text-muted-foreground' : 'text-muted-foreground'}`}>
              {formatTime(msg.createdAt)}{isViewOnceMsg ? ' · 👁 once' : ''}
            </Text>
          </View>
        </View>
      );
    }

    // Text message — long press to copy
    return (
      <View className="flex-row items-end gap-2">
        {!msg.isMine && <AvatarBubble participant={otherParticipant} />}
        <Pressable
          onLongPress={() => handleCopyMessage(msg.content)}
          className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.isMine ? 'bg-purple-600' : 'bg-card'}`}
        >
          {isViewOnceMsg && !hasOpened ? (
            <TouchableOpacity onPress={() => handleOpenViewOnce(msg.id)} className="flex-row items-center gap-2">
              <Icon as={EyeOff} size={16} className={msg.isMine ? 'text-white' : 'text-purple-600'} />
              <Text className={`text-sm ${msg.isMine ? 'text-white' : 'text-foreground'}`}>View once message</Text>
            </TouchableOpacity>
          ) : (
            <Text className={msg.isMine ? 'text-white' : 'text-foreground'}>{msg.content}</Text>
          )}
          <Text className={`mt-1 text-xs ${msg.isMine ? 'text-purple-200' : 'text-muted-foreground'}`}>
            {formatTime(msg.createdAt)}{isViewOnceMsg ? ' · 👁' : ''}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View className="flex-row items-center gap-3 border-b border-border px-4 pb-4 pt-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Icon as={ArrowLeft} size={24} className="text-foreground" />
        </TouchableOpacity>
        {otherParticipant?.avatar ? (
          <Image source={{ uri: otherParticipant.avatar }} className="h-10 w-10 rounded-full" />
        ) : (
          <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900">
            <Text className="font-bold text-purple-600 dark:text-purple-300">
              {otherParticipant?.name?.charAt(0)?.toUpperCase() || otherParticipant?.username?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="font-semibold">{otherParticipant?.name || otherParticipant?.username || 'Chat'}</Text>
          <Text className="text-sm text-muted-foreground">@{otherParticipant?.username || 'user'}</Text>
        </View>
        <PusherStatus compact />
        <GaiaStatusBadge />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 py-4"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {isLoading && messages.length === 0 ? (
          <View className="items-center py-20">
            <ActivityIndicator size="large" color="#9333ea" />
          </View>
        ) : messages.length === 0 ? (
          <View className="items-center py-20">
            <Text className="text-muted-foreground">No messages yet</Text>
            <Text className="mt-2 text-sm text-muted-foreground">Start the conversation!</Text>
          </View>
        ) : (
          messages.map((msg: Message) => (
            <View key={msg.id} className={`mb-4 ${msg.isMine ? 'items-end' : 'items-start'}`}>
              {renderMessage(msg)}
            </View>
          ))
        )}
      </ScrollView>

      {/* View-once toggle */}
      {isViewOnce && (
        <View className="mx-4 mb-1 flex-row items-center gap-2 rounded-xl bg-purple-100 dark:bg-purple-950 px-3 py-2">
          <Icon as={Eye} size={14} className="text-purple-600" />
          <Text className="flex-1 text-xs text-purple-700 dark:text-purple-300">View once — recipient sees this once only</Text>
          <TouchableOpacity onPress={() => setIsViewOnce(false)}>
            <Icon as={X} size={14} className="text-purple-600" />
          </TouchableOpacity>
        </View>
      )}

      {/* Input bar */}
      <View className="flex-row items-center gap-2 border-t border-border px-3 py-3">
        {/* Image picker */}
        <TouchableOpacity
          onPress={handlePickImage}
          disabled={isUploadingImage}
          className="h-10 w-10 items-center justify-center rounded-full bg-card"
        >
          {isUploadingImage
            ? <ActivityIndicator size="small" color="#9333ea" />
            : <Icon as={ImageIcon} size={20} className="text-muted-foreground" />
          }
        </TouchableOpacity>

        {/* Text input */}
        <View className="flex-1 flex-row items-center gap-2 rounded-2xl bg-card px-4 py-2">
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            className="flex-1 text-base text-foreground"
            onSubmitEditing={handleSendMessage}
            multiline
          />
          {/* Paste button */}
          <TouchableOpacity onPress={handlePaste}>
            <Icon as={Copy} size={18} className="text-muted-foreground" />
          </TouchableOpacity>
          {/* View-once toggle */}
          <TouchableOpacity onPress={() => setIsViewOnce(v => !v)}>
            <Icon as={isViewOnce ? Eye : EyeOff} size={18} className={isViewOnce ? 'text-purple-600' : 'text-muted-foreground'} />
          </TouchableOpacity>
          {/* Tip */}
          <TouchableOpacity onPress={() => setShowTipModal(true)}>
            <Icon as={DollarSign} size={18} className="text-purple-600" />
          </TouchableOpacity>
        </View>

        {/* Send */}
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={isSendingMessage || !message.trim()}
          className="h-10 w-10 items-center justify-center rounded-full bg-purple-600"
        >
          {isSendingMessage
            ? <ActivityIndicator size="small" color="#ffffff" />
            : <Icon as={Send} size={18} className="text-white" />
          }
        </TouchableOpacity>
      </View>

      {/* Tip Modal */}
      <Modal visible={showTipModal} transparent animationType="slide" onRequestClose={() => setShowTipModal(false)}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="mx-4 w-full max-w-md rounded-3xl bg-background p-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold">Send STX Tip</Text>
              <TouchableOpacity onPress={() => setShowTipModal(false)}>
                <Icon as={X} size={24} className="text-foreground" />
              </TouchableOpacity>
            </View>
            <View className="mt-6">
              <Text className="mb-2 text-sm text-muted-foreground">Amount (STX)</Text>
              <View className="rounded-2xl bg-card p-4">
                <TextInput
                  value={tipAmount}
                  onChangeText={setTipAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  className="text-2xl font-semibold text-foreground"
                />
              </View>
              <View className="mt-3 flex-row gap-2">
                {['0.1', '0.5', '1', '5'].map(q => (
                  <TouchableOpacity key={q} onPress={() => setTipAmount(q)}
                    className="flex-1 items-center rounded-xl bg-green-50 dark:bg-green-950 py-2">
                    <Text className="text-xs font-semibold text-green-700 dark:text-green-300">{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View className="mt-4 rounded-2xl bg-card p-4">
              <Text className="text-sm text-muted-foreground">To</Text>
              <Text className="mt-1 text-xl font-bold">{otherParticipant?.name || otherParticipant?.username || 'User'}</Text>
            </View>
            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity onPress={() => setShowTipModal(false)}
                className="flex-1 items-center rounded-2xl border-2 border-purple-600 py-4">
                <Text className="text-lg font-semibold text-purple-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSendTip}
                disabled={!tipAmount || parseFloat(tipAmount) <= 0 || isSendingTip}
                className={`flex-1 items-center rounded-2xl py-4 ${tipAmount && parseFloat(tipAmount) > 0 ? 'bg-purple-600' : 'bg-gray-300'}`}>
                {isSendingTip
                  ? <ActivityIndicator size="small" color="#ffffff" />
                  : <Text className={`text-lg font-semibold ${tipAmount && parseFloat(tipAmount) > 0 ? 'text-white' : 'text-gray-500'}`}>Send</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// Small helper to avoid repetition
function AvatarBubble({ participant }: { participant: any }) {
  if (participant?.avatar) {
    return <Image source={{ uri: participant.avatar }} className="h-8 w-8 rounded-full" />;
  }
  return (
    <View className="h-8 w-8 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900">
      <Text className="text-xs font-bold text-purple-600 dark:text-purple-300">
        {participant?.name?.charAt(0)?.toUpperCase() || '?'}
      </Text>
    </View>
  );
}
