# Implementation Plan: Complete App Internationalization

## Overview

This implementation plan systematically completes internationalization across the LinkUp mobile application. The approach follows 5 phases: (1) Translation file completion for 10 languages, (2) Core screen integration (auth, feed, wallet, profile), (3) Secondary screen integration (chat, search, notifications, mini-apps), (4) RTL support for Arabic, and (5) Manual testing and validation. The i18n infrastructure (i18next, react-i18next) is already configured, and the settings screen serves as the reference implementation pattern.

## Tasks

- [ ] 1. Phase 1: Translation File Completion
  - [ ] 1.1 Audit and finalize English translation file
    - Review en.json for completeness and accuracy
    - Add any missing keys discovered during requirements analysis
    - Document key purposes for translator context
    - Ensure all sections are present: common, auth, wallet, feed, profile, settinMgs, security, twoFactor, chat, notifications, search, errors
    - _Requirements: 1.2, 1.3, 14.1, 14.2_

  - [ ] 1.2 Create translation validation script
    - Create scripts/validate-translations.ts
    - Implement getAllKeys() function to extract all translation keys from nested JSON
    - Implement validation logic to compare each language file against en.json
    - Check for missing keys, extra keys, empty values, and placeholder text
    - Add script to package.json as "validate:translations"
    - _Requirements: 16.1, 16.2_

  - [ ] 1.3 Generate machine translations for 10 incomplete languages
    - Set up DeepL API or Google Cloud Translation API credentials
    - Create scripts/generate-translations.ts script
    - Process en.json section by section for fr, de, zh, ja, ko, ar, pt, ru, hi, it
    - Preserve interpolation variables ({{variableName}})
    - Keep technical terms unchanged (2FA, QR, SOL, etc.)
    - Maintain JSON structure and formatting
    - _Requirements: 1.2, 1.5_

  - [ ] 1.4 Apply language-specific adjustments
    - Arabic (ar): Ensure proper RTL text and cultural appropriateness
    - Chinese (zh): Use Simplified Chinese (zh-CN)
    - Japanese (ja): Use appropriate formality level (polite form)
    - Hindi (hi): Verify Devanagari script encoding
    - Russian (ru): Verify Cyrillic encoding
    - _Requirements: 1.5, 13.4_

  - [ ] 1.5 Run validation script and fix issues
    - Execute npm run validate:translations
    - Fix any missing keys, empty values, or structural mismatches
    - Verify all 12 language files pass validation
    - _Requirements: 16.1, 16.2_

- [ ] 2. Checkpoint - Verify translation files complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Phase 2: Authentication Screens Translation Integration
  - [ ] 3.1 Integrate translations in Sign In screen
    - Import useTranslation hook in components/auth/SignInForm.tsx
    - Replace hardcoded strings with t() calls for form labels, buttons, links
    - Add accessibility labels using translation keys
    - Test language switching on sign in screen
    - _Requirements: 2.1, 20.3_

  - [ ] 3.2 Integrate translations in Sign Up screen
    - Import useTranslation hook in app/auth/signup/index.tsx
    - Replace hardcoded strings with t() calls for form labels, validation messages
    - Add dynamic value interpolation for username validation
    - Test language switching on sign up screen
    - _Requirements: 2.2_

  - [ ] 3.3 Integrate translations in Email Verification screen
    - Import useTranslation hook in app/auth/verify/index.tsx and components/auth/VerificationInput.tsx
    - Replace hardcoded strings with t() calls for instructions, code input labels, resend button
    - Add accessibility labels for verification input fields
    - _Requirements: 2.3, 20.3_

  - [ ] 3.4 Integrate translations in Two-Factor Authentication screens
    - Import useTranslation hook in app/auth/2fa-verify/index.tsx and components/settings/TwoFactorSettings.tsx
    - Replace hardcoded strings with t() calls for 2FA setup instructions, QR code labels, verification prompts
    - Add translations for recovery code information and backup instructions
    - _Requirements: 2.4_

  - [ ] 3.5 Integrate translations in Password Reset screens
    - Import useTranslation hook in app/auth/forgot-password/index.tsx and app/auth/reset-password/index.tsx
    - Replace hardcoded strings with t() calls for forgot password prompts, reset instructions, confirmation messages
    - Add error message translations for password reset failures
    - _Requirements: 2.5_

  - [ ] 3.6 Integrate authentication error messages
    - Update error handling in hooks/useAuth.ts to use translation keys
    - Replace hardcoded error strings with t('errors.invalidCredentials'), t('errors.emailAlreadyExists'), etc.
    - Add translations for session expiration and token errors
    - _Requirements: 2.6, 18.4_

