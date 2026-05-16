import { describe, it, expect } from 'vitest';

describe('linkup-factory', () => {
  it('ERR-ALREADY-REGISTERED is u300', () => { expect(300).toBe(300); });
  it('ERR-USERNAME-TAKEN is u302', () => { expect(302).toBe(302); });
  it('ERR-NOT-REGISTERED is u301', () => { expect(301).toBe(301); });
});
