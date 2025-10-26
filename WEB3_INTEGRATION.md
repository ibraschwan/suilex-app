# Suilex Web3 Integration Guide

## 🎯 Overview

Suilex is now a **fully decentralized** AI data marketplace powered by:
- **Sui Blockchain** for smart contracts, NFTs, and transactions
- **Walrus Protocol** for decentralized file storage
- **No traditional database** - all data lives on-chain or in Walrus

## 🏗️ Architecture

### Data Storage Strategy

| Data Type | Storage Location | Why |
|-----------|-----------------|-----|
| **User Profiles** | Sui Move Objects (on-chain) | Permanent, verifiable identity |
| **Dataset Files** | Walrus Blobs | Decentralized, cost-effective large file storage |
| **Dataset Metadata** | Walrus Blobs (JSON) | Flexible, off-chain metadata |
| **NFT Ownership** | Sui Blockchain | Immutable ownership records |
| **Marketplace Listings** | Sui Move Objects | Real-time price discovery |
| **Access Control** | Sui DataAccessCap NFTs | Provable purchase rights |

### Tech Stack

```
Frontend: Next.js 16 + React 19 + Tailwind v4
Blockchain: Sui (Move smart contracts)
Storage: Walrus Protocol
Wallet: @mysten/dapp-kit
State: React Query (@tanstack/react-query)
```

## 📦 Smart Contracts

### 1. Profile Module (`profile.move`)

**Purpose**: Store user profiles on-chain

**Key Features**:
- Unique username registry
- Verification levels (unverified, verified, official)
- Social links (Twitter, GitHub, website)
- Stats tracking (datasets, sales, revenue, ratings)
- Avatar stored in Walrus (blob ID on-chain)

**Functions**:
- `create_profile()` - Create new profile with username
- `update_profile()` - Update bio, avatar, social links
- `update_username()` - Change username (checks uniqueness)
- `increment_datasets()` - Called when minting DataNFT
- `increment_sales()` - Called on successful sale
- `add_rating()` - Add user rating

### 2. DataNFT Module (`data_nft.move`)

**Purpose**: Mint datasets as NFTs with Walrus references

**Key Features**:
- Stores Walrus blob IDs (data + metadata)
- On-chain searchable metadata (title, description, category)
- Verification status
- View/download counters
- DataAccessCap for buyer access control

**Functions**:
- `mint()` - Create new DataNFT
- `grant_access()` - Issue access capability to buyer
- `update_metadata()` - Update title/description
- `mark_verified()` - AI verification (admin/oracle)
- `increment_views()` - Track engagement
- `increment_downloads()` - Track usage

### 3. Marketplace Module (`marketplace.move`)

**Purpose**: List, buy, sell DataNFTs with SUI token

**Key Features**:
- Decentralized listings
- Platform fee (2.5% default)
- Instant settlement
- Price updates
- Access grant on purchase

**Functions**:
- `list_nft()` - List DataNFT for sale
- `buy_nft()` - Purchase with SUI payment
- `delist_nft()` - Remove listing
- `update_price()` - Change listing price
- `withdraw_fees()` - Platform fee collection (admin)

## 🔧 Setup & Deployment

### 1. Install Sui CLI

```bash
# Install Sui
brew install sui

# Or download from https://sui.io
curl -fsSL https://sui.io/install.sh | sh

# Verify installation
sui --version
```

### 2. Create Sui Wallet & Get Testnet Tokens

```bash
# Create new wallet
sui client new-address ed25519

# Set network to testnet
sui client switch --env testnet

# Get testnet SUI tokens
# Visit https://faucet.testnet.sui.io/
# Or use CLI:
sui client faucet
```

### 3. Compile & Deploy Smart Contracts

```bash
cd move/suilex

# Build contracts
sui move build

# Test contracts
sui move test

# Deploy to testnet
sui client publish --gas-budget 100000000

# Save the output! You'll need:
# - Package ID
# - ProfileRegistry Object ID
# - Marketplace Object ID
```