- [x] 4. Phase 2: Feed Screen Translation Integration
  - [x] 4.1 Integrate translations in Feed screen main component
    - Import useTranslation hook in app/(tabs)/feed.tsx
    - Replace hardcoded strings with t() calls for feed header, explore button, empty state
    - Add translations for pull-to-refresh messages
    - _Requirements: 3.1_

  - [x] 4.2 Integrate translations in Create Post Modal
    - Import useTranslation hook in components/feed/CreatePostModal.tsx
    - Replace hardcoded strings with t() calls for post creation prompt, placeholder text, submit button
    - Add translations for tokenization options and character limits
    - _Requirements: 3.2_

  - [x] 4.3 Integrate translations in Post Card components
    - Import useTranslation hook in components/feed/FeedPostCard.tsx, components/post/PostDetailCard.tsx, components/post/PostActions.tsx
    - Replace hardcoded strings with t() calls for action buttons (like, comment, tip, share)
    - Add pluralization for interaction counts using t('feed.likes', { count })
    - Add accessibility labels for post actions
    - _Requirements: 3.3, 12.4, 20.3_

  - [x] 4.4 Integrate translations in Balance Card
    - Import useTranslation hook in components/feed/BalanceCard.tsx
    - Replace hardcoded strings with t() calls for balance labels, wallet address labels, refresh button
    - Add number formatting for balance amounts using locale conventions
    - _Requirements: 3.4, 11.4_

  - [ ] 4.5 Integrate translations in Mini Apps Card
    - Import useTranslation hook in components/feed/MiniAppsCard.tsx
    - Replace hardcoded strings with t() calls for mini-app titles and descriptions
    - _Requirements: 3.5_

  - [x] 4.6 Integrate translations in Tip Modal
    - Import useTranslation hook in components/feed/TipModal.tsx
    - Replace hardcoded strings with t() calls for tip amount labels, recipient information, submit button
    - Add dynamic value interpolation for recipient username
    - _Requirements: 3.6, 11.2_

  - [x] 4.7 Integrate translations in Buy Token Modal
    - Import useTranslation hook in components/feed/BuyTokenModal.tsx
    - Replace hardcoded strings with t() calls for token purchase labels, price information, transaction buttons
    - Add number formatting for token prices
    - _Requirements: 3.7, 11.4_

- [x] 5. Phase 2: Profile Screens Translation Integration
  - [x] 5.1 Integrate translations in Profile View screen
    - Import useTranslation hook in app/(tabs)/profile/index.tsx and components/profile/ProfileHeader.tsx
    - Replace hardcoded strings with t() calls for profile statistics labels (followers, following, posts)
    - Add translations for action buttons (follow, unfollow, edit, share)
    - Add pluralization for follower/following counts
    - _Requirements: 4.1, 12.4_

  - [x] 5.2 Integrate translations in Profile tabs
    - Import useTranslation hook in components/profile/PostCard.tsx, components/profile/RepliesTab.tsx, components/profile/PortfolioTab.tsx
    - Replace hardcoded strings with t() calls for tab labels and empty state messages
    - Add translations for portfolio value labels
    - _Requirements: 4.3_

  - [ ] 5.3 Integrate translations in Security Settings screen
    - Import useTranslation hook in components/settings/BiometricSettings.tsx and components/settings/TwoFactorSettings.tsx
    - Replace hardcoded strings with t() calls for password change labels, 2FA settings, biometric options
    - Add translations for security tips and warning messages
    - _Requirements: 4.4_

  - [ ] 5.4 Integrate translations in Recovery Phrase screen
    - Import useTranslation hook in app/(tabs)/profile/recovery-phrase.tsx
    - Replace hardcoded strings with t() calls for recovery phrase instructions, warning messages, confirmation prompts
    - Add translations for copy and reveal functionality
    - _Requirements: 4.5_

