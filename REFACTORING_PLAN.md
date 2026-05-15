# Codebase Refactoring Plan

## Goal
Break down the entire codebase into smaller, reusable components to improve maintainability, reduce code duplication, and make the codebase more scalable.

## Component Structure

### 1. Common Components (`components/common/`)
- [x] `LoadingSpinner.tsx` - Loading states
- [ ] `EmptyState.tsx` - Empty state messages (move from profile)
- [ ] `ErrorState.tsx` - Error messages
- [ ] `RefreshControl.tsx` - Pull to refresh wrapper
- [ ] `BottomSheet.tsx` - Reusable bottom sheet modal
- [ ] `ConfirmDialog.tsx` - Confirmation dialogs
- [ ] `Avatar.tsx` - User avatar (move from profile)
- [ ] `Badge.tsx` - Notification badges, status badges
- [ ] `Divider.tsx` - Horizontal/vertical dividers

### 2. Feed Components (`components/feed/`)
- [ ] `FeedCard.tsx` - Main post card for feed
- [ ] `FeedHeader.tsx` - Post author info
- [ ] `FeedContent.tsx` - Post text content
- [ ] `FeedImages.tsx` - Post image gallery
- [ ] `FeedActions.tsx` - Like, comment, share buttons
- [ ] `FeedStats.tsx` - Likes, comments count
- [ ] `TokenBadge.tsx` - Tokenized post indicator
- [ ] `CreatePostButton.tsx` - Floating action button
- [ ] `CreatePostModal.tsx` - Post creation modal

### 3. Profile Components (`components/profile/`)
- [x] `ProfileAvatar.tsx`
- [x] `ProfileHeader.tsx`
- [x] `ProfileCard.tsx`
- [x] `ProfileTabs.tsx`
- [x] `PostCard.tsx`
- [x] `EmptyState.tsx`
- [x] `PostsTab.tsx`
- [x] `PortfolioTab.tsx`
- [x] `RepliesTab.tsx`
- [x] `LikesTab.tsx`
- [x] `ProfileMenu.tsx`
- [ ] `FollowButton.tsx` - Reusable follow/unfollow button
- [ ] `ProfileStats.tsx` - Followers, following, posts count

### 4. Wallet Components (`components/wallet/`)
- [ ] `BalanceCard.tsx` - Main balance display
- [ ] `TokenCard.tsx` - Individual token balance
- [ ] `TransactionCard.tsx` - Transaction history item
- [ ] `TransactionList.tsx` - List of transactions
- [ ] `SendForm.tsx` - Send SOL form
- [ ] `QRCode.tsx` - QR code display/scanner
- [ ] `WalletActions.tsx` - Send, receive, swap buttons

### 5. Chat Components (`components/chat/`)
- [ ] `ChatList.tsx` - List of chats
- [ ] `ChatCard.tsx` - Individual chat preview
- [ ] `MessageBubble.tsx` - Individual message
- [ ] `MessageList.tsx` - Messages container
- [ ] `MessageInput.tsx` - Message input with send button
- [ ] `ChatHeader.tsx` - Chat screen header
- [ ] `TipModal.tsx` - Send tip in chat

### 6. Post Detail Components (`components/post/`)
- [ ] `PostDetail.tsx` - Full post view
- [ ] `PostHeader.tsx` - Post author and actions
- [ ] `PostContent.tsx` - Post text and images
- [ ] `PostActions.tsx` - Like, comment, share, tip
- [ ] `PostStats.tsx` - Detailed stats
- [ ] `CommentSection.tsx` - Comments container
- [ ] `CommentCard.tsx` - Individual comment
- [ ] `CommentInput.tsx` - Add comment input
- [ ] `TipButton.tsx` - Tip post button
- [ ] `BuyTokenButton.tsx` - Buy post token button

