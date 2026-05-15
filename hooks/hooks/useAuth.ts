import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { storage } from '@/lib/storage';
import { router } from 'expo-router';
import { toast } from 'sonner-native';

interface SignupData {
  email: string;
  password: string;
  username: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface VerifyEmailData {
  email: string;
  code: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  bio?: string;
  avatar?: string;
  walletAddress: string;
  emailVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  tempEmail?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface VerifyResponse {
  message: string;
  user: User;
}

export function useAuth() {
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await storage.getToken();
      if (!token) return null;
      
      api.setToken(token);
      const { data, error } = await api.getProfile();
      
      if (error) {
        await storage.clear();
        return null;
      }
      
      return data;
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await api.signup(data.email, data.password, data.username);
      if (response.error) throw new Error(response.error);
      return response.data as AuthResponse;
    },
    onSuccess: async (data) => {
      await storage.saveToken(data.token);
      await storage.saveUser({ ...data.user, tempEmail: data.user.email });
      api.setToken(data.token);
      queryClient.setQueryData(['user'], data.user);
      toast.success('Account created! Check your email for verification code');
      router.push('/auth/verify');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Signin mutation
  const signinMutation = useMutation({
    mutationFn: async (data: SigninData) => {
      const response = await api.signin(data.email, data.password);
      if (response.error) throw new Error(response.error);
      return response.data as AuthResponse;
    },
    onSuccess: async (data) => {
      await storage.saveToken(data.token);
      await storage.saveUser(data.user);
      api.setToken(data.token);
      queryClient.setQueryData(['user'], data.user);
      toast.success('Welcome back!');
      router.replace('/feed');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (data: VerifyEmailData) => {
      const response = await api.verifyEmail(data.email, data.code);
      if (response.error) throw new Error(response.error);
      return response.data as VerifyResponse;
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(['user'], data.user);
      toast.success('Email verified successfully!');
      router.replace('/auth/signup');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Resend code mutation
  const resendCodeMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await api.resendCode(email);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Verification code sent!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Logout
  const logout = async () => {
    await storage.clear();
    api.clearToken();
    queryClient.clear();
    router.replace('/auth/signin');
    toast.success('Logged out successfully');
  };

  return {
    user,
    isLoadingUser,
    isAuthenticated: !!user,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    signin: signinMutation.mutate,
    isSigningIn: signinMutation.isPending,
    verifyEmail: verifyEmailMutation.mutate,
    isVerifying: verifyEmailMutation.isPending,
    resendCode: resendCodeMutation.mutate,
    isResending: resendCodeMutation.isPending,
    logout,
  };
}