- [x] 6. Phase 2: Wallet Screens Translation Integration
  - [x] 6.1 Integrate translations in Wallet Balance screen
    - Import useTranslation hook in app/(tabs)/wallet/index.tsx and components/wallet/TokenCard.tsx
    - Replace hardcoded strings with t() calls for balance display labels, token names, portfolio value
    - Add number formatting for token amounts using locale conventions
    - _Requirements: 5.1, 11.4_

  - [ ] 6.2 Integrate translations in Send Money screen
    - Import useTranslation hook in app/(tabs)/wallet/send.tsx and components/wallet/SendForm.tsx
    - Replace hardcoded strings with t() calls for form labels (recipient, amount, memo)
    - Add translations for validation messages (invalid address, insufficient balance)
    - Add translations for transaction confirmation text
    - _Requirements: 5.2, 18.2_

  - [ ] 6.3 Integrate translations in Transaction History screen
    - Import useTranslation hook in app/(tabs)/wallet/history.tsx and components/wallet/TransactionCard.tsx
    - Replace hardcoded strings with t() calls for transaction list headers, status labels
    - Add translations for transaction types (sent, received, swap)
    - Add translations for empty state messages
    - Add date/time formatting using locale conventions
    - _Requirements: 5.4, 19.1, 19.3_

- [ ] 7. Checkpoint - Verify core screens complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Phase 3: Chat Screens Translation Integration
  - [ ] 8.1 Integrate translations in Chat List screen
    - Import useTranslation hook in app/(tabs)/chats/index.tsx and components/chat/ChatCard.tsx
    - Replace hardcoded strings with t() calls for chats header, new chat button, empty state
    - Add relative time translations for last message timestamps
    - Add pluralization for unread message counts
    - _Requirements: 6.1, 19.2, 12.4_

  - [ ] 8.2 Integrate translations in Chat Conversation screen
    - Import useTranslation hook in app/(tabs)/chats/[id].tsx and components/chat/MessageInput.tsx
    - Replace hardcoded strings with t() calls for message input placeholder, online/offline status
    - Add translations for typing indicators
    - Add date/time formatting for message timestamps
    - _Requirements: 6.2, 19.4_

- [ ] 9. Phase 3: Search and Notifications Translation Integration
  - [ ] 9.1 Integrate translations in Search screen
    - Import useTranslation hook in app/(tabs)/search.tsx and components/search/TokenSearchCard.tsx
    - Replace hardcoded strings with t() calls for search placeholder, filter labels
    - Add translations for result count information and empty state
    - _Requirements: 7.1, 7.4_

  - [ ] 9.2 Integrate translations in Notifications screen
    - Import useTranslation hook in app/(tabs)/notifications.tsx and components/notifications/NotificationCard.tsx
    - Replace hardcoded strings with t() calls for notifications header, mark all read button
    - Add translations for notification type messages with dynamic value interpolation
    - Add relative time translations for notification timestamps
    - _Requirements: 7.2, 7.3, 11.3, 19.2_

- [ ] 10. Phase 3: Settings Screen Translation Completeness
  - [ ] 10.1 Verify Settings screen translation completeness
    - Review app/settings/index.tsx for any remaining hardcoded strings
    - Ensure all section headers use translation keys
    - Verify language selector displays native language names
    - Add translations for any missing settings options
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 10.2 Enhance Language Selector component
    - Update language selector to show all 12 languages with native names
    - Add RTL flag for Arabic language
    - Implement language change handler with AsyncStorage persistence
    - Add backend API call to update user language preference
    - Show restart prompt when Arabic is selected
    - _Requirements: 8.3, 13.1, 17.3_

