# 🚀 Quick Deploy Instructions

## You're Ready to Deploy!

Everything is set up. Now you just need to deploy the contracts and update the environment variables.

### Step 1: Deploy Smart Contracts

```bash
# 1. Install Sui CLI (if not installed)
brew install sui

# 2. Create wallet and get testnet tokens
sui client new-address ed25519
sui client faucet

# 3. Deploy contracts
cd move/suilex
sui move build
sui client publish --gas-budget 100000000
```

### Step 2: Copy Object IDs

From the deployment output, copy these 3 IDs:

1. **Package ID** (the main package object)
2. **ProfileRegistry Object ID** (Type: `...::profile::ProfileRegistry`)
3. **Marketplace Object ID** (Type: `...::marketplace::Marketplace`)

### Step 3: Update .env.local

Edit `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_PROFILE_PACKAGE_ID=0x<YOUR_PACKAGE_ID>
NEXT_PUBLIC_MARKETPLACE_PACKAGE_ID=0x<YOUR_PACKAGE_ID> # Same as above
NEXT_PUBLIC_PROFILE_REGISTRY_ID=0x<YOUR_PROFILE_REGISTRY_ID>
NEXT_PUBLIC_MARKETPLACE_ID=0x<YOUR_MARKETPLACE_ID>
```

### Step 4: Run the App

```bash
npm run dev
```

Visit http://localhost:3000 and connect your wallet!

---

**Need detailed instructions?** See `DEPLOYMENT_GUIDE.md`

**Having issues?** Check the troubleshooting section in the deployment guide.
