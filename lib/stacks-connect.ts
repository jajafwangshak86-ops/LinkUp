import { stacksConfig } from './stacks-config';

/** Build a Stacks wallet deep link for payment requests */
export function buildPaymentDeepLink(recipient: string, amountUstx: bigint, memo?: string): string {
  const params = new URLSearchParams({
    recipient,
    amount: amountUstx.toString(),
    ...(memo ? { memo } : {}),
    network: stacksConfig.network,
  });
  return `stacks:transfer?${params.toString()}`;
}
