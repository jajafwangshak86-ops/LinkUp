/**
 * Pusher Connection Test Script
 * 
 * This script tests the Pusher connection and provides detailed diagnostics.
 * 
 * Usage:
 * 1. Import this in your app: import '@/scripts/test-pusher'
 * 2. Or call functions directly:
 *    import { testPusherConnection, logPusherStatus } from '@/utils/pusherStatus'
 */

import { 
  logPusherStatus, 
  testPusherConnection, 
  waitForPusherConnection,
  subscribeToPusherStatus 
} from '@/utils/pusherStatus';

// Log initial status
console.log('\n🔍 Starting Pusher Connection Test...\n');
logPusherStatus();

// Subscribe to all state changes
const unsubscribe = subscribeToPusherStatus((status) => {
  console.log(`\n📡 Pusher state changed to: ${status.state}`);
  if (status.isConnected) {
    console.log(`✓ Socket ID: ${status.socketId}`);
  }
});

// Wait for connection and run test
waitForPusherConnection(10000)
  .then(() => {
    console.log('\n✓ Pusher connected successfully!\n');
    return testPusherConnection();
  })
  .then((success) => {
    if (success) {
      console.log('\n✓ All Pusher tests passed!\n');
    } else {
      console.log('\n✗ Some Pusher tests failed\n');
    }
  })
  .catch((error) => {
    console.error('\n✗ Pusher connection failed:', error.message, '\n');
  })
  .finally(() => {
    // Keep subscription active for monitoring
    console.log('📊 Pusher monitoring active. Check console for updates.\n');
  });

// Export for manual testing
export { logPusherStatus, testPusherConnection };