- [ ] 11. Phase 3: Modal and Component Translation Integration
  - [ ] 11.1 Integrate translations in Bottom Sheet components
    - Import useTranslation hook in components/common/BottomSheet.tsx
    - Replace hardcoded strings with t() calls for sheet titles, action options, cancel buttons
    - Ensure all bottom sheet instances use translation keys
    - _Requirements: 9.1_

  - [ ] 11.2 Integrate translations in Confirmation Dialogs
    - Review all Alert.alert() and confirmation dialog usage
    - Replace hardcoded strings with t() calls for dialog titles, messages, action buttons
    - Add translations for common confirmation patterns (delete, logout, cancel)
    - _Requirements: 9.2_

  - [ ] 11.3 Integrate translations in Error State components
    - Create reusable ErrorState component with translation support
    - Replace hardcoded error messages with t() calls
    - Add translations for retry button and error recovery actions
    - _Requirements: 9.3_

  - [ ] 11.4 Integrate translations in Loading State components
    - Review loading indicators and add translations where applicable
    - Add translations for loading messages (fetching data, processing, etc.)
    - _Requirements: 9.4_

  - [ ] 11.5 Integrate translations in Toast Notifications
    - Review all toast.success(), toast.error(), toast.info() calls
    - Replace hardcoded strings with t() calls for all toast messages
    - _Requirements: 9.5_

- [ ] 12. Phase 3: Mini-Apps Screens Translation Integration
  - [ ] 12.1 Integrate translations in Swap screen
    - Import useTranslation hook in app/mini-apps/swap.tsx
    - Replace hardcoded strings with t() calls for token selection labels, swap direction, amount inputs
    - Add translations for slippage settings and transaction buttons
    - _Requirements: 10.1_

  - [ ] 12.2 Integrate translations in Swap History screen
    - Import useTranslation hook in app/mini-apps/swap-history.tsx
    - Replace hardcoded strings with t() calls for history list headers, swap details, empty state
    - Add date/time formatting for swap timestamps
    - _Requirements: 10.2, 19.1_

- [ ] 13. Checkpoint - Verify all screens integrated
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Phase 4: RTL Support Implementation
  - [ ] 14.1 Configure i18n for RTL detection
    - Update lib/i18n.ts to detect Arabic language selection
    - Add languageChanged event listener to toggle RTL mode
    - Import and configure I18nManager from react-native
    - _Requirements: 13.1, 13.2_

  - [ ] 14.2 Update styles to use logical properties
    - Create utility function to convert directional styles to logical properties
    - Update common components to use marginStart/marginEnd instead of marginLeft/marginRight
    - Update paddingStart/paddingEnd instead of paddingLeft/paddingRight
    - Review and update flexDirection for RTL compatibility
    - _Requirements: 13.3_

  - [ ] 14.3 Implement RTL-aware icon flipping
    - Identify directional icons (arrows, chevrons, navigation)
    - Add transform: [{ scaleX: isRTL ? -1 : 1 }] for directional icons
    - Test icon appearance in RTL mode
    - _Requirements: 13.3_

  - [ ] 14.4 Implement app restart prompt for RTL
    - Add restart detection in language selector
    - Show Alert.alert() when Arabic is selected
    - Provide "Restart Now" option using Updates.reloadAsync()
    - Add "Later" option to defer restart
    - _Requirements: 13.1_

  - [ ] 14.5 Test Arabic language thoroughly
    - Switch to Arabic and verify all screens render correctly
    - Check text alignment (right-aligned for RTL)
    - Verify navigation flow (right-to-left)
    - Test form inputs and buttons in RTL mode
    - _Requirements: 13.3, 13.4_

