import { formatDistanceToNow, format } from 'date-fns';

/** Format a unix ms timestamp for chat display */
export function formatChatTime(ms: number): string {
  const date = new Date(ms);
  const now = Date.now();
  const diff = now - ms;
  if (diff < 60_000) return 'just now';
  if (diff < 3600_000) return formatDistanceToNow(date, { addSuffix: true });
  if (diff < 86400_000) return format(date, 'HH:mm');
  return format(date, 'MMM d');
}

/** Format a block height as approximate date */
export function formatBlockHeight(height: number): string {
  // Stacks: ~1 block per 10 min anchored to Bitcoin
  const approxMs = height * 10 * 60 * 1000;
  const genesis = new Date('2021-01-14').getTime(); // Stacks 2.0 genesis
  return format(new Date(genesis + approxMs), 'MMM d, yyyy');
}

/** Shorten a Stacks address for display */
export function shortenAddress(address: string, chars = 6): string {
  if (!address || address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
