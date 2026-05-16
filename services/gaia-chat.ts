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

// Bug 1 fix: removed unused stacksConfig import
const GAIA_HUB = GAIA_HUB;

export interface GaiaMessage {
  id: string;
  chatId: string;
  senderAddress: string;
  content: string;
  type: 'text' | 'payment' | 'image';
  paymentTxId?: string;
  paymentAmount?: number; // micro-STX
  /** View-once: recipient can only open this message once */
  viewOnce?: boolean;
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
 * Reads the message index (list of IDs) then fetches each message file.
 * Each message is its own file — no race condition on write.
 */
export async function fetchMessages(
  ownerAddress: string,
  chatId: string,
): Promise<GaiaMessage[]> {
  // Read the index of message IDs
  const indexUrl = `${GAIA_HUB}/read/${ownerAddress}/linkup/chats/${chatId}/index.json`;
  const indexRes = await fetch(indexUrl);
  if (indexRes.status === 404) return [];
  if (!indexRes.ok) throw new Error(`Gaia read failed: ${indexRes.status}`);
  const ids: string[] = await indexRes.json();

  // Fetch each message in parallel
  const messages = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`${GAIA_HUB}/read/${ownerAddress}/linkup/chats/${chatId}/${id}.json`);
      if (!res.ok) return null;
      return res.json() as Promise<GaiaMessage>;
    })
  );
  return messages.filter((m): m is GaiaMessage => m !== null);
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
 * Each message is stored as its own file to avoid read-modify-write races.
 * File: linkup/chats/{chatId}/{message.id}.json
 * Index: linkup/chats/{chatId}/index.json (append-only list of IDs)
 */
export async function appendMessage(
  ownerAddress: string,
  gaiaToken: string,
  chatId: string,
  message: GaiaMessage,
): Promise<void> {
  // Write the message file (atomic — unique ID per message)
  await writeGaia(
    ownerAddress,
    gaiaToken,
    `linkup/chats/${chatId}/${message.id}.json`,
    message,
  );

  // Update the index — read current IDs, append new one
  const indexUrl = `${GAIA_HUB}/read/${ownerAddress}/linkup/chats/${chatId}/index.json`;
  const indexRes = await fetch(indexUrl);
  const ids: string[] = indexRes.ok ? await indexRes.json() : [];
  ids.push(message.id);
  await writeGaia(ownerAddress, gaiaToken, `linkup/chats/${chatId}/index.json`, ids);
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