### 7. Search Components (`components/search/`)
- [ ] `SearchBar.tsx` - Search input
- [ ] `SearchTabs.tsx` - Users, Posts, Tokens tabs
- [ ] `UserSearchCard.tsx` - User search result
- [ ] `PostSearchCard.tsx` - Post search result
- [ ] `TokenSearchCard.tsx` - Token search result
- [ ] `RecentSearches.tsx` - Recent search history

### 8. Notification Components (`components/notifications/`)
- [ ] `NotificationCard.tsx` - Individual notification
- [ ] `NotificationList.tsx` - List of notifications
- [ ] `NotificationBadge.tsx` - Unread count badge

### 9. Mini-App Components (`components/mini-apps/`)
- [ ] `GameCard.tsx` - Mini-app preview card
- [ ] `GameHeader.tsx` - Game screen header
- [ ] `BetInput.tsx` - Bet amount input
- [ ] `GameResult.tsx` - Win/loss result display
- [ ] `SwapForm.tsx` - Token swap form
- [ ] `SwapPreview.tsx` - Swap preview/confirmation
- [ ] `HistoryCard.tsx` - Game/swap history item

### 10. Auth Components (`components/auth/`)
- [ ] `AuthLayout.tsx` - Auth screen wrapper
- [ ] `AuthHeader.tsx` - Auth screen header
- [ ] `SignInForm.tsx` - Sign in form
- [ ] `SignUpForm.tsx` - Sign up form
- [ ] `VerificationInput.tsx` - Email verification code input
- [ ] `SocialButtons.tsx` - Social login buttons (future)

### 11. Form Components (`components/forms/`)
- [ ] `FormInput.tsx` - Enhanced input with validation
- [ ] `FormTextArea.tsx` - Multi-line input
- [ ] `FormButton.tsx` - Styled button with loading state
- [ ] `FormLabel.tsx` - Form field label
- [ ] `FormError.tsx` - Error message display
- [ ] `ImagePicker.tsx` - Image selection component
- [ ] `AmountInput.tsx` - Numeric input for amounts

### 12. Layout Components (`components/layout/`)
- [ ] `ScreenWrapper.tsx` - Common screen wrapper
- [ ] `Header.tsx` - Reusable header
- [ ] `TabBar.tsx` - Custom tab bar
- [ ] `SafeArea.tsx` - Safe area wrapper
- [ ] `KeyboardAvoidingView.tsx` - Keyboard handling wrapper

## Refactoring Priority

### Phase 1: Core Components (Week 1)
1. Common components (LoadingSpinner, EmptyState, Avatar, etc.)
2. Feed components (most used across app)
3. Profile components (already started)

### Phase 2: Feature Components (Week 2)
4. Post detail components
5. Wallet components
6. Chat components

### Phase 3: Secondary Features (Week 3)
7. Search components
8. Notification components
9. Mini-app components

### Phase 4: Auth & Forms (Week 4)
10. Auth components
11. Form components
12. Layout components

## Refactoring Guidelines

1. **Single Responsibility**: Each component should do one thing well
2. **Reusability**: Components should be generic enough to use in multiple places
3. **Props Interface**: Always define TypeScript interfaces for props
4. **Composition**: Prefer composition over complex components
5. **Styling**: Use Tailwind classes consistently
6. **Performance**: Use React.memo for expensive components
7. **Testing**: Add tests for complex components (future)

## File Naming Convention
- PascalCase for component files: `ComponentName.tsx`
- Group related components in folders
- Export from index files for cleaner imports

## Import Pattern
```typescript
// Before
import { Component } from '@/components/folder/Component';

// After (with index.ts)
import { Component } from '@/components/folder';
```

## Next Steps
1. Create common components
2. Refactor feed screen to use new components
3. Refactor remaining screens one by one
4. Create index.ts files for each component folder
5. Update all imports across the codebase
6. Remove duplicate code
7. Test all screens thoroughly

## Benefits
- Reduced code duplication
- Easier maintenance
- Faster feature development
- Better code organization
- Improved testability
- Consistent UI/UX
