# linkup-custody

Clarity smart contract for LinkUp — non-custodial STX transfers with daily spending guard.

## Functions

- `send-stx (recipient principal) (amount uint)` — Transfer STX with daily limit check
- `remaining-allowance (user principal)` — Read-only: remaining daily allowance in micro-STX

## Daily Limit

1,000 STX (1,000,000,000 micro-STX) per user per ~144 blocks (~1 day).

## Deploy

```bash
clarinet deployments apply --testnet
```
