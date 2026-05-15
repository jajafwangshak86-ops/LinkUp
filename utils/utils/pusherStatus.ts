import pusher from '@/lib/pusher';

export interface PusherConnectionStatus {
  state: string;
  isConnected: boolean;
  socketId: string | null;
}

/**
 * Get the current Pusher connection status
 */
export const getPusherStatus = (): PusherConnectionStatus => {
  const connection = pusher.connection;
  
  return {
    state: connection.state,
    isConnected: connection.state === 'connected',
    socketId: connection.socket_id || null,
  };
};

/**
 * Subscribe to Pusher connection state changes
 * @param callback Function to call when connection state changes
 * @returns Unsubscribe function
 */
export const subscribeToPusherStatus = (
  callback: (status: PusherConnectionStatus) => void
): (() => void) => {
  const connection = pusher.connection;
  
  const handleStateChange = () => {
    callback(getPusherStatus());
  };
  
  // Bind to all state change events
  connection.bind('state_change', handleStateChange);
  connection.bind('connected', handleStateChange);
  connection.bind('disconnected', handleStateChange);
  connection.bind('failed', handleStateChange);
  connection.bind('unavailable', handleStateChange);
  
  // Return unsubscribe function
  return () => {
    connection.unbind('state_change', handleStateChange);
    connection.unbind('connected', handleStateChange);
    connection.unbind('disconnected', handleStateChange);
    connection.unbind('failed', handleStateChange);
    connection.unbind('unavailable', handleStateChange);
  };
};

/**
 * Log Pusher connection status to console
 */
export const logPusherStatus = () => {
  const status = getPusherStatus();
  console.log('=== Pusher Connection Status ===');
  console.log('State:', status.state);
  console.log('Connected:', status.isConnected);
  console.log('Socket ID:', status.socketId || 'N/A');
  console.log('================================');
  return status;
};

/**
 * Wait for Pusher to connect (with timeout)
 * @param timeoutMs Timeout in milliseconds (default: 10000)
 * @returns Promise that resolves when connected or rejects on timeout
 */
export const waitForPusherConnection = (timeoutMs: number = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const status = getPusherStatus();
    
    // Already connected
    if (status.isConnected) {
      resolve();
      return;
    }
    
    // Set timeout
    const timeout = setTimeout(() => {
      unsubscribe();
      reject(new Error(`Pusher connection timeout after ${timeoutMs}ms`));
    }, timeoutMs);
    
    // Subscribe to connection changes
    const unsubscribe = subscribeToPusherStatus((newStatus) => {
      if (newStatus.isConnected) {
        clearTimeout(timeout);
        unsubscribe();
        resolve();
      } else if (newStatus.state === 'failed' || newStatus.state === 'unavailable') {
        clearTimeout(timeout);
        unsubscribe();
        reject(new Error(`Pusher connection failed: ${newStatus.state}`));
      }
    });
  });
};

/**
 * Test Pusher connection by subscribing to a test channel
 * @param channelName Test channel name (default: 'test-channel')
 */
export const testPusherConnection = async (channelName: string = 'test-channel') => {
  console.log('Testing Pusher connection...');
  
  try {
    // Wait for connection
    await waitForPusherConnection(5000);
    console.log('✓ Pusher connected successfully');
    
    // Try subscribing to a test channel
    const channel = pusher.subscribe(channelName);
    console.log(`✓ Subscribed to channel: ${channelName}`);
    
    // Bind to a test event
    channel.bind('test-event', (data: any) => {
      console.log('✓ Received test event:', data);
    });
    
    // Unsubscribe after test
    setTimeout(() => {
      pusher.unsubscribe(channelName);
      console.log(`✓ Unsubscribed from channel: ${channelName}`);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('✗ Pusher connection test failed:', error);
    return false;
  }
};