### 4. Update Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Sui Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Walrus Configuration
NEXT_PUBLIC_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space

# Contract Addresses (from deployment output)
NEXT_PUBLIC_PROFILE_PACKAGE_ID=0x...
NEXT_PUBLIC_MARKETPLACE_PACKAGE_ID=0x...
NEXT_PUBLIC_PROFILE_REGISTRY_ID=0x...
NEXT_PUBLIC_MARKETPLACE_ID=0x...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Suilex
```

### 5. Run the App

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## 🚀 User Flows

### Create Profile

1. User connects Sui wallet
2. Navigates to `/settings`
3. Uploads avatar → stored in **Walrus**
4. Enters username, bio, social links
5. Clicks "Create Profile"
6. Wallet prompts transaction approval
7. Profile minted as **Sui Move object**
8. Username registered in **ProfileRegistry**

### Upload Dataset

1. User must have profile
2. Navigates to `/upload`
3. Selects dataset file
4. File uploaded to **Walrus** → receives `data_blob_id`
5. Enters title, description, category, price
6. Metadata JSON created and uploaded to **Walrus** → `metadata_blob_id`
7. Clicks "Mint DataNFT"
8. Transaction creates **DataNFT** with Walrus references
9. Seller's profile stats increment

### List for Sale

1. Owner navigates to dataset detail
2. Clicks "List for Sale"
3. Sets price in SUI
4. Transaction creates **Listing** object
5. Listing appears in marketplace

### Purchase Dataset

1. Buyer finds dataset in `/marketplace`
2. Clicks "Buy Now"
3. Wallet prompts for SUI payment
4. Smart contract:
   - Takes payment
   - Splits platform fee (2.5%)
   - Pays seller (97.5%)
   - Mints **DataAccessCap** for buyer
   - Updates seller profile stats
5. Buyer receives access capability
6. Can now download dataset from Walrus

### View Profile

1. Navigate to `/profile/[address]`
2. Query blockchain for **Profile** object
3. Load avatar from Walrus
4. Display stats, datasets, social links
5. All data fetched directly from blockchain

## 📊 Data Flow Diagrams

### Profile Creation Flow

```
User → Upload Avatar → Walrus → blob_id
  ↓
Create Profile TX → Sui Blockchain
  ↓
Profile Move Object (on-chain)
  - username
  - bio
  - avatar_blob_id ← reference to Walrus
  - social links
  - stats
```

### Dataset Upload & Sale Flow

```
Dataset File → Walrus → data_blob_id
Metadata JSON → Walrus → metadata_blob_id
  ↓
Mint DataNFT TX → Sui Blockchain
  ↓
DataNFT Move Object
  - creator
  - data_blob_id ← Walrus reference
  - metadata_blob_id ← Walrus reference
  - title, description
  ↓
List for Sale TX
  ↓
Listing Move Object
  - nft_id
  - seller
  - price (in SUI)
```

### Purchase Flow

```
Buyer → Buy NFT TX
  ↓
Payment (SUI Coin)
  ↓
Split: 97.5% → Seller
       2.5% → Platform
  ↓
DataAccessCap → Buyer
  ↓
Buyer can download from Walrus using data_blob_id
```

## 🔐 Access Control

### How Buyers Access Purchased Data

1. Purchase creates `DataAccessCap` NFT
2. `DataAccessCap` contains:
   - `nft_id` - which dataset
   - `buyer` - who owns access
   - `granted_at` - timestamp
3. To download:
   - Frontend checks buyer owns `DataAccessCap` for this NFT
   - Fetches `data_blob_id` from DataNFT
   - Downloads from Walrus: `aggregator/v1/{data_blob_id}`

### Security Model

- **Walrus blobs are public** but unguessable (cryptographic IDs)
- **Access control** via DataAccessCap ownership verification
- **Immutable storage** - files can't be deleted/modified
- **On-chain proof** of purchase and access rights

## 🛠️ Development Guide

### Adding New Features

#### Add a Review System

```typescript
// lib/sui/contracts.ts

