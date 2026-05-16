import { describe, it, expect } from 'vitest';
import { ERRORS, parseContractError } from '../src/errors';
import { toUstx, fromUstx, isValidMainnetAddress, isValidTestnetAddress } from '../src/custody';
import { CONTRACTS, DEPLOYER } from '../src/types';

describe('linkup-stacks-sdk', () => {
  it('toUstx converts STX to micro-STX', () => {
    expect(toUstx(1)).toBe(BigInt(1_000_000));
    expect(toUstx(0.5)).toBe(BigInt(500_000));
  });

  it('fromUstx converts micro-STX to STX', () => {
    expect(fromUstx(BigInt(1_000_000))).toBe(1);
    expect(fromUstx(BigInt(500_000))).toBe(0.5);
  });

  it('isValidMainnetAddress validates SP addresses', () => {
    expect(isValidMainnetAddress('SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7')).toBe(true);
    expect(isValidMainnetAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')).toBe(false);
    expect(isValidMainnetAddress('invalid')).toBe(false);
  });

  it('isValidTestnetAddress validates ST addresses', () => {
    expect(isValidTestnetAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')).toBe(true);
    expect(isValidTestnetAddress('SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7')).toBe(false);
  });

  it('parseContractError returns readable name', () => {
    expect(parseContractError(100)).toBe('DAILY LIMIT EXCEEDED');
    expect(parseContractError(200)).toBe('POST NOT FOUND');
    expect(parseContractError(999)).toBe('Unknown error (999)');
  });

  it('DEPLOYER address is correct', () => {
    expect(DEPLOYER).toBe('SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7');
  });

  it('CONTRACTS have correct names', () => {
    expect(CONTRACTS.factory.contractName).toBe('linkup-factory');
    expect(CONTRACTS.custody.contractName).toBe('linkup-custody');
    expect(CONTRACTS.posts.contractName).toBe('linkup-posts');
  });
});
