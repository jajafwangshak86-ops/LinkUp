# @linkup/stacks-sdk

> SDK for interacting with LinkUp smart contracts on Stacks/Bitcoin

[![npm](https://img.shields.io/npm/v/@linkup/stacks-sdk)](https://www.npmjs.com/package/@linkup/stacks-sdk)

## Install

```bash
npm install @linkup/stacks-sdk
```

## Contracts (Stacks Mainnet)

| Contract | Address |
|---|---|
| `linkup-factory` | `SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-factory` |
| `linkup-custody` | `SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-custody` |
| `linkup-posts` | `SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-posts` |

## Usage

```ts
import { getStats, isRegistered, remainingAllowance, getPost } from '@linkup/stacks-sdk';

// Read global stats (no key needed)
const stats = await getStats();
console.log(stats); // { totalUsers, totalPosts, totalTips }

// Check if address is registered
const registered = await isRegistered('SP...');

// Check remaining daily STX allowance
const allowance = await remainingAllowance('SP...');

// Get a post
const post = await getPost(1);
```

### Write operations (requires private key)

```ts
import { register, sendStx, createPost, toUstx } from '@linkup/stacks-sdk';

const config = { network: 'mainnet', privateKey: 'your-private-key-hex' };

// Register user
await register('username', 'https://hub.hiro.so/read/SP.../linkup/profile.json', config);

// Send STX (enforces 1000 STX/day limit)
await sendStx('SP_RECIPIENT', toUstx(1.5), config); // send 1.5 STX

// Create post
await createPost(contentHashBuffer, 'https://hub.hiro.so/...', config);
```
