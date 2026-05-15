# Changelog

## [1.0.0] — LinkUp on Stacks/Bitcoin

### Breaking Changes
- Migrated from Solana to Stacks (Bitcoin L2)
- Replaced Anchor programs with Clarity smart contract (`linkup-custody`)
- Replaced Ika 2PC-MPC custody with Hiro Wallet (user-held keys)
- Removed Encrypt FHE private tips (no equivalent on Stacks)

### Added
- `programs/linkup-custody/linkup-custody.clar` — Clarity contract with daily STX spending guard
- `services/stacks.ts` — STX transfers via `@stacks/transactions`
- `lib/stacks-config.ts` — Hiro API configuration
- `lib/stx.ts` — STX/micro-STX conversion utilities
- `lib/stacks-address.ts` — Stacks address validation and shortening
- `lib/stacks-connect.ts` — Payment deep link builder
- `hooks/useStxBalance.ts` — Direct Hiro API balance query
- `hooks/useContractAllowance.ts` — Daily allowance query
- `hooks/useTransactionStatus.ts` — Transaction confirmation polling
- `hooks/useBlockHeight.ts` — Current Stacks block height
- `hooks/useStacksExplorer.ts` — Open transactions in Hiro Explorer

### Removed
- `services/ika.ts` (archived as .bak)
- `services/encrypt.ts` (archived as .bak)
- `lib/solana-config.ts` (archived as .bak)
- `hooks/useSeekerBalance.ts` (Solana-specific)
- `bin/ika-dwallet-helper` (Rust binary for Ika gRPC)
