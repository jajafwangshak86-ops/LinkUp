/** Convert STX to micro-STX (1 STX = 1,000,000 uSTX) */
export const toUstx = (stx: number): bigint => BigInt(Math.round(stx * 1_000_000));

/** Convert micro-STX to STX */
export const fromUstx = (ustx: bigint | number): number => Number(ustx) / 1_000_000;

/** Format STX amount for display */
export const formatStx = (stx: number, decimals = 4): string =>
  `${stx.toFixed(decimals)} STX`;
