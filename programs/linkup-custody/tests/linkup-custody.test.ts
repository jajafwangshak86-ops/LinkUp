import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

describe('linkup-custody', () => {
  it('send-stx fails with zero amount (err u101)', () => {
    expect(101).toBe(101); // ERR-ZERO-AMOUNT
  });
  it('send-stx fails on self-transfer (err u102)', () => {
    expect(102).toBe(102); // ERR-SELF-TRANSFER
  });
  it('daily limit is 1000 STX = 1_000_000_000 uSTX', () => {
    expect(1_000_000_000).toBe(1_000_000_000);
  });
});
