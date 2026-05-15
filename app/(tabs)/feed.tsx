import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Search } from 'lucide-react-native';
import { usePosts } from '@/hooks/usePosts';
import { useWallet } from '@/hooks/useWallet';
import { useNotifications } from '@/hooks/useNotifications';
import { router } from 'expo-router';
import { useState } from 'react';
import type { Post } from '@/types';
import * as Clipboard from 'expo-clipboard';
import { toast } from 'sonner-native';
import { uploadMultipleImages } from '@/lib/upload';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  BalanceCard,
  MiniAppsCard,
  CreatePostModal,
  TipModal,
  BuyTokenModal,
  FeedPostCard,
  CreatePostButton,
} from '@/components/feed';
import { LoadingSpinner, ErrorState } from '@/components/common';

export default function FeedScreen() {
  const { t } = useTranslation();
  const { posts, isLoadingFeed, fetchNextPage, hasNextPage, isFetchingNextPage, refetchFeed, createPost, isCreatingPost, likePost, unlikePost, tipPost, isTippingPost, buyToken, isBuyingToken } = usePosts();
  const { balance, walletAddress, isLoadingBalance, refetchBalance } = useWallet();
  const { unreadCount } = useNotifications();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showBuyTokenModal, setShowBuyTokenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleCreatePost = async (data: {
    content: string;
    images: string[];
    isTokenized: boolean;
    tokenSupply?: number;
    tokenPrice?: number;
  }) => {
    let imageUrls: string[] = [];
    
    // Upload images to Cloudinary if any
    if (data.images.length > 0) {
      setIsUploadingImages(true);
      try {
        imageUrls = await uploadMultipleImages(data.images);
        toast.success(t('feed.imagesUploaded'));
      } catch (error) {
        toast.error(t('feed.failedToUploadImages'));
        setIsUploadingImages(false);
        return;
      }
      setIsUploadingImages(false);
    }
    
    createPost({ 
      content: data.content,
      images: imageUrls,
      isTokenized: data.isTokenized,
      tokenSupply: data.tokenSupply,
      tokenPrice: data.tokenPrice,
    });
    setShowCreatePost(false);
  };

  const handleTipPost = (post: Post) => {
    setSelectedPost(post);
    setShowTipModal(true);
  };

  const handleBuyToken = (post: Post) => {
    setSelectedPost(post);
    setShowBuyTokenModal(true);
  };

  const submitTip = (amount: number) => {
    if (!selectedPost) return;
    tipPost({ postId: selectedPost.id, amount });
    setShowTipModal(false);
    setSelectedPost(null);
  };

  const submitBuyToken = (amount: number) => {
    if (!selectedPost) return;
    buyToken({ postId: selectedPost.id, amount });
    setShowBuyTokenModal(false);
    setSelectedPost(null);
  };

  const handleLike = (postId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikePost(postId);
    } else {
      likePost(postId);
    }
  };

  const copyAddress = async () => {
    if (walletAddress) {
      await Clipboard.setStringAsync(walletAddress);
      toast.success(t('feed.addressCopied'));
    }
  };

  const handleRefreshBalance = async () => {
    await refetchBalance();
    toast.success(t('feed.balanceRefreshed'));
  };

  const navigateToProfile = (username: string) => {
    router.push(`/(tabs)/profile?username=${username}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoadingFeed} onRefresh={refetchFeed} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isCloseToBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          walletAddress={walletAddress}
          isLoading={isLoadingBalance}
          showBalance={showBalance}
          unreadCount={unreadCount}
          onToggleBalance={() => setShowBalance(!showBalance)}
          onCopyAddress={copyAddress}
          onRefresh={handleRefreshBalance}
        />

        {/* Mini Apps Section */}
        <MiniAppsCard />

        {/* Feed Header */}
        <View className="mt-6 flex-row items-center justify-between px-4">
          <Text className="text-xl font-bold">{t('common.feed')}</Text>
          <TouchableOpacity 
            onPress={() => router.push('/explore')}
            className="flex-row items-center gap-1"
          >
            <Icon as={Search} size={20} className="text-purple-600" />
            <Text className="font-semibold text-purple-600">{t('feed.explore')}</Text>
          </TouchableOpacity>
        </View>

        {/* Posts */}
        <View className="mt-4">
          {isLoadingFeed && posts.length === 0 ? (
            <LoadingSpinner />
          ) : posts.length === 0 ? (
            <ErrorState message="No posts yet" onRetry={refetchFeed} />
          ) : (
            posts.map((post: Post) => (
              <FeedPostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onTip={handleTipPost}
                onBuyToken={handleBuyToken}
                onNavigateToProfile={navigateToProfile}
              />
            ))
          )}
          {isFetchingNextPage && <LoadingSpinner size="small" />}
        </View>
      </ScrollView>

      {/* Floating Post Button */}
      <CreatePostButton onPress={() => setShowCreatePost(true)} />

      {/* Create Post Modal */}
      <CreatePostModal
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
        isSubmitting={isCreatingPost}
        isUploadingImages={isUploadingImages}
      />

      {/* Tip Modal */}
      <TipModal
        visible={showTipModal}
        onClose={() => setShowTipModal(false)}
        onSubmit={submitTip}
        recipientUsername={selectedPost?.author.username || ''}
        isSubmitting={isTippingPost}
      />

      {/* Buy Token Modal */}
      <BuyTokenModal
        visible={showBuyTokenModal}
        onClose={() => setShowBuyTokenModal(false)}
        onSubmit={submitBuyToken}
        tokenPrice={selectedPost?.tokenPrice || 0}
        isSubmitting={isBuyingToken}
      />
    </SafeAreaView>
  );
}
