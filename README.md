# LinkUp

> **Social payments on Bitcoin — non-custodial by design, private by default.**

LinkUp is a React Native social payment application that combines a familiar social feed, peer-to-peer payments, and real-time chat with institutional-grade security infrastructure powered by [Ika](https://solana-pre-alpha.ika.xyz) and [Encrypt](https://docs.encrypt.xyz).

---

## The Problem

Every social payment app today makes the same two compromises:

1. **Custodial risk.** The platform holds your private keys. One server breach drains every wallet. Users trust the company, not cryptography.
2. **Zero privacy.** All on-chain payment amounts are permanently public. Anyone — competitors, stalkers, tax authorities — can see exactly what you send and to whom.

LinkUp eliminates both without sacrificing usability.

---

## Target Users & Use Cases

| User | Use Case |
|---|---|
| Creators & influencers | Receive tips from followers without exposing income on-chain |
| Freelancers | Send invoices and receive payments with confidential amounts |
| Friend groups | Split bills and send money socially without a custodial intermediary |
| Institutions | Require non-custodial, policy-enforced signing for treasury operations |

---

## How LinkUp Uses Ika and Encrypt

### Ika — Zero-Trust Custody

**Program:** `programs/linkup-custody` | **SDK:** `ika-dwallet-anchor`

The current industry standard for social payment apps is a custodial backend — the server holds every user's private key. LinkUp replaces this with **dWallets**: programmable signing keys co-controlled by the user and the Ika Network via 2PC-MPC.

**Flow:**

```
User signs up
    → Backend calls Ika gRPC (DKG)
    → Ika Network produces a dWallet keypair
    → linkup-custody program transfers authority to its CPI PDA
    → Backend can enforce rules (2FA, spending limits) but cannot sign alone

User sends SOL
    → Backend verifies guards (2FA, daily cap)
    → Calls approve_transfer on-chain → creates MessageApproval PDA
    → Ika Network detects PDA → produces signature via 2PC-MPC
    → Transaction broadcasts with a signature the backend never held
```

**What this means:** Even if the LinkUp backend is fully compromised, an attacker cannot move user funds. The signing authority is distributed across the Ika validator network.

---

### Encrypt — Confidential Payments

**Program:** `programs/linkup-privacy` | **SDK:** `encrypt-anchor`, `@encrypt.xyz/pre-alpha-solana-client`

Tip amounts sent inside LinkUp chat are encrypted using **Fully Homomorphic Encryption (FHE)**. The computation runs on ciphertexts — no plaintext amount ever appears on-chain, in logs, or in any explorer.

**Flow:**

```
User sends a private tip
    → Backend encrypts the amount via Encrypt gRPC → creates ciphertext account
    → execute_private_tip instruction runs confidential_transfer FHE graph on-chain
    → Encrypt executor evaluates the graph → commits new encrypted balances
    → Chat UI shows 🔒 "Private tip" — amount hidden from everyone except sender & receiver
```

**FHE function (on-chain):**
```rust
#[encrypt_fn]
fn confidential_transfer(
    sender_balance: EUint64,
    receiver_balance: EUint64,
    amount: EUint64,
) -> (EUint64, EUint64) {
    let has_funds    = sender_balance >= amount;
    let new_sender   = if has_funds { sender_balance   - amount } else { sender_balance };
    let new_receiver = if has_funds { receiver_balance + amount } else { receiver_balance };
    (new_sender, new_receiver)
}
```

Validators compute on ciphertexts. The actual values are never decrypted on-chain.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│           LinkUp Mobile (Expo / RN)          │
│  Feed · Wallet · Chat · Pay · Mini-Apps      │
└────────────────────┬────────────────────────┘
                     │ REST + Pusher
┌────────────────────▼────────────────────────┐
│         Backend (NestJS · MongoDB)           │
│                                              │
│  POST /chats/:id/tip          → SOL transfer │
│  POST /chats/:id/private-tip  → FHE tip      │
│  POST /auth/signup            → DKG dWallet  │
│  POST /wallet/send            → approve_tx   │
│                                              │
│  services/ika.ts     → Ika gRPC wrapper      │
│  services/encrypt.ts → Encrypt gRPC wrapper  │
│  bin/ika-dwallet-helper → Rust DKG binary    │
└────────────────────┬────────────────────────┘
                     │ Solana Devnet
┌────────────────────▼────────────────────────┐
│              On-Chain Programs               │
│                                              │
│  linkup-custody  (Ika dWallet custody)       │
│  linkup-privacy  (Encrypt FHE private tips)  │
│                                              │
│  Ika Program   87W54kGYFQ1rgWqMeu4XTPHWXWmX │
│  Encrypt Prog  4ebfzWdKnrnGseuQpezXdG8yCdHq │
└─────────────────────────────────────────────┘
```

---

## Program IDs

| Program | Network | Address |
|---|---|---|
| Ika dWallet | Devnet | `87W54kGYFQ1rgWqMeu4XTPHWXWmXSQCcjm8vCTfiq1oY` |
| Encrypt | Devnet | `4ebfzWdKnrnGseuQpezXdG8yCdHqwQ1SSBHD3bWArND8` |
| linkup-custody | Devnet | `8nWefFt12D1t6TyjBfk6V4CuTeVwjKNXHMcpZQqSpJVF` |
| linkup-privacy | Devnet | `9SszUmTNFZq2Hnb4Y3XPLAsDwc4CVQZuaxcDbxmtqWe4` |

**Live Backend:** `https://linkup-backend.onrender.com/api`  
**Health:** `https://linkup-backend.onrender.com/api/health`

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| pnpm | 9+ |
| Rust | edition 2021 |
| Anchor CLI | 1.x (`avm install 1.0.0 && avm use 1.0.0`) |
| Solana CLI | 3.x |
| Expo CLI | latest |

---

### 1. Deploy On-Chain Programs

```bash
solana config set --url devnet
solana airdrop 2   # fund your deploy wallet

# Custody program (Ika)
cd programs/linkup-custody
anchor build && anchor deploy
# → note the Program ID

# Privacy program (Encrypt)
cd ../linkup-privacy
anchor build && anchor deploy
# → note the Program ID
```

---

### 2. Build the Ika gRPC Helper

The Ika gRPC protocol uses BCS serialization (Rust-native). This binary handles DKG and returns JSON to the Node.js backend.

```bash
cd programs/ika-helper
cargo build --release
mkdir -p ../../bin
cp target/release/ika-dwallet-helper ../../bin/
```

---

### 3. Configure Environment

**Backend** (`Sol-App/apps/backend/.env`):
```env
SOLANA_RPC_URL=https://api.devnet.solana.com
ENCRYPTION_KEY=<32-byte hex key>
LINKUP_CUSTODY_PROGRAM_ID=<from step 1>
LINKUP_PRIVACY_PROGRAM_ID=<from step 1>
IKA_HELPER_BIN=./bin/ika-dwallet-helper
```

**Mobile App** (`LinkUp/.env`):
```env
EXPO_PUBLIC_API_URL=https://linkup-backend.onrender.com/api
EXPO_PUBLIC_PUSHER_KEY=<pusher key>
EXPO_PUBLIC_PUSHER_CLUSTER=mt1
```

---

### 4. Run

```bash
# Backend
cd Sol-App/apps/backend
pnpm install && pnpm start:dev

# Mobile (separate terminal)
cd LinkUp
pnpm install && pnpm start
# Press 'a' → Android  |  'i' → iOS  |  'w' → Web
```

---

## Testing the Features

### Private Tip (Encrypt FHE)

1. Sign in and open any chat conversation
2. Tap the **$** icon in the message bar
3. Enter an amount and toggle **Private Tip** on
4. Tap **Send Privately**

**Expected result:** The message thread shows a purple 🔒 bubble — *"Sent a private tip · Amount encrypted via FHE"*. No SOL amount appears on-chain or in any block explorer.

---

### dWallet Custody (Ika)

1. Sign up with a new account
2. Check backend logs — you will see `DKG complete: dWalletId=...`
3. Send SOL from the Wallet tab
4. Check backend logs — you will see `MessageApproval created`, then `Signature committed by Ika network`

**Expected result:** The transaction is signed by the Ika network. The backend keypair alone cannot produce a valid signature.

---

## Repository Structure

```
LinkUp/                          # React Native mobile app
├── app/                         # Expo Router screens
├── components/                  # UI components
├── hooks/                       # React Query hooks
├── lib/api.ts                   # API client
├── services/
│   ├── ika.ts                   # Ika dWallet backend service
│   └── encrypt.ts               # Encrypt FHE backend service
├── types/index.ts               # Shared TypeScript types
└── programs/
    ├── linkup-custody/          # Anchor program — Ika dWallet custody
    ├── linkup-privacy/          # Anchor program — Encrypt FHE private tips
    └── ika-helper/              # Rust binary — Ika gRPC DKG client

Sol-App/apps/backend/            # NestJS backend
├── src/modules/
│   ├── chats/                   # Chat + private tip routes
│   ├── wallet/                  # Wallet + dWallet send
│   └── auth/                    # Signup + dWallet creation
└── src/schemas/
    └── message.schema.ts        # isPrivateTip, ciphertextId fields
```

---

## Pre-Alpha Notice

Both Ika and Encrypt are pre-alpha. The on-chain programs, gRPC APIs, and account structures are fully implemented and live on Solana devnet. The cryptographic guarantees — distributed 2PC-MPC signing and real FHE computation — are currently simulated by a single mock server. No code changes are required when mainnet launches; only environment variable updates are needed.

---

## Tech Stack

- **Mobile:** React Native, Expo Router, NativeWind (Tailwind), TanStack Query, Zustand
- **Backend:** NestJS, MongoDB, Pusher, `@solana/web3.js`, `@encrypt.xyz/pre-alpha-solana-client`
- **On-chain:** Anchor v1, `ika-dwallet-anchor`, `encrypt-anchor`, `encrypt-dsl`
- **Infrastructure:** Solana Devnet, Ika gRPC (`pre-alpha-dev-1.ika.ika-network.net`), Encrypt gRPC (`pre-alpha-dev-1.encrypt.ika-network.net`)
