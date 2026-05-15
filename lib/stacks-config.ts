// Stacks & Price Feed Configuration
export const stacksConfig = {
  network: (process.env.EXPO_PUBLIC_STACKS_NETWORK as 'mainnet' | 'testnet') || 'testnet',
  apiUrl: process.env.EXPO_PUBLIC_STACKS_NETWORK === 'mainnet'
    ? 'https://api.hiro.so'
    : 'https://api.testnet.hiro.so',
  explorerUrl: process.env.EXPO_PUBLIC_STACKS_NETWORK === 'mainnet'
    ? 'https://explorer.hiro.so'
    : 'https://explorer.hiro.so/?chain=testnet',
  contractAddress: process.env.EXPO_PUBLIC_CUSTODY_CONTRACT_ADDRESS || '',
  contractName: 'linkup-custody',
} as const;
