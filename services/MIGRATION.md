# Service Migration Notes

## Removed Services (archived as .bak)

- `ika.ts` → replaced by `stacks.ts` (Ika 2PC-MPC → Hiro Wallet + Clarity contract)
- `encrypt.ts` → feature dropped (FHE private tips not available on Stacks)

## New Services

- `stacks.ts` — STX transfers via `@stacks/transactions`, contract allowance checks
