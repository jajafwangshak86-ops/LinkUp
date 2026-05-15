import { useState, useEffect } from 'react';
import { getPusherStatus, subscribeToPusherStatus, type PusherConnectionStatus } from '@/utils/pusherStatus';

/**
 * React hook to monitor Pusher connection status
 * @returns Current Pusher connection status
 */
export const usePusherStatus = () => {
  const [status, setStatus] = useState<PusherConnectionStatus>(getPusherStatus());

  useEffect(() => {
    // Subscribe to status changes
    const unsubscribe = subscribeToPusherStatus((newStatus) => {
      setStatus(newStatus);
    });

    // Cleanup on unmount
    return unsubscribe;
  }, []);

  return status;
};
