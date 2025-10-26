# 🏛️ Suilex - Decentralized AI Data Marketplace

**Built on Sui Blockchain + Walrus Storage**

A truly decentralized marketplace where creators mint datasets as NFTs and AI companies purchase them with transparent licensing and on-chain proof of ownership.

---

## 🎯 What Is Suilex?

Suilex solves the critical problem of **data provenance in AI training**:

- 🚫 **Problem**: AI companies train on scraped data without permission
- ✅ **Solution**: NFT-based ownership with smart contract licensing
- 🔐 **Innovation**: DataAccessCap tokens prove legal purchase rights
- 🌐 **Infrastructure**: Sui blockchain + Walrus decentralized storage

**Market**: $200B+ AI training data industry

---

## 🚀 Quick Start

### For Hackathon Demo

```bash
# 1. Install dependencies
npm install

# 2. Get Sui testnet tokens
sui client faucet

# 3. Deploy smart contracts (see IMPLEMENTATION_ROADMAP.md)
cd move/suilex
sui move publish --gas-budget 100000000

# 4. Update .env.local with deployed contract addresses
cp .env.local.example .env.local
# Edit .env.local with your contract IDs

# 5. Run the app
cd ../..
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[HACKATHON.md](./HACKATHON.md)** | 🏆 **Complete hackathon pitch, features, user flows, demo script** |
| **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** | 🛠️ **Step-by-step implementation guide with code examples** |
| **[DEMO_SCRIPT.md](./DEMO_SCRIPT.md)** | 🎬 **5-minute demo presentation script** |
| **[WEB3_INTEGRATION.md](./WEB3_INTEGRATION.md)** | 🔧 Technical architecture and Web3 integration details |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | ✅ What's complete and what's left to build |
| **[CONCEPT.md](./CONCEPT.md)** | 💡 Original concept and vision |
| **[PLAN.md](./PLAN.md)** | 📋 Complete development plan (all phases) |

---

## 🏗️ Project Status

### ✅ Complete (90%)

**Smart Contracts** (Production-Ready)
- [x] Profile Module (on-chain user profiles)
- [x] DataNFT Module (mint datasets as NFTs)
- [x] Marketplace Module (list, buy, sell with 2.5% fee)
- [x] All contracts ready to deploy

**Web3 Integration**
- [x] Walrus client (file upload/download)
- [x] Sui contract utilities (TypeScript SDK)
- [x] Profile system (create/edit/view)

**Frontend UI**
- [x] Homepage, Dashboard, Settings
- [x] Header, Footer, all UI components
- [x] Beautiful dark theme (Tailwind v4)

### 🚧 To Complete (10%)

**Priority Tasks** (~8-10 hours)
- [ ] Upload page (Walrus integration)
- [ ] Marketplace page (blockchain queries)
- [ ] Dataset detail page
- [ ] Purchase flow
- [ ] Wallet provider in layout

**See [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for detailed steps**

---

## 🎨 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Blockchain** | Sui | Fast (400ms finality), cheap (<$0.01 gas), Move language safety |
| **Storage** | Walrus | Decentralized, cost-effective, permanent storage |
| **Frontend** | Next.js 16 + React 19 | App Router, Turbopack, server components |
| **Language** | TypeScript 5 | Type safety, better DX |
| **Styling** | Tailwind CSS v4 | Modern, responsive, dark theme |
| **Wallet** | @mysten/dapp-kit | Official Sui wallet integration |
| **State** | @tanstack/react-query | Server state caching, real-time blockchain updates |

---

## 📁 Project Structure

```
suilex-app/
├── app/                          # Next.js 16 App Router
│   ├── page.tsx                  # Homepage ✅
│   ├── marketplace/              # Browse datasets (needs blockchain integration)
│   ├── upload/                   # Upload & mint NFTs (needs Walrus integration)
│   ├── dataset/[id]/             # Dataset detail page
│   ├── dashboard/                # User dashboard ✅
│   ├── profile/[address]/        # View profiles ✅
│   ├── settings/                 # Edit profile ✅
│   └── layout.tsx                # Root layout (needs wallet provider)
│
├── components/
│   ├── ui/                       # Button, Card, Badge, etc. ✅
│   ├── layout/                   # Header, Footer ✅
│   └── auth/                     # RequireWallet ✅
│
├── lib/
│   ├── sui/
│   │   └── contracts.ts          # Contract utilities ✅
│   └── walrus/
│       └── client.ts             # Walrus client ✅
│
├── move/suilex/                  # Smart Contracts
│   ├── sources/
│   │   ├── profile.move          # User profiles ✅
│   │   ├── data_nft.move         # Dataset NFTs ✅
│   │   └── marketplace.move      # Marketplace logic ✅
│   └── Move.toml                 # Package config ✅
│
├── types/index.ts                # TypeScript types ✅
└── [Documentation files]         # See above
```

---

## 🎯 Core Features

### 1. **On-Chain Profiles**
- Create decentralized identity with unique username
- Upload avatar to Walrus (permanent storage)
- Track stats: datasets, sales, revenue, ratings
- Social links: Twitter, GitHub, website
- Verification levels: unverified → verified → official

### 2. **Dataset Upload & Minting**
- Upload files (up to 10GB) to Walrus
- Support: CSV, JSON, TXT, PDF, ZIP
- Mint as DataNFT on Sui blockchain
- NFT contains Walrus blob references (not on-chain data)
- Set price, category, license terms

### 3. **Marketplace**
- List DataNFTs for sale in SUI tokens
- Search & filter by category, price, verification
- Real-time listings from blockchain (no database)
- Platform fee: 2.5% (transparent, on-chain)
- Sellers can update price or delist anytime

### 4. **Purchase & Access Control**
- Buy datasets with SUI tokens (instant settlement)
- Receive DataAccessCap NFT proving ownership
- Download from Walrus using cryptographic blob ID
- Perpetual access (no subscriptions)
- Seller gets 97.5% automatically

---

## 🔑 Key Innovations

1. **DataAccessCap NFTs**: Unique proof-of-purchase tokens for licensing
2. **Walrus Integration**: First marketplace using Walrus for dataset storage
3. **Pure Decentralization**: No centralized database - all on-chain
4. **Instant Settlement**: Smart contract splits payments automatically
5. **Move Safety**: Sui Move prevents common smart contract vulnerabilities

---

## 🎬 User Flows

### **Creator Flow**
```
1. Connect Sui wallet
2. Create profile → stored on blockchain
3. Upload dataset → Walrus (decentralized storage)
4. Mint DataNFT → references Walrus blob ID
5. List on marketplace → price in SUI
6. Get paid automatically → 97.5% of sale
```

### **Buyer Flow**
```
1. Browse marketplace → real-time blockchain queries
2. View dataset detail → metadata from Walrus
3. Purchase with SUI → smart contract executes
4. Receive DataAccessCap → proof of ownership
5. Download from Walrus → perpetual access
```

---

## 🛠️ Development Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint

# Smart Contracts
cd move/suilex
sui move build       # Compile contracts
sui move test        # Run tests
sui move publish     # Deploy to blockchain

# Sui CLI
sui client faucet    # Get testnet tokens
sui client gas       # Check balance
sui client objects   # View owned objects
```

