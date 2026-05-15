import { View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout, AuthHeader, SignInForm } from '@/components/auth';

export default function SignInScreen() {
  const { t } = useTranslation();
  const { signin, isSigningIn } = useAuth();

  const handleSignIn = (data: { email: string; password: string }) => {
    signin(data);
  };

  const handleSignUp = () => {
    router.push('/auth/email');
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  return (
    <AuthLayout>
      <View className="flex-1 px-5 pt-16">
        <AuthHeader
          title={t('auth.welcomeBack')}
          subtitle={t('auth.signInSubtitle')}
        />
        <SignInForm
          onSubmit={handleSignIn}
          onSignUp={handleSignUp}
          onForgotPassword={handleForgotPassword}
          isSubmitting={isSigningIn}
        />
      </View>
    </AuthLayout>
  );
}
