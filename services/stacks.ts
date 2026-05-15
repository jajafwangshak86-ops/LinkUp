/**
 * Stacks wallet service — replaces services/ika.ts
 *
 * Uses @stacks/transactions for STX transfers.
 * Users hold their own keys via Hiro Wallet; the backend only
 * calls the read-only contract functions for guard checks.
 */

import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  uintCV,
  standardPrincipalCV,
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion,
  StacksMainnet,
  StacksTestnet,
  fetchCallReadOnlyFunction,
  cvToValue,
} from '@stacks/transactions';

const NETWORK = process.env.STACKS_NETWORK === 'mainnet'
  ? new StacksMainnet()
  : new StacksTestnet();

const CONTRACT_ADDRESS = process.env.LINKUP_CUSTODY_CONTRACT_ADDRESS ?? '';
const CONTRACT_NAME    = 'linkup-custody';

// ─── Address helpers ──────────────────────────────────────────────────────────

export function getStacksAddress(privateKeyHex: string): string {
  const version = process.env.STACKS_NETWORK === 'mainnet'
    ? TransactionVersion.Mainnet
    : TransactionVersion.Testnet;
  return getAddressFromPrivateKey(privateKeyHex, version);
}

// ─── Guard check ──────────────────────────────────────────────────────────────

export async function getRemainingAllowance(userAddress: string): Promise<bigint> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'remaining-allowance',
    functionArgs: [standardPrincipalCV(userAddress)],
    network: NETWORK,
    senderAddress: userAddress,
  });
  return BigInt(cvToValue(result) as string);
}

// ─── Send STX via contract ────────────────────────────────────────────────────

export interface SendStxParams {
  senderPrivateKey: string; // hex — stored encrypted in DB
  recipientAddress: string;
  amountUstx: bigint; // use toUstx() from lib/stx.ts
}

export async function sendStxViaContract(params: SendStxParams): Promise<string> {
  const { senderPrivateKey, recipientAddress, amountUstx } = params;

  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'send-stx',
    functionArgs: [
      standardPrincipalCV(recipientAddress),
      uintCV(amountUstx),
    ],
    senderKey: senderPrivateKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
  });

  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  if ('error' in result) throw new Error(String(result.error));
  return result.txid;
}
