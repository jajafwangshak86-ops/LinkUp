/**
 * Gaia chat service — fast decentralized chat storage.
 *
 * Each conversation is stored as a JSON file in the user's Gaia hub.
 * Reads/writes are plain HTTPS — instant, no transaction fees, no block wait.
 * MongoDB caches the latest messages for fast feed queries.
 *
 * Gaia file layout per user:
 *   linkup/chats/{chatId}/messages.json  → array of GaiaMessage
 *   linkup/chats/index.json              → array of chat IDs + last message preview
 */

import { stacksConfig } from '@/lib/stacks-config';

const GAIA_HUB = 'https://hub.hiro.so';

export interface GaiaMessage {
  id: string;           // uuid
  chatId: string;
  senderAddress: string;
  content: string;
  type: 'text' | 'payment';
  paymentTxId?: string;
  paymentAmount?: number; // micro-STX
  createdAt: number;    // unix ms timestamp
}

export interface GaiaChatIndex {
  chatId: string;
  participantAddress: string;
  lastMessage: string;
  lastMessageAt: number;
  unread: number;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch messages for a chat from the sender's Gaia hub.
 * This is a plain HTTPS GET — returns instantly.
 */
export async function fetchMessages(
  ownerAddress: string,
  chatId: string,
): Promise<GaiaMessage[]> {
  const url = `${GAIA_HUB}/read/${ownerAddress}/linkup/chats/${chatId}/messages.json`;
  const res = await fetch(url);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Gaia read failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch the chat index (list of conversations) for a user.
 */
export async function fetchChatIndex(ownerAddress: string): Promise<GaiaChatIndex[]> {
  const url = `${GAIA_HUB}/read/${ownerAddress}/linkup/chats/index.json`;
  const res = await fetch(url);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Gaia read failed: ${res.status}`);
  return res.json();
}

// ─── Write (requires user's Gaia session token) ───────────────────────────────

/**
 * Append a message to a chat in the user's Gaia hub.
 * The gaiaToken comes from the user's Hiro Wallet session.
 */
export async function appendMessage(
  ownerAddress: string,
  gaiaToken: string,
  chatId: string,
  message: GaiaMessage,
): Promise<void> {
  // Read existing messages first
  const existing = await fetchMessages(ownerAddress, chatId);
  existing.push(message);

  await writeGaia(
    ownerAddress,
    gaiaToken,
    `linkup/chats/${chatId}/messages.json`,
    existing,
  );
}

/**
 * Update the chat index after sending a message.
 */
export async function updateChatIndex(
  ownerAddress: string,
  gaiaToken: string,
  entry: GaiaChatIndex,
): Promise<void> {
  const index = await fetchChatIndex(ownerAddress);
  const existing = index.findIndex(c => c.chatId === entry.chatId);
  if (existing >= 0) {
    index[existing] = entry;
  } else {
    index.push(entry);
  }
  await writeGaia(ownerAddress, gaiaToken, 'linkup/chats/index.json', index);
}

// ─── Internal ─────────────────────────────────────────────────────────────────

async function writeGaia(
  ownerAddress: string,
  gaiaToken: string,
  path: string,
  data: unknown,
): Promise<void> {
  const url = `${GAIA_HUB}/store/${ownerAddress}/${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${gaiaToken}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Gaia write failed: ${res.status}`);
}
