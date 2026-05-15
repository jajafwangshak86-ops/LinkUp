/**
 * interact-mainnet-writes.ts
 * 100 write txs to each LinkUp contract on Stacks Mainnet.
 * Sends in batches of 24 (Stacks chain limit), waits for confirmation between batches.
 */

import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  uintCV,
  bufferCV,
  stringUtf8CV,
  standardPrincipalCV,
  getAddressFromPrivateKey,
  TransactionVersion,
} from '@stacks/transactions';
import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';

const MNEMONIC  = process.env.DEPLOYER_MNEMONIC!;
const NETWORK   = 'mainnet';
const DEPLOYER  = 'SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7';
const BURN_ADDR = 'SP000000000000000000002Q6VF78';
const BATCH     = 24; // Stacks mainnet max unconfirmed chain = 25

const FACTORY = { address: DEPLOYER, name: 'linkup-factory' };
const CUSTODY = { address: DEPLOYER, name: 'linkup-custody' };
const POSTS   = { address: DEPLOYER, name: 'linkup-posts' };

function getPrivateKey(): string {
  const seed = mnemonicToSeedSync(MNEMONIC);
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive("m/44'/5757'/0'/0/0");
  return Buffer.from(child.privateKey!).toString('hex') + '01';
}

function hashBuf(s: string): Buffer {
  const buf = Buffer.alloc(32, 0);
  for (let i = 0; i < s.length && i < 32; i++) buf[i] = s.charCodeAt(i);
  return buf;
}

async function getConfirmedNonce(): Promise<number> {
  const r = await fetch(`https://api.hiro.so/v2/accounts/${DEPLOYER}?proof=0`);
  const d = await r.json() as any;
  return d.nonce as number;
}

async function waitConfirmed(targetNonce: number): Promise<number> {
  console.log(`  ... waiting for nonce >= ${targetNonce} to confirm ...`);
  while (true) {
    await new Promise(r => setTimeout(r, 20_000));
    const confirmed = await getConfirmedNonce();
    console.log(`  ... confirmed nonce: ${confirmed}`);
    if (confirmed >= targetNonce) return confirmed;
  }
}

async function send(
  contract: { address: string; name: string },
  fn: string,
  args: any[],
  key: string,
  nonce: number,
): Promise<string> {
  const tx = await makeContractCall({
    contractAddress: contract.address,
    contractName: contract.name,
    functionName: fn,
    functionArgs: args,
    senderKey: key,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    nonce: BigInt(nonce),
    fee: BigInt(2000),
  });
  const result = await broadcastTransaction(tx, NETWORK);
  if ('error' in result) {
    const r = result as any;
    console.error(`  ✗ [${nonce}] ${fn}: ${r.error} ${r.reason ?? ''}`);
    return '';
  }
  const txid = (result as any).txid as string;
  console.log(`  ✓ [${nonce}] ${fn}: ${txid}`);
  return txid;
}

async function sendAll(
  txs: Array<{ contract: { address: string; name: string }; fn: string; args: any[] }>,
  key: string,
  startNonce: number,
): Promise<{ txids: string[]; nextNonce: number }> {
  const txids: string[] = [];
  let nonce = startNonce;

  for (let i = 0; i < txs.length; i += BATCH) {
    const slice = txs.slice(i, i + BATCH);
    for (const t of slice) {
      const id = await send(t.contract, t.fn, t.args, key, nonce++);
      if (id) txids.push(id);
    }
    if (i + BATCH < txs.length) {
      nonce = await waitConfirmed(nonce - 1);
    }
  }

  return { txids, nextNonce: nonce };
}

async function main() {
  if (!MNEMONIC) { console.error('Set DEPLOYER_MNEMONIC'); process.exit(1); }

  const key    = getPrivateKey();
  const sender = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);
  let nonce    = await getConfirmedNonce();
  console.log(`Sender: ${sender} | Nonce: ${nonce}\n`);

  // ── factory: 100x update-profile ─────────────────────────────────────────
  console.log('=== linkup-factory: 100x update-profile ===');
  const { txids: fTxids, nextNonce: n1 } = await sendAll(
    Array.from({ length: 100 }, (_, i) => ({
      contract: FACTORY,
      fn: 'update-profile',
      args: [stringUtf8CV(`https://hub.hiro.so/read/${sender}/linkup/profile-v${i}.json`)],
    })),
    key, nonce,
  );
  nonce = await waitConfirmed(n1 - 1);

  // ── custody: 100x send-stx ────────────────────────────────────────────────
  console.log('\n=== linkup-custody: 100x send-stx ===');
  const { txids: cTxids, nextNonce: n2 } = await sendAll(
    Array.from({ length: 100 }, () => ({
      contract: CUSTODY,
      fn: 'send-stx',
      args: [standardPrincipalCV(BURN_ADDR), uintCV(1)],
    })),
    key, nonce,
  );
  nonce = await waitConfirmed(n2 - 1);

  // ── posts: 100x create-post ───────────────────────────────────────────────
  console.log('\n=== linkup-posts: 100x create-post ===');
  const { txids: pTxids } = await sendAll(
    Array.from({ length: 100 }, (_, i) => ({
      contract: POSTS,
      fn: 'create-post',
      args: [
        bufferCV(hashBuf(`LinkUp post #${i} ${Date.now()}`)),
        stringUtf8CV(`https://hub.hiro.so/read/${sender}/linkup/posts/post-${i}.json`),
      ],
    })),
    key, nonce,
  );

  const all = [...fTxids, ...cTxids, ...pTxids];
  console.log(`\n=== Done: ${all.length}/300 successful ===`);
  console.log(`Explorer: https://explorer.hiro.so/address/${sender}`);
}

main().catch(console.error);
