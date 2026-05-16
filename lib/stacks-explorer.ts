const BASE = 'https://explorer.hiro.so';

export function txUrl(txId: string, network: 'mainnet' | 'testnet' = 'mainnet'): string {
  const chain = network === 'testnet' ? '?chain=testnet' : '';
  return `${BASE}/txid/${txId}${chain}`;
}

export function addressUrl(address: string, network: 'mainnet' | 'testnet' = 'mainnet'): string {
  const chain = network === 'testnet' ? '?chain=testnet' : '';
  return `${BASE}/address/${address}${chain}`;
}

export function contractUrl(
  address: string,
  name: string,
  network: 'mainnet' | 'testnet' = 'mainnet',
): string {
  const chain = network === 'testnet' ? '?chain=testnet' : '';
  return `${BASE}/txid/${address}.${name}${chain}`;
}