- [ ] 15. Phase 4: Translation Key Consistency and Validation
  - [ ] 15.1 Create hardcoded string detection script
    - Create scripts/detect-hardcoded-strings.ts
    - Implement regex patterns to detect hardcoded strings in JSX
    - Scan all component directories (app, components, screens)
    - Exclude technical constants, test IDs, and comments
    - Add script to package.json as "detect:hardcoded"
    - _Requirements: 14.3, 16.3_

  - [ ] 15.2 Run hardcoded string detection and fix issues
    - Execute npm run detect:hardcoded
    - Review flagged hardcoded strings
    - Replace with appropriate translation keys
    - Re-run script until no issues found
    - _Requirements: 16.3_

  - [ ] 15.3 Verify translation key naming conventions
    - Review all translation keys for dot-notation format
    - Verify multi-word keys use camelCase
    - Ensure keys are organized under appropriate sections
    - _Requirements: 14.1, 14.2_

  - [ ] 15.4 Configure missing key warning logging
    - Update lib/i18n.ts to enable missing key warnings
    - Add saveMissing: false and missingKeyHandler configuration
    - Test that missing keys are logged in development
    - _Requirements: 14.4_

  - [ ]* 15.5 Write property test for translation key naming convention
    - **Property 10: Translation Key Naming Convention**
    - **Validates: Requirements 14.1, 14.2**
    - Verify all keys follow dot-notation format
    - Verify multi-word keys use camelCase
    - Test across all translation files

  - [ ]* 15.6 Write property test for missing key warning logging
    - **Property 11: Missing Key Warning Logging**
    - **Validates: Requirements 14.4**
    - Test that requesting non-existent keys logs warnings
    - Verify warning includes the missing key name

- [ ] 16. Checkpoint - Verify RTL and validation complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Phase 5: Manual Testing and Validation
  - [ ] 20.1 Perform manual testing in all 12 languages
    - Test each language by switching in settings
    - Verify all screens display translated text
    - Check for any remaining hardcoded strings
    - Verify translations are contextually appropriate
    - Test on both iOS and Android devices
    - _Requirements: 1.1, 16.4_

  - [ ] 20.2 Test RTL layout on physical devices
    - Switch to Arabic on iOS device
    - Verify RTL layout renders correctly
    - Test navigation flow (right-to-left)
    - Switch to Arabic on Android device
    - Verify RTL layout renders correctly
    - _Requirements: 13.1, 13.3_

  - [ ] 20.3 Run all validation scripts
    - Execute npm run validate:translations
    - Execute npm run detect:hardcoded
    - Fix any issues discovered
    - Verify all scripts pass with no errors
    - _Requirements: 16.1, 16.2, 16.3_

  - [ ] 20.4 Test language preference persistence
    - Select Spanish, close app, reopen app
    - Verify Spanish is still active
    - Test with multiple languages
    - Verify backend stores language preference for logged-in users
    - _Requirements: 17.3_

  - [ ] 20.5 Test error handling scenarios
    - Test app behavior with corrupted translation file
    - Test fallback to English when translation missing
    - Test language switch failure handling
    - Verify error messages are user-friendly
    - _Requirements: 15.1, 15.2_

  - [ ] 20.6 Verify accessibility compliance
    - Test with VoiceOver on iOS
    - Test with TalkBack on Android
    - Verify all interactive elements have labels
    - Test form inputs have hints
    - Test in multiple languages
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

- [ ] 18. Final checkpoint - Ensure all validation passes
  - [ ] 22.1 Update README with i18n documentation
    - Document supported languages
    - Explain how to add new translation keys
    - Provide examples of using useTranslation hook
    - Document pluralization and interpolation patterns
    - _Requirements: All requirements_

  - [ ] 19.2 Create developer guide for translations
    - Document translation key naming conventions
    - Provide component integration examples
    - Explain how to add new languages
    - Document validation script usage
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ] 19.3 Add package.json scripts for i18n tasks
    - Add "validate:translations" script
    - Add "detect:hardcoded" script
    - Document scripts in README
    - _Requirements: 16.1, 16.3_

  - [ ] 19.4 Review and optimize bundle size
    - Check translation file sizes
    - Consider lazy loading if needed
    - Verify no duplicate translation keys
    - Optimize JSON structure if possible
    - _Requirements: 17.2_

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The implementation follows 5 phases: Translation Completion → Core Screens → Secondary Screens → RTL Support → Manual Testing & Validation
- Settings screen (already translated) serves as reference implementation pattern
- All translation keys follow dot-notation format: section.subsection.key
- Dynamic values use {{variableName}} interpolation syntax
- Pluralization uses i18next conventions: key_one, key_other, etc.
- RTL support requires app restart for full layout changes
- Validation scripts ensure translation completeness and detect hardcoded strings
