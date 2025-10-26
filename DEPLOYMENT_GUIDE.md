# 🚀 Suilex Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Sui CLI installed
- A Sui wallet (can create one via CLI)

## Step-by-Step Deployment

### 1. Install Sui CLI

**macOS:**
```bash
brew install sui
```

**Linux/WSL:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

**Verify installation:**
```bash
sui --version
# Should output: sui 1.x.x
```

### 2. Create or Import Wallet

**Create new wallet:**
```bash
sui client new-address ed25519
```

**Import existing wallet:**
```bash
sui keytool import "<your-private-key>" ed25519
```

**Set active address:**
```bash
sui client active-address
# Copy this address - you'll need it
```

### 3. Get Testnet SUI Tokens

**Option 1: Web Faucet**
- Visit: https://faucet.testnet.sui.io/
- Enter your wallet address
- Click "Request Tokens"

**Option 2: CLI Faucet**
```bash
sui client faucet
# Wait for confirmation
sui client gas
# Verify you received tokens
```

**You need at least 1 SUI (~1,000,000,000 MIST) for deployment**

### 4. Configure Sui Client

```bash
# Switch to testnet (if not already)
sui client switch --env testnet

# Verify network
sui client envs
# Should show testnet as active (*)

# Check RPC endpoint
sui client active-env
# Should output: https://fullnode.testnet.sui.io:443
```

### 5. Build Smart Contracts

```bash
cd move/suilex

# Build contracts
sui move build

# Expected output:
# BUILDING suilex
# ...
# Build Successful
```

**If build fails:**
- Check `Move.toml` is correct
- Ensure all 3 `.move` files exist in `sources/`
- Try: `sui move build --skip-fetch-latest-git-deps`

### 6. Test Smart Contracts (Optional but Recommended)

```bash
sui move test

# Expected output:
# Running Move unit tests
# ...
# Test result: OK
```

### 7. Deploy to Testnet

```bash
sui client publish --gas-budget 100000000

# This will:
# 1. Compile contracts
# 2. Upload to Sui testnet
# 3. Execute deployment transaction
# 4. Create ProfileRegistry and Marketplace objects
```

**Expected output:**
```
Transaction Digest: 0xABCD1234...
╭─────────────────────────────────────────────────────────╮
│ Object Changes                                          │
├─────────────────────────────────────────────────────────┤
│ Created Objects:                                        │
│  ┌──                                                    │
│  │ ObjectID: 0x1234...PACKAGE_ID                       │
│  │ Type: Package                                        │
│  │ Version: 1                                           │
│  └──                                                    │
│  ┌──                                                    │
│  │ ObjectID: 0x5678...PROFILE_REGISTRY_ID              │
│  │ Type: 0x1234...::profile::ProfileRegistry           │
│  │ Owner: Shared                                        │
│  └──                                                    │
│  ┌──                                                    │
│  │ ObjectID: 0x9ABC...MARKETPLACE_ID                   │
│  │ Type: 0x1234...::marketplace::Marketplace           │
│  │ Owner: Shared                                        │
│  └──                                                    │
╰─────────────────────────────────────────────────────────╯
```

### 8. **IMPORTANT: Save These IDs!**

From the deployment output, you need to extract:

1. **Package ID** (the package object created)
   - Example: `0x1234abcd...`
   - This is `NEXT_PUBLIC_PROFILE_PACKAGE_ID`
   - Also `NEXT_PUBLIC_MARKETPLACE_PACKAGE_ID` (same package)

2. **ProfileRegistry Object ID**
   - Look for: `Type: ...::profile::ProfileRegistry`
   - Example: `0x5678efgh...`
   - This is `NEXT_PUBLIC_PROFILE_REGISTRY_ID`

3. **Marketplace Object ID**
   - Look for: `Type: ...::marketplace::Marketplace`
   - Example: `0x9abcijkl...`
   - This is `NEXT_PUBLIC_MARKETPLACE_ID`

**Copy these to a safe place!**

### 9. View on Sui Explorer

```bash
# View your transaction
open "https://suiexplorer.com/txblock/<TRANSACTION_DIGEST>?network=testnet"

# View the package
open "https://suiexplorer.com/object/<PACKAGE_ID>?network=testnet"
```

### 10. Configure Frontend

Create `.env.local` from template:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your deployment IDs:

```env
# Sui Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Walrus Configuration
NEXT_PUBLIC_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space

# Smart Contract Addresses (REPLACE WITH YOUR IDs FROM STEP 8)
NEXT_PUBLIC_PROFILE_PACKAGE_ID=0x1234... # Your package ID
NEXT_PUBLIC_MARKETPLACE_PACKAGE_ID=0x1234... # Same as above
NEXT_PUBLIC_PROFILE_REGISTRY_ID=0x5678... # Your ProfileRegistry object ID
NEXT_PUBLIC_MARKETPLACE_ID=0x9abc... # Your Marketplace object ID

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Suilex
```

### 11. Install Dependencies & Run

```bash
# Go back to app root
cd ../..

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

### 12. Test the Application

1. **Open browser:** http://localhost:3000
2. **Connect wallet:** Click "Connect Wallet" button
3. **Create profile:** Go to Settings → Create profile
4. **Check transaction:** View on Sui Explorer

## Troubleshooting

### Error: "Insufficient funds"

```bash
# Get more testnet tokens
sui client faucet

# Check balance
sui client gas
```

### Error: "Package dependencies failed"

```bash
cd move/suilex

# Update Sui framework dependency
sui move build --skip-fetch-latest-git-deps false

# Or try fixing Move.toml revision
```

Edit `Move.toml`:
```toml
[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "testnet" }
```

### Error: "Object not found" in Frontend

- Verify `.env.local` has correct object IDs
- Check IDs match deployment output exactly
- Ensure network is set to `testnet`
- Try restarting dev server: `npm run dev`

### Error: "Transaction failed"

```bash
# Check gas balance
sui client gas

# Try with higher gas budget
sui client publish --gas-budget 500000000
```

### Walrus Upload Fails

If Walrus testnet is down, try:
- Wait a few minutes and retry
- Check status: https://status.walrus.site
- Use alternative publisher: `https://publisher-devnet.walrus.space`

## Useful Commands

```bash
# View all your objects
sui client objects

# View specific object
sui client object <OBJECT_ID>

# View transaction details
sui client tx-block <TX_DIGEST>

# Check active address
sui client active-address

# List all addresses
sui client addresses

# Switch address
sui client switch --address <ADDRESS>
```

## Verification

After deployment, verify everything works:

1. ✅ Contracts deployed successfully
2. ✅ `.env.local` configured with correct IDs
3. ✅ App runs without errors
4. ✅ Wallet connection works
5. ✅ Profile creation transaction goes through
6. ✅ Can view profile on blockchain explorer

## Next Steps

Once deployment is successful:
- Day 2: Build upload portal with Walrus
- Day 3: Implement marketplace and purchase flow
- Production: Deploy to mainnet (repeat same steps with mainnet network)

---

## Quick Reference

**Testnet Faucet:** https://faucet.testnet.sui.io/
**Testnet Explorer:** https://suiexplorer.com/?network=testnet
**Walrus Docs:** https://docs.walrus.site
**Sui Docs:** https://docs.sui.io

**Need help?** Check `WEB3_INTEGRATION.md` for detailed architecture info.
