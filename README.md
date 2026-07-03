# Chainless Checkout AI

**Sell digital products with one prompt. Let buyers pay from any chain. Settle and deliver on Arbitrum.**

Built for the UXMaxx Hackathon — Universal Accounts Track.

## What it does

### For merchants
Describe what you want to sell in plain English. AI generates the checkout page, NFT pass metadata, and gated content. One click publishes a payment link.

### For buyers
Open the link. Log in with Google (Magic). AI explains the cross-chain payment in plain English. Pay from any chain via Particle Universal Accounts (EIP-7702 mode). Receive an Arbitrum access pass NFT and an AI-personalized builder kit.

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Auth + Wallet | Magic SDK (embedded wallet, Google OAuth) |
| Chain Abstraction | Particle Universal Accounts SDK (EIP-7702 mode) |
| AI | OpenRouter (free models) |
| Smart Contracts | Solidity + Hardhat (Arbitrum Sepolia) |
| Database | Vercel Postgres + Drizzle ORM |
| UI | shadcn/ui + Tailwind CSS |

## Smart contracts

- **PaymentSettlement.sol** — Receives USDC payments, records settlements, emits events
- **AccessPassNFT.sol** — Upgradeable ERC-721 with role-based minting and token gating

Both deployed on Arbitrum Sepolia.

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill in API keys (Particle, Magic, OpenRouter)
npm run dev
```

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── merchant/
│   │   ├── page.tsx                # Dashboard
│   │   └── create/page.tsx         # AI checkout builder
│   ├── pay/[id]/
│   │   ├── page.tsx                # Buyer checkout
│   │   └── processing/page.tsx     # Payment progress
│   ├── receipt/[invoiceId]/page.tsx# Receipt + NFT pass
│   ├── access/[tokenId]/page.tsx   # AI builder kit
│   └── api/
│       ├── ai/                     # OpenRouter AI routes
│       ├── checkout/               # Product CRUD routes
│       └── webhook/particle        # Settlement webhook
├── components/
│   ├── AIProductPromptBox.tsx      # Merchant AI input
│   ├── GeneratedCheckoutPreview.tsx# AI output preview
│   ├── CheckoutProductCard.tsx     # Buyer product view
│   ├── AIPaymentExplainer.tsx      # AI payment explainer
│   ├── PaymentProgressTimeline.tsx # Animated progress
│   ├── ReceiptCard.tsx             # Payment receipt
│   ├── AccessPassCard.tsx          # NFT pass card
│   ├── AIBuilderKitGenerator.tsx   # Post-purchase AI kit
│   ├── MerchantSettlementTable.tsx # Merchant view
│   ├── MagicLoginButton.tsx        # Auth button
│   ├── MagicAuthProvider.tsx       # Auth context
│   └── UniversalAccountStatus.tsx  # UA balance
├── lib/
│   ├── ai.ts                       # OpenRouter wrapper
│   ├── magic.ts                    # Magic SDK wrapper
│   ├── particle.ts                 # Particle UA SDK wrapper
│   ├── contracts.ts                # Contract helpers
│   ├── store.ts                    # Zustand state
│   └── utils.ts                    # shadcn utils
├── db/
│   ├── schema.ts                   # Drizzle schema
│   └── index.ts                    # DB client
└── types/index.ts                  # Shared types
contracts/
├── PaymentSettlement.sol           # Payment contract
└── AccessPassNFT.sol               # NFT contract
```

## AI features

1. **Product generator** — Merchant prompt → structured JSON (name, price, NFT metadata, gated content)
2. **Payment explainer** — Payment context → plain English explanation with steps
3. **Builder kit** — User goal → personalized project resources (positioning, demo script, checklists)

## Demo flow

1. Merchant visits `/merchant/create`, types a prompt, AI generates the checkout
2. Merchant publishes → gets a shareable link
3. Buyer opens link, logs in with Google, sees AI payment explanation
4. Buyer clicks Pay → Particle UA moves value cross-chain (Base Sepolia → Arbitrum Sepolia)
5. Progress timeline animates through each step
6. Buyer receives receipt, NFT pass, and AI-generated builder kit

## Sponsors

- **Particle Network** — Universal Accounts + EIP-7702 for chain abstraction
- **Magic Labs** — Embedded wallet with social login
- **Arbitrum** — Settlement layer + NFT pass minting
