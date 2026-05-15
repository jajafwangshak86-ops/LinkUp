import {
  makeContractCall,
  broadcastTransaction,
  callReadOnlyFunction,
  AnchorMode,
  stringUtf8CV,
  standardPrincipalCV,
  cvToValue,
} from '@stacks/transactions';
import { CONTRACTS, type LinkUpConfig } from './types';

/** Register a new user on LinkUp */
export async function register(
  username: string,
  gaiaUrl: string,
  config: Required<LinkUpConfig>,
): Promise<string> {
  const tx = await makeContractCall({
    ...CONTRACTS.factory,
    functionName: 'register',
    functionArgs: [stringUtf8CV(username), stringUtf8CV(gaiaUrl)],
    senderKey: config.privateKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction(tx, config.network);
  if ('error' in result) throw new Error((result as any).error);
  return (result as any).txid as string;
}

/** Update a user's Gaia profile URL */
export async function updateProfile(
  gaiaUrl: string,
  config: Required<LinkUpConfig>,
): Promise<string> {
  const tx = await makeContractCall({
    ...CONTRACTS.factory,
    functionName: 'update-profile',
    functionArgs: [stringUtf8CV(gaiaUrl)],
    senderKey: config.privateKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction(tx, config.network);
  if ('error' in result) throw new Error((result as any).error);
  return (result as any).txid as string;
}

/** Check if an address is registered */
export async function isRegistered(
  address: string,
  config: LinkUpConfig = {},
): Promise<boolean> {
  const result = await callReadOnlyFunction({
    ...CONTRACTS.factory,
    functionName: 'is-registered',
    functionArgs: [standardPrincipalCV(address)],
    network: config.network ?? 'mainnet',
    senderAddress: address,
  });
  return cvToValue(result) as boolean;
}

/** Get a user's profile */
export async function getUser(
  address: string,
  config: LinkUpConfig = {},
): Promise<any> {
  const result = await callReadOnlyFunction({
    ...CONTRACTS.factory,
    functionName: 'get-user',
    functionArgs: [standardPrincipalCV(address)],
    network: config.network ?? 'mainnet',
    senderAddress: address,
  });
  return cvToValue(result);
}

/** Get global LinkUp stats */
export async function getStats(config: LinkUpConfig = {}): Promise<{
  totalUsers: number;
  totalPosts: number;
  totalTips: number;
}> {
  const result = await callReadOnlyFunction({
    ...CONTRACTS.factory,
    functionName: 'get-stats',
    functionArgs: [],
    network: config.network ?? 'mainnet',
    senderAddress: CONTRACTS.factory.contractAddress,
  });
  const val = cvToValue(result) as any;
  return {
    totalUsers: Number(val['total-users']?.value ?? 0),
    totalPosts: Number(val['total-posts']?.value ?? 0),
    totalTips:  Number(val['total-tips']?.value ?? 0),
  };
}
