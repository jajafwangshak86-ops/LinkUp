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
        className="flex-row items-center gap-1"
      >
        <Icon 
          as={getStatusIcon()} 
          size={14} 
          className={getStatusColor()}
        />
        {showDetails && (
          <Text className={`text-xs ${getStatusColor()}`}>
            {getStatusText()}
          </Text>
        )}
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
