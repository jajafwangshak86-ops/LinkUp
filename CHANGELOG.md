# Changelog

## [2.0.0] — LinkUp on Stacks/Bitcoin (2026-05-15)

### Breaking Changes
- Migrated from Solana to Stacks (Bitcoin L2)
- Replaced Anchor programs with Clarity smart contracts
- Replaced Ika 2PC-MPC with Hiro Wallet (user-held keys)
- Removed Encrypt FHE private tips

### Added
- `linkup-factory` — on-chain user registry with username uniqueness
- `linkup-custody` — STX transfers with 1000 STX/day spending guard
- `linkup-posts` — on-chain posts, likes, tips with Gaia content storage
- `linkup-stacks-sdk` npm package — TypeScript SDK for all 3 contracts
- `linkup-react` npm package — React integration helpers
- `linkup-cli` npm package — CLI tool for contract interactions
- Gaia decentralized chat (instant, no fees, user-owned)
- Live STX price card with 24h change
- Daily allowance progress bar
- Network badge component (mainnet/testnet)
- Feed post skeleton loading states
- On-chain post badge with Hiro Explorer link
- Stacks address card with copy + explorer link
- 446+ mainnet transactions across all 3 contracts

### Fixed
- All SOL/Solana references replaced with STX/Stacks
- Block-boundary day mismatch in custody contract
- Overflow guards in posts and custody contracts
- React Native crypto import (Node.js crypto → expo-crypto)
- Gaia chat race condition (per-message files instead of array)
