export const DEPLOYER = 'SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7';

export const CONTRACTS = {
  factory: { contractAddress: DEPLOYER, contractName: 'linkup-factory' },
  custody: { contractAddress: DEPLOYER, contractName: 'linkup-custody' },
  posts:   { contractAddress: DEPLOYER, contractName: 'linkup-posts' },
} as const;

export type Network = 'mainnet' | 'testnet';

export interface LinkUpConfig {
  network?: Network;
  /** Private key hex (for write operations) */
  privateKey?: string;
}
