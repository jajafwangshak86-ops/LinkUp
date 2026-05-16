# Contributing to LinkUp

## Setup

```bash
git clone https://github.com/jajafwangshak86-ops/LinkUp.git
cd LinkUp
pnpm install
```

## Smart Contracts

```bash
# Install Clarinet
curl -fsSL https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64-glibc.tar.gz | tar xz
sudo mv clarinet /usr/local/bin/

# Check contracts
clarinet check

# Run tests
cd sdk && npm test
```

## SDK Development

```bash
cd sdk
npm install
npm run build
npm test
```

## Mobile App

```bash
pnpm start        # Start Expo dev server
pnpm android      # Run on Android
pnpm ios          # Run on iOS
pnpm web          # Run on web
```

## Contract Addresses (Mainnet)

- `linkup-factory`: `SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-factory`
- `linkup-custody`: `SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-custody`
- `linkup-posts`: `SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-posts`
