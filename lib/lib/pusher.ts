import Pusher from 'pusher-js/react-native';

const pusherKey = process.env.EXPO_PUBLIC_PUSHER_KEY || '';
const pusherCluster = process.env.EXPO_PUBLIC_PUSHER_CLUSTER || '';

export const pusher = new Pusher(pusherKey, {
  cluster: pusherCluster,
  forceTLS: true,
});

export default pusher;
