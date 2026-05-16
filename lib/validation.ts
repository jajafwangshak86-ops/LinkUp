/** Validate a Stacks mainnet address (SP...) */
export function isMainnetAddress(address: string): boolean {
  return /^SP[A-Z0-9]{38,}$/.test(address);
}

/** Validate a Stacks testnet address (ST...) */
export function isTestnetAddress(address: string): boolean {
  return /^ST[A-Z0-9]{38,}$/.test(address);
}

/** Validate any Stacks address */
export function isStacksAddress(address: string): boolean {
  return isMainnetAddress(address) || isTestnetAddress(address);
}

/** Validate STX amount (positive number, max 6 decimal places) */
export function isValidStxAmount(amount: string): boolean {
  const n = parseFloat(amount);
  return !isNaN(n) && n > 0 && /^\d+(\.\d{1,6})?$/.test(amount);
}
