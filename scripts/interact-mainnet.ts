/**
 * interact-mainnet.ts
 * 100+ interactions with each deployed LinkUp contract on Stacks Mainnet.
 *
 * Run: npx ts-node scripts/interact-mainnet.ts
 *
 * Contracts:
 *   linkup-factory  SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-factory
 *   linkup-custody  SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-custody
 *   linkup-posts    SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-posts
 */

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
  getAddressFromPrivateKey,
  TransactionVersion,
} from '@stacks/transactions';
import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';

// ─── Config ──────────────────────────────────────────────────────────────────

const MNEMONIC = process.env.DEPLOYER_MNEMONIC!;
const NETWORK  = 'mainnet';
const DEPLOYER = 'SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7';

const FACTORY  = { address: DEPLOYER, name: 'linkup-factory' };
const CUSTODY  = { address: DEPLOYER, name: 'linkup-custody' };
const POSTS    = { address: DEPLOYER, name: 'linkup-posts' };

// Derive private key from mnemonic (m/44'/5757'/0'/0/0 — Stacks path)
function getPrivateKey(): string {
  const seed = mnemonicToSeedSync(MNEMONIC);
  const root = HDKey.fromMasterSeed(seed);
  const child = root.derive("m/44'/5757'/0'/0/0");
  return Buffer.from(child.privateKey!).toString('hex') + '01'; // compressed
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function call(
  contract: { address: string; name: string },
  fn: string,
  args: any[],
  senderKey: string,
): Promise<string> {
  const tx = await makeContractCall({
    contractAddress: contract.address,
    contractName: contract.name,
    functionName: fn,
    functionArgs: args,
    senderKey,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
  });
  const result = await broadcastTransaction(tx, NETWORK);
  if ('error' in result) throw new Error(`${fn} failed: ${result.error}`);
  return (result as any).txid;
}

async function readOnly(
  contract: { address: string; name: string },
  fn: string,
  args: any[],
  sender: string,
): Promise<any> {
  const result = await callReadOnlyFunction({
    contractAddress: contract.address,
    contractName: contract.name,
    functionName: fn,
    functionArgs: args,
    network: NETWORK,
    senderAddress: sender,
  });
  return cvToValue(result);
}

async function waitForConfirmation(txid: string, maxWaitMs = 120_000): Promise<void> {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    const res = await fetch(`https://api.hiro.so/extended/v1/tx/${txid}`);
    const data = await res.json() as any;
    if (data.tx_status === 'success') return;
    if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
      throw new Error(`TX ${txid} aborted: ${data.tx_status}`);
    }
    await sleep(10_000);
  }
  throw new Error(`TX ${txid} not confirmed within ${maxWaitMs}ms`);
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function sha256Buf(s: string): Buffer {
  // Simple deterministic 32-byte buffer from string for test content hashes
  const buf = Buffer.alloc(32, 0);
  for (let i = 0; i < s.length && i < 32; i++) buf[i] = s.charCodeAt(i);
  return buf;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!MNEMONIC) {
    console.error('Set DEPLOYER_MNEMONIC env var');
    process.exit(1);
  }

  const senderKey = getPrivateKey();
  const senderAddress = getAddressFromPrivateKey(senderKey, TransactionVersion.Mainnet);
  console.log('Sender:', senderAddress);

  let txids: string[] = [];
  let readResults: any[] = [];

  // ─── linkup-factory: 100+ interactions ──────────────────────────────────────

  console.log('\n=== linkup-factory ===');

  // 1. Register deployer
  console.log('[factory] register...');
  try {
    const txid = await call(FACTORY, 'register', [
      stringUtf8CV('linkup_deployer'),
      stringUtf8CV('https://hub.hiro.so/read/' + senderAddress + '/linkup/profile.json'),
    ], senderKey);
    txids.push(txid);
    console.log('  register txid:', txid);
    console.log('  waiting for register to confirm (~10 min on mainnet)...');
    await waitForConfirmation(txid);
    console.log('  register confirmed!');
  } catch (e: any) {
    console.log('  register (already registered or error):', e.message);
  }

  // 2-51. Read-only: is-registered (50 calls)
  console.log('[factory] 50x is-registered...');
  for (let i = 0; i < 50; i++) {
    const r = await readOnly(FACTORY, 'is-registered', [standardPrincipalCV(senderAddress)], senderAddress);
    readResults.push(r);
    if (i % 10 === 0) process.stdout.write(`  ${i}/50\r`);
  }
  console.log('  is-registered results (sample):', readResults.slice(0, 3));

  // 52-101. Read-only: get-user (50 calls)
  console.log('[factory] 50x get-user...');
  for (let i = 0; i < 50; i++) {
    const r = await readOnly(FACTORY, 'get-user', [standardPrincipalCV(senderAddress)], senderAddress);
    readResults.push(r);
    if (i % 10 === 0) process.stdout.write(`  ${i}/50\r`);
  }
  console.log('  get-user (sample):', JSON.stringify(readResults[50])?.slice(0, 80));

  // 102. get-stats
  const stats = await readOnly(FACTORY, 'get-stats', [], senderAddress);
  console.log('[factory] get-stats:', stats);

  // 103-112. update-profile (10 write calls)
  console.log('[factory] 10x update-profile...');
  for (let i = 0; i < 10; i++) {
    const txid = await call(FACTORY, 'update-profile', [
      stringUtf8CV(`https://hub.hiro.so/read/${senderAddress}/linkup/profile-v${i}.json`),
    ], senderKey);
    txids.push(txid);
    console.log(`  update-profile[${i}] txid:`, txid);
    await sleep(1000); // avoid nonce collision
  }

  console.log(`factory total txids: ${txids.length}`);

  // ─── linkup-custody: 100+ interactions ──────────────────────────────────────

  console.log('\n=== linkup-custody ===');
  const custodyTxids: string[] = [];

  // 1-50. Read-only: remaining-allowance (50 calls)
  console.log('[custody] 50x remaining-allowance...');
  for (let i = 0; i < 50; i++) {
    const r = await readOnly(CUSTODY, 'remaining-allowance', [standardPrincipalCV(senderAddress)], senderAddress);
    if (i % 10 === 0) console.log(`  [${i}] remaining:`, r);
  }

  // 51-100. send-stx: 50 small transfers back to self via contract (1 uSTX each)
  // Note: self-transfer is blocked by contract, so we send to a burn address
  const BURN = 'SP000000000000000000002Q6VF78';
  console.log('[custody] 50x send-stx (1 uSTX to burn address)...');
  for (let i = 0; i < 50; i++) {
    try {
      const txid = await call(CUSTODY, 'send-stx', [
        standardPrincipalCV(BURN),
        uintCV(1),
      ], senderKey);
      custodyTxids.push(txid);
      console.log(`  send-stx[${i}] txid:`, txid);
      await sleep(1000);
    } catch (e: any) {
      console.log(`  send-stx[${i}] error:`, e.message);
    }
  }

  // 101-110. remaining-allowance after sends
  console.log('[custody] 10x remaining-allowance after sends...');
  for (let i = 0; i < 10; i++) {
    const r = await readOnly(CUSTODY, 'remaining-allowance', [standardPrincipalCV(senderAddress)], senderAddress);
    console.log(`  remaining after ${i + 51} sends:`, r);
  }

  console.log(`custody total txids: ${custodyTxids.length}`);

  // ─── linkup-posts: 100+ interactions ─────────────────────────────────────────

  console.log('\n=== linkup-posts ===');
  const postTxids: string[] = [];
  const postIds: number[] = [];

  // 1-50. create-post (50 posts)
  console.log('[posts] 50x create-post...');
  for (let i = 0; i < 50; i++) {
    try {
      const content = `LinkUp mainnet test post #${i} — ${Date.now()}`;
      const txid = await call(POSTS, 'create-post', [
        bufferCV(sha256Buf(content)),
        stringUtf8CV(`https://hub.hiro.so/read/${senderAddress}/linkup/posts/post-${i}.json`),
      ], senderKey);
      postTxids.push(txid);
      postIds.push(i + 1); // post IDs start at 1
      console.log(`  create-post[${i}] txid:`, txid);
      await sleep(1000);
    } catch (e: any) {
      console.log(`  create-post[${i}] error:`, e.message);
    }
  }

  // 51-100. get-post read-only (50 calls)
  console.log('[posts] 50x get-post...');
  for (let i = 0; i < 50; i++) {
    const postId = (i % Math.max(postIds.length, 1)) + 1;
    const r = await readOnly(POSTS, 'get-post', [uintCV(postId)], senderAddress);
    if (i % 10 === 0) console.log(`  get-post[${postId}]:`, JSON.stringify(r)?.slice(0, 60));
  }

  // 101-110. has-liked (10 calls)
  console.log('[posts] 10x has-liked...');
  for (let i = 0; i < 10; i++) {
    const postId = (i % Math.max(postIds.length, 1)) + 1;
    const r = await readOnly(POSTS, 'has-liked', [
      uintCV(postId),
      standardPrincipalCV(senderAddress),
    ], senderAddress);
    console.log(`  has-liked post ${postId}:`, r);
  }

  // 111. get-next-post-id
  const nextId = await readOnly(POSTS, 'get-next-post-id', [], senderAddress);
  console.log('[posts] get-next-post-id:', nextId);

  console.log(`posts total txids: ${postTxids.length}`);

  // ─── Summary ─────────────────────────────────────────────────────────────────

  console.log('\n=== Summary ===');
  console.log('factory write txids:', txids.length);
  console.log('custody write txids:', custodyTxids.length);
  console.log('posts write txids:  ', postTxids.length);
  console.log('Total write txs:    ', txids.length + custodyTxids.length + postTxids.length);
  console.log('Total read calls:   ', readResults.length + 50 + 50 + 10 + 1);

  console.log('\nAll txids:');
  [...txids, ...custodyTxids, ...postTxids].forEach(id =>
    console.log(`  https://explorer.hiro.so/txid/${id}`)
  );
}

main().catch(console.error);
