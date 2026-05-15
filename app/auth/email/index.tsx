import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout, AuthHeader, SignUpForm } from '@/components/auth';

export default function EmailScreen() {
  const { t } = useTranslation();
  const { signup, isSigningUp } = useAuth();

  const handleContinue = (data: { email: string; password: string; username: string }) => {
    signup(data);
  };

  return (
    <AuthLayout>
      <View className="flex-1 px-5 pt-16">
        <AuthHeader
          title={t('auth.enterYourEmail')}
          subtitle={t('auth.emailRecoveryDesc')}
        />
        <SignUpForm
          onSubmit={handleContinue}
          isSubmitting={isSigningUp}
        />
      </View>
    </AuthLayout>
  );
}
