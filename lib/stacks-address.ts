/** Validate a Stacks address (mainnet SP... or testnet ST...) */
export function isValidStacksAddress(address: string): boolean {
  return /^S[PT][A-Z0-9]{38,}$/.test(address);
}

/** Shorten a Stacks address for display: SP1ABC...XYZ9 */
export function shortenAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