export const ReviewContract = {
  addReview(
    nftId: string,
    profileId: string,
    rating: number,
    comment: string
  ): TransactionBlock {
    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${CONTRACTS.REVIEW_PACKAGE}::review::add_review`,
      arguments: [
        tx.object(nftId),
        tx.object(profileId),
        tx.pure.u64(rating),
        tx.pure.string(comment),
      ],
    });

    return tx;
  },
};
```

#### Add Analytics Tracking

```typescript
// lib/sui/analytics.ts

export async function trackDatasetView(
  nftId: string,
  client: SuiClient
) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${CONTRACTS.PROFILE_PACKAGE}::data_nft::increment_views`,
    arguments: [tx.object(nftId)],
  });

  // Execute tx
  await client.signAndExecuteTransactionBlock({...});
}
```

### Querying Blockchain Data

```typescript
// Example: Get all listings
import { MarketplaceContract } from '@/lib/sui/contracts';
import { useSuiClient } from '@mysten/dapp-kit';

function useMarketplaceListings() {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['marketplace', 'listings'],
    queryFn: () => MarketplaceContract.getAllListings(client),
    refetchInterval: 10000, // Poll every 10s
  });
}
```

### Listening to Events

```typescript
// Listen for NFT minting events
import { SuiClient } from '@mysten/sui/client';

async function subscribeToMints(client: SuiClient) {
  const filter = {
    MoveEventType: `${CONTRACTS.PROFILE_PACKAGE}::data_nft::NFTMinted`,
  };

  const events = await client.queryEvents({
    query: filter,
    order: 'descending',
  });

  events.data.forEach(event => {
    console.log('NFT Minted:', event.parsedJson);
  });
}
```

## 🐛 Troubleshooting

### Contract Deployment Issues

**Error: Insufficient gas**
```bash
# Increase gas budget
sui client publish --gas-budget 500000000
```

**Error: Package dependencies**
```bash
# Update Sui framework
cd move/suilex
sui move build --skip-fetch-latest-git-deps false
```

### Walrus Upload Fails

**Error: 404 Not Found**
- Check Walrus testnet is running
- Verify WALRUS_PUBLISHER_URL is correct
- Try alternative endpoint: `https://publisher-devnet.walrus.space`

**Error: Timeout**
- Large files may timeout
- Split into smaller chunks
- Increase `epochs` parameter for longer storage

### Transaction Failures

**Error: Object not found**
- Ensure object IDs in `.env.local` are correct
- Check object hasn't been consumed
- Verify using: `sui client object <OBJECT_ID>`

**Error: Insufficient balance**
```bash
# Get more testnet tokens
sui client faucet
```

## 📚 Resources

- **Sui Docs**: https://docs.sui.io
- **Walrus Docs**: https://docs.walrus.site
- **Move Language**: https://move-language.github.io/move/
- **Sui Explorer**: https://suiexplorer.com/?network=testnet
- **Walrus Explorer**: https://walrus-testnet-explorer.vercel.app/

## 🚢 Production Deployment

### Mainnet Deployment Checklist

- [ ] Audit smart contracts
- [ ] Test all user flows on testnet
- [ ] Set up monitoring (Sentry, Datadog)
- [ ] Configure production Walrus endpoints
- [ ] Deploy contracts to Sui mainnet
- [ ] Update `.env.production` with mainnet addresses
- [ ] Set up admin wallet for fee withdrawal
- [ ] Enable rate limiting on uploads
- [ ] Add CAPTCHA to prevent spam
- [ ] Implement search indexing service
- [ ] Set up backup/archival for Walrus data

### Recommended Infrastructure

- **Frontend**: Vercel / Netlify
- **Blockchain**: Sui Mainnet RPC
- **Storage**: Walrus Mainnet
- **Monitoring**: Sentry + Custom Sui indexer
- **Analytics**: Privacy-friendly (Plausible, Fathom)

---

**Built with ❤️ on Sui + Walrus**
