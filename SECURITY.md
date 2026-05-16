# Security

## Reporting Vulnerabilities

Please report security vulnerabilities to the repository maintainers via GitHub Issues marked as `security`.

## Non-Custodial Design

LinkUp is non-custodial by design:
- Users hold their own private keys via Hiro Wallet
- The `linkup-custody` contract enforces spending limits but cannot move funds without user signature
- No private keys are stored on any server

## Contract Auditing

All Clarity contracts are open source and verifiable on Hiro Explorer:
- [linkup-factory](https://explorer.hiro.so/txid/SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-factory)
- [linkup-custody](https://explorer.hiro.so/txid/SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-custody)
- [linkup-posts](https://explorer.hiro.so/txid/SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.linkup-posts)
