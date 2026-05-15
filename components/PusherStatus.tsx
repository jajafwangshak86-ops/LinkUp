import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Wifi, WifiOff, AlertCircle, Loader } from 'lucide-react-native';
import { usePusherStatus } from '@/hooks/usePusherStatus';
import { logPusherStatus } from '@/utils/pusherStatus';

interface PusherStatusProps {
  showDetails?: boolean;
  compact?: boolean;
}

export function PusherStatus({ showDetails = false, compact = false }: PusherStatusProps) {
  const status = usePusherStatus();

  const getStatusColor = () => {
    switch (status.state) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
      case 'initialized':
        return 'text-yellow-600';
      case 'disconnected':
      case 'unavailable':
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status.state) {
      case 'connected':
        return Wifi;
      case 'connecting':
      case 'initialized':
        return Loader;
      case 'disconnected':
      case 'unavailable':
      case 'failed':
        return WifiOff;
      default:
        return AlertCircle;
    }
  };

  const getStatusText = () => {
    switch (status.state) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'initialized':
        return 'Initializing...';
      case 'disconnected':
        return 'Disconnected';
      case 'unavailable':
        return 'Unavailable';
      case 'failed':
        return 'Failed';
      default:
        return status.state;
    }
  };

  if (compact) {
    return (
      <TouchableOpacity 
        onPress={logPusherStatus}
        className="flex-row items-center gap-2"
      >
        {/* Circle indicator */}
        <View className="relative">
          <View className={`h-3 w-3 rounded-full ${
            status.state === 'connected' ? 'bg-green-500' :
            status.state === 'connecting' || status.state === 'initialized' ? 'bg-yellow-500' :
            'bg-red-500'
          }`} />
          
          {/* Pulse animation for connecting state */}
          {(status.state === 'connecting' || status.state === 'initialized') && (
            <View className="absolute inset-0 h-3 w-3 rounded-full bg-yellow-400 opacity-75 animate-pulse" />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={logPusherStatus}
      className="rounded-lg border border-border bg-card p-3"
    >
      <View className="flex-row items-center gap-3">
        <Icon 
          as={getStatusIcon()} 
          size={20} 
          className={getStatusColor()}
        />
        <View className="flex-1">
          <Text className="font-semibold">Pusher Status</Text>
          <Text className={`text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </Text>
          {showDetails && status.socketId && (
            <Text className="mt-1 text-xs text-muted-foreground">
              Socket: {status.socketId.slice(0, 8)}...
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
