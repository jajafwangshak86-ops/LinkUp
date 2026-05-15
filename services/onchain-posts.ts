/**
 * On-chain posts service — linkup-posts Clarity contract.
 * Content hash + Gaia URL stored on-chain; full content in Gaia.
 */

import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  uintCV,
  bufferCV,
  stringUtf8CV,
  fetchCallReadOnlyFunction,
  cvToValue,
  standardPrincipalCV,
  StacksTestnet,
  StacksMainnet,
} from '@stacks/transactions';
import { createHash } from 'crypto';

const NETWORK = process.env.STACKS_NETWORK === 'mainnet'
  ? new StacksMainnet()
  : new StacksTestnet();

const CONTRACT_ADDRESS = process.env.LINKUP_POSTS_CONTRACT_ADDRESS ?? '';
const CONTRACT_NAME    = 'linkup-posts';

// ─── Write ────────────────────────────────────────────────────────────────────

export async function createPostOnChain(
  senderKey: string,
  postJson: string,   // full post content — will be hashed
  gaiaUrl: string,    // where the full content is stored in Gaia
): Promise<string> {
  const contentHash = Buffer.from(
    createHash('sha256').update(postJson).digest()
  );

  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-post',
    functionArgs: [bufferCV(contentHash), stringUtf8CV(gaiaUrl)],
    senderKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
  });

  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  if ('error' in result) throw new Error(`Stacks broadcast failed: ${String(result.error)}`);
  return result.txid;
}

export async function likePostOnChain(senderKey: string, postId: number): Promise<string> {
  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'like-post',
    functionArgs: [uintCV(postId)],
    senderKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  if ('error' in result) throw new Error(`Stacks broadcast failed: ${String(result.error)}`);
  return result.txid;
}

export async function tipPostOnChain(
  senderKey: string,
  postId: number,
  amountUstx: bigint,
): Promise<string> {
  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'tip-post',
    functionArgs: [uintCV(postId), uintCV(amountUstx)],
    senderKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  if ('error' in result) throw new Error(`Stacks broadcast failed: ${String(result.error)}`);
  return result.txid;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getPostFromChain(postId: number, callerAddress: string) {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-post',
    functionArgs: [uintCV(postId)],
    network: NETWORK,
    senderAddress: callerAddress,
  });
  return cvToValue(result);
}

export async function hasLiked(postId: number, userAddress: string): Promise<boolean> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'has-liked',
    functionArgs: [uintCV(postId), standardPrincipalCV(userAddress)],
    network: NETWORK,
    senderAddress: userAddress,
  });
  return cvToValue(result) as boolean;
}
