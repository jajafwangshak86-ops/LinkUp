import { View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { storage } from '@/lib/storage';
import { toast } from 'sonner-native';
import { AuthHeader, VerificationInput } from '@/components/auth';

export default function VerifyScreen() {
  const { t } = useTranslation();
  const { verifyEmail, isVerifying, resendCode, isResending } = useAuth();

  const handleVerify = async (code: string) => {
    if (code.length !== 6) {
      toast.error(t('auth.enterCompleteCode'));
      return;
    }

    const user = await storage.getUser();
    if (!user?.tempEmail) {
      toast.error(t('auth.emailNotFound'));
      router.replace('/auth/email');
      return;
    }

    verifyEmail({ email: user.tempEmail, code });
  };

  const handleResend = async () => {
    const user = await storage.getUser();
    if (!user?.tempEmail) {
      toast.error(t('auth.emailNotFound'));
      return;
    }

    resendCode(user.tempEmail);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-background px-5 pt-16">
      <AuthHeader
        title={t('auth.verifyYourAccount')}
        subtitle={t('auth.verificationCodeSent')}
      />
      <VerificationInput
        onVerify={handleVerify}
        onResend={handleResend}
        onBack={handleBack}
        isVerifying={isVerifying}
        isResending={isResending}
      />
    </View>
  );
}
