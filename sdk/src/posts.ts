import {
  makeContractCall,
  broadcastTransaction,
  callReadOnlyFunction,
  AnchorMode,
  uintCV,
  bufferCV,
  stringUtf8CV,
  standardPrincipalCV,
  cvToValue,
} from '@stacks/transactions';
import { CONTRACTS, type LinkUpConfig } from './types';

/** Create a post on-chain. contentHash = SHA-256 of post JSON; full content in Gaia. */
export async function createPost(
  contentHash: Buffer,
  gaiaUrl: string,
  config: Required<LinkUpConfig>,
): Promise<string> {
  const tx = await makeContractCall({
    ...CONTRACTS.posts,
    functionName: 'create-post',
    functionArgs: [bufferCV(contentHash), stringUtf8CV(gaiaUrl)],
    senderKey: config.privateKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction(tx, config.network);
  if ('error' in result) throw new Error((result as any).error);
  return (result as any).txid as string;
}

/** Like a post */
export async function likePost(
  postId: number,
  config: Required<LinkUpConfig>,
): Promise<string> {
  const tx = await makeContractCall({
    ...CONTRACTS.posts,
    functionName: 'like-post',
    functionArgs: [uintCV(postId)],
    senderKey: config.privateKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction(tx, config.network);
  if ('error' in result) throw new Error((result as any).error);
  return (result as any).txid as string;
}

/** Tip a post with STX */
export async function tipPost(
  postId: number,
  amountUstx: bigint,
  config: Required<LinkUpConfig>,
): Promise<string> {
  const tx = await makeContractCall({
    ...CONTRACTS.posts,
    functionName: 'tip-post',
    functionArgs: [uintCV(postId), uintCV(amountUstx)],
    senderKey: config.privateKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction(tx, config.network);
  if ('error' in result) throw new Error((result as any).error);
  return (result as any).txid as string;
}

/** Get post metadata from chain */
export async function getPost(postId: number, config: LinkUpConfig = {}): Promise<any> {
  const result = await callReadOnlyFunction({
    ...CONTRACTS.posts,
    functionName: 'get-post',
    functionArgs: [uintCV(postId)],
    network: config.network ?? 'mainnet',
    senderAddress: CONTRACTS.posts.contractAddress,
  });
  return cvToValue(result);
}

/** Check if an address has liked a post */
export async function hasLiked(
  postId: number,
  address: string,
  config: LinkUpConfig = {},
): Promise<boolean> {
  const result = await callReadOnlyFunction({
    ...CONTRACTS.posts,
    functionName: 'has-liked',
    functionArgs: [uintCV(postId), standardPrincipalCV(address)],
    network: config.network ?? 'mainnet',
    senderAddress: address,
  });
  return cvToValue(result) as boolean;
}

/** Soft-delete a post (author only) */
export async function deletePost(
  postId: number,
  config: Required<LinkUpConfig>,
): Promise<string> {
  const tx = await makeContractCall({
    ...CONTRACTS.posts,
    functionName: 'delete-post',
    functionArgs: [uintCV(postId)],
    senderKey: config.privateKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction(tx, config.network);
  if ('error' in result) throw new Error((result as any).error);
  return (result as any).txid as string;
}

/** Get the next available post ID */
export async function getNextPostId(config: LinkUpConfig = {}): Promise<number> {
  const result = await callReadOnlyFunction({
    ...CONTRACTS.posts,
    functionName: 'get-next-post-id',
    functionArgs: [],
    network: config.network ?? 'mainnet',
    senderAddress: CONTRACTS.posts.contractAddress,
  });
  return Number((cvToValue(result) as any)?.value ?? 1);
}
