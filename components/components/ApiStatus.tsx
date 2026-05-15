import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { api } from '@/lib/api';

export function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setApiUrl(process.env.EXPO_PUBLIC_API_URL || 'Not configured');
    
    try {
      const response = await api.checkHealth();
      if (response.data) {
        setStatus('connected');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'checking') {
    return (
      <View className="bg-yellow-100 p-2 border-b border-yellow-300">
        <Text className="text-yellow-800 text-xs text-center">
          Checking API connection...
        </Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View className="bg-red-100 p-2 border-b border-red-300">
        <Text className="text-red-800 text-xs text-center">
          ⚠️ API connection failed: {apiUrl}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-green-100 p-2 border-b border-green-300">
      <Text className="text-green-800 text-xs text-center">
        ✅ Connected to API: {apiUrl}
      </Text>
    </View>
  );
}
