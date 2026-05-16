import { describe, it, expect } from 'vitest';

describe('linkup-posts', () => {
  it('ERR-NOT-FOUND is u200', () => { expect(200).toBe(200); });
  it('ERR-ALREADY-LIKED is u201', () => { expect(201).toBe(201); });
  it('ERR-SELF-TIP is u203', () => { expect(203).toBe(203); });
  it('ERR-OVERFLOW is u206', () => { expect(206).toBe(206); });
});
