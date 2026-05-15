import { View } from 'react-native';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
  if (orientation === 'vertical') {
    return <View className={`w-px bg-border ${className}`} />;
  }

  return <View className={`h-px bg-border ${className}`} />;
}
