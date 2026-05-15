import {
  makeContractCall,
  broadcastTransaction,
  callReadOnlyFunction,
  AnchorMode,
  uintCV,
  standardPrincipalCV,
  cvToValue,
} from '@stacks/transactions';
import { CONTRACTS, type LinkUpConfig } from './types';

/** Send STX via the linkup-custody contract (enforces daily 1000 STX limit) */
export async function sendStx(
  recipient: string,
  amountUstx: bigint,
  config: Required<LinkUpConfig>,
): Promise<string> {
  const tx = await makeContractCall({
    ...CONTRACTS.custody,
    functionName: 'send-stx',
    functionArgs: [standardPrincipalCV(recipient), uintCV(amountUstx)],
    senderKey: config.privateKey,
    network: config.network,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction(tx, config.network);
  if ('error' in result) throw new Error((result as any).error);
  return (result as any).txid as string;
}

/** Get remaining daily STX allowance for an address (in micro-STX) */
export async function remainingAllowance(
  address: string,
  config: LinkUpConfig = {},
): Promise<bigint> {
  const result = await callReadOnlyFunction({
    ...CONTRACTS.custody,
    functionName: 'remaining-allowance',
    functionArgs: [standardPrincipalCV(address)],
    network: config.network ?? 'mainnet',
    senderAddress: address,
  });
  return BigInt((cvToValue(result) as any)?.value ?? 0);
}

/** Convert STX to micro-STX */
export const toUstx = (stx: number): bigint => BigInt(Math.round(stx * 1_000_000));

/** Convert micro-STX to STX */
export const fromUstx = (ustx: bigint | number): number => Number(ustx) / 1_000_000;

/** Validate a Stacks mainnet address (SP...) */
export function isValidMainnetAddress(address: string): boolean {
  return /^SP[A-Z0-9]{38,}$/.test(address);
}

/** Validate a Stacks testnet address (ST...) */
export function isValidTestnetAddress(address: string): boolean {
  return /^ST[A-Z0-9]{38,}$/.test(address);
}