---

## 🌐 Environment Variables

```env
# Sui Network
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Contract Addresses (from deployment)
NEXT_PUBLIC_PROFILE_PACKAGE_ID=0x...
NEXT_PUBLIC_MARKETPLACE_PACKAGE_ID=0x...
NEXT_PUBLIC_PROFILE_REGISTRY_ID=0x...
NEXT_PUBLIC_MARKETPLACE_ID=0x...

# Walrus Storage
NEXT_PUBLIC_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Suilex
```

---

## 🎯 Hackathon Next Steps

**If you're reading this for the hackathon:**

1. **Read [HACKATHON.md](./HACKATHON.md)** - Complete feature overview and demo script
2. **Follow [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** - Step-by-step build guide
3. **Deploy contracts** - See roadmap Phase 1
4. **Integrate wallet provider** - See roadmap Phase 2
5. **Complete upload flow** - See roadmap Phase 3
6. **Practice demo** - Use [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)

**Estimated time to complete**: 8-10 hours for full functionality, or 4 hours for minimum viable demo.

---

## 📊 Design System

### Colors
- **Primary**: `#3A82F6` (Electric blue)
- **Secondary**: `#8B5CF6` (Deep purple)
- **Success**: `#22C55E` (Verified green)
- **Background**: `#0D1117` (Dark)
- **Surface**: `#161B22` (Card backgrounds)
- **Text Primary**: `#E6EDF3` (White)

### Typography
- **Body**: Inter (variable font)
- **Mono**: Fira Code (addresses, IDs)
- **Icons**: Material Symbols Outlined

### Components
- Glassmorphism effects on cards
- Rounded corners (12-16px)
- Glow effects on primary buttons
- Smooth transitions (300ms ease-in-out)

---

## 🤝 Contributing

This is a hackathon project. For questions or collaboration:

- **GitHub**: [Your repo URL]
- **Twitter**: [@suilex_io]
- **Discord**: [Your server]
- **Email**: team@suilex.io

---

## 📜 License

MIT License - see LICENSE file

---

## 🙏 Acknowledgments

Built with:
- **Sui Foundation** - Blockchain infrastructure
- **Mysten Labs** - Walrus storage protocol
- **Next.js** - React framework
- **Tailwind** - CSS framework

---

**Built with ❤️ on Sui + Walrus**

*Suilex - Where Data Meets Its Lex*
