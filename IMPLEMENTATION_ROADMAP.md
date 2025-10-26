# 🛠️ Implementation Roadmap for Hackathon

**Goal**: Complete the remaining 10% to have a fully functional demo

**Estimated Time**: 8-12 hours

---

## 📋 Pre-Flight Checklist

### Step 0: Environment Setup (15 minutes)

**Required:**
- [ ] Sui CLI installed (`brew install sui`)
- [ ] Sui wallet with testnet SUI (get from faucet)
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)

**Get Testnet Tokens:**
```bash
# Create/switch to testnet
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet

# Get tokens (repeat 3-4 times to have enough for testing)
sui client faucet
sui client faucet
sui client faucet

# Check balance
sui client gas
```

---

## 🎯 Phase 1: Deploy Smart Contracts (1 hour)

### Step 1.1: Build & Test Contracts

```bash
cd move/suilex

# Build contracts
sui move build

# Run tests (if any)
sui move test

# Check for errors
```

**Expected Output:**
```
BUILDING suilex
Successfully verified dependencies on-chain against source.
```

### Step 1.2: Deploy to Testnet

```bash
# Deploy (gas budget: 100M MIST = 0.1 SUI)
sui client publish --gas-budget 100000000
```

**Expected Output:**
```
Transaction Digest: AbcDeFgHiJkLmNoPqRsTuVwXyZ123456789...

Published Objects:
- Package ID: 0x1234567890abcdef...
- ProfileRegistry: 0xaabbccddeeff...
- Marketplace: 0x112233445566...
```

### Step 1.3: Save Contract Addresses

**Create `.env.local`:**
```bash
cd ../..
cp .env.local.example .env.local
```

**Edit `.env.local`:**
```env
# Sui Network
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Contract Addresses (UPDATE THESE with your deployment output)
NEXT_PUBLIC_PROFILE_PACKAGE_ID=0x1234567890abcdef...
NEXT_PUBLIC_MARKETPLACE_PACKAGE_ID=0x1234567890abcdef...  # Same as PROFILE_PACKAGE_ID
NEXT_PUBLIC_PROFILE_REGISTRY_ID=0xaabbccddeeff...
NEXT_PUBLIC_MARKETPLACE_ID=0x112233445566...

# Walrus Configuration
NEXT_PUBLIC_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Suilex
```

---

## 🎯 Phase 2: Wallet Integration (30 minutes)

### Step 2.1: Create Sui Configuration

**File**: `lib/sui/config.ts`

```typescript
import { getFullnodeUrl } from '@mysten/sui/client';
import { createNetworkConfig } from '@mysten/dapp-kit';

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl('testnet'),
  },
  mainnet: {
    url: getFullnodeUrl('mainnet'),
  },
});

export { networkConfig, useNetworkVariable, useNetworkVariables };
```

### Step 2.2: Update Root Layout with Providers

**File**: `app/layout.tsx`

```typescript
import { Inter } from 'next/font/google';
import { Fira_Code } from 'next/font/google';
import './globals.css';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { networkConfig } from '@/lib/sui/config';
import '@mysten/dapp-kit/dist/index.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
});

const queryClient = new QueryClient();

export const metadata = {
  title: 'Suilex - Decentralized AI Data Marketplace',
  description: 'Buy and sell verified datasets as NFTs on Sui blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="antialiased bg-bg-dark font-sans">
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
            <WalletProvider>
              {children}
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### Step 2.3: Update Header with Wallet Button

**File**: `components/layout/Header.tsx`

Add after existing imports:
```typescript
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
```

Replace the "Connect Wallet" button section:
```typescript
{/* Replace existing Connect Wallet button with: */}
<ConnectButton className="button-pill" />
```

---

## 🎯 Phase 3: Upload Page Integration (3 hours)

### Step 3.1: Create Upload Page

**File**: `app/upload/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RequireWallet } from '@/components/auth/RequireWallet';
import { walrusClient } from '@/lib/walrus/client';
import { DataNFTContract, ProfileContract } from '@/lib/sui/contracts';
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';

interface FormData {
  file: File | null;
  title: string;
  description: string;
  category: string;
  fileType: string;
  license: string;
  price: string;
  termsAccepted: boolean;
}

export default function UploadPage() {
  const router = useRouter();
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    file: null,
    title: '',
    description: '',
    category: 'medical',
    fileType: 'csv',
    license: 'commercial',
    price: '',
    termsAccepted: false,
  });
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Get user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', account?.address],
    queryFn: () => ProfileContract.getProfileByOwner(client, account!.address),
    enabled: !!account?.address,
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (stepNum === 1) {
      if (!formData.file) newErrors.file = 'Please upload a file';
    } else if (stepNum === 2) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    } else if (stepNum === 3) {
      const price = parseFloat(formData.price);
      if (!formData.price || isNaN(price) || price <= 0) {
        newErrors.price = 'Please enter a valid price';
      }
    } else if (stepNum === 4) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePublish = async () => {
    if (!validateStep(4) || !formData.file || !account?.address || !profile) {
      return;
    }

    setUploading(true);

    try {
      // Step 1: Upload file to Walrus
      console.log('Uploading file to Walrus...');
      const dataUpload = await walrusClient.upload(formData.file);
      console.log('Data blob ID:', dataUpload.blobId);

      // Step 2: Create and upload metadata JSON
      const metadata = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fileType: formData.fileType,
        license: formData.license,
        fileName: formData.file.name,
        fileSize: formData.file.size,
        uploadedAt: new Date().toISOString(),
      };

      console.log('Uploading metadata to Walrus...');
      const metadataBlobId = await walrusClient.uploadJSON(metadata);
      console.log('Metadata blob ID:', metadataBlobId);

      // Step 3: Mint DataNFT
      const priceInMist = Math.floor(parseFloat(formData.price) * 1_000_000_000); // Convert SUI to MIST

      const tx = DataNFTContract.mint(
        profile.id,
        metadataBlobId,
        dataUpload.blobId,
        formData.title,
        formData.description,
        formData.category,
        formData.fileType,
        formData.file.size,
        '' // verification hash - can be empty for now
      );

      console.log('Minting NFT on Sui...');
      
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('NFT minted!', result);
            alert(`Success! NFT minted.\nTransaction: ${result.digest}`);
            router.push('/dashboard');
          },
          onError: (error) => {
            console.error('Minting failed:', error);
            alert(`Failed to mint NFT: ${error.message}`);
            setUploading(false);
          },
        }
      );
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUploading(false);
    }
  };

  if (!account) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 pt-[60px] px-4 py-12">
          <RequireWallet message="Connect your Sui wallet to start listing datasets" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 pt-[60px] px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Profile Required</h2>
          <p className="text-text-secondary-dark mb-6">
            You need to create a profile before uploading datasets.
          </p>
          <Button variant="pill" onClick={() => router.push('/settings')}>
            Create Profile
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 pt-[60px] px-4 py-12 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
              Upload Your Dataset
            </h1>
            <p className="text-lg text-text-secondary-dark/80">
              List your data on the marketplace and start earning
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: 'Upload' },
                { num: 2, label: 'Details' },
                { num: 3, label: 'Pricing' },
                { num: 4, label: 'Review' },
              ].map((item, index) => (
                <div key={item.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition ${
                        step >= item.num
                          ? 'bg-primary text-white'
                          : 'bg-surface-dark border border-white/10 text-white/40'
                      }`}
                    >
                      {item.num}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium hidden sm:block ${step >= item.num ? 'text-white' : 'text-white/40'}`}>
                      {item.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="flex-1 h-1 mx-2">
                      <div
                        className={`h-full rounded-full transition ${
                          step > item.num ? 'bg-primary' : 'bg-white/10'
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Upload File */}
          {step === 1 && (
            <Card className="p-8 md:p-10">
              <h2 className="text-3xl font-bold text-white mb-8">
                Upload Dataset File
              </h2>

              <div>
                <div className={`border-2 border-dashed rounded-2xl p-16 text-center transition-colors ${
                  errors.file ? 'border-red-500' : 'border-white/20 hover:border-primary/50'
                }`}>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".csv,.json,.txt,.pdf,.zip"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        updateField('file', file);
                      }
                    }}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="material-symbols-outlined text-7xl text-white/30 mb-6 block">
                      upload_file
                    </span>
                    <p className="text-xl font-semibold text-white mb-3">
                      {formData.file ? formData.file.name : 'Choose a file to upload'}
                    </p>
                    <p className="text-sm text-text-secondary-dark/70 mb-6">
                      Click to browse your computer
                    </p>
                    <Button variant="pill" type="button">
                      Choose File
                    </Button>
                    {formData.file && (
                      <p className="text-sm text-success mt-4">
                        ✓ {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                    <p className="text-xs text-text-secondary-dark/60 mt-6">
                      Supported: CSV, JSON, TXT, PDF, ZIP (Max: 10GB)
                    </p>
                  </label>
                </div>
                {errors.file && <p className="text-red-500 text-sm mt-2">{errors.file}</p>}
              </div>

              <div className="flex justify-end mt-8">
                <Button variant="pill" size="lg" onClick={handleNext}>
                  Next Step
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Dataset Details */}
          {step === 2 && (
            <Card className="p-8 md:p-10">
              <h2 className="text-3xl font-bold text-white mb-8">
                Dataset Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Dataset Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Medical Imaging Dataset"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className={`w-full rounded-xl bg-surface-dark border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition ${
                      errors.title ? 'border-red-500' : 'border-white/10 focus:border-primary'
                    }`}
                    maxLength={100}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your dataset..."
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className={`w-full rounded-xl bg-surface-dark border px-5 py-4 text-white placeholder:text-white/30 focus:outline-none transition resize-none ${
                      errors.description ? 'border-red-500' : 'border-white/10 focus:border-primary'
                    }`}
                    maxLength={500}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full rounded-xl bg-surface-dark border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="medical">Medical</option>
                      <option value="finance">Finance</option>
                      <option value="legal">Legal</option>
                      <option value="code">Code</option>
                      <option value="literature">Literature</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      File Type
                    </label>
                    <select
                      value={formData.fileType}
                      onChange={(e) => updateField('fileType', e.target.value)}
                      className="w-full rounded-xl bg-surface-dark border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="txt">TXT</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" size="lg" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="pill" size="lg" onClick={handleNext}>
                  Next Step
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <Card className="p-8 md:p-10">
              <h2 className="text-3xl font-bold text-white mb-8">
                Set Your Price
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Price (in SUI) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="500"
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      min="0"
                      step="0.01"
                      className={`w-full rounded-xl bg-surface-dark border px-5 py-4 pr-20 text-white placeholder:text-white/30 focus:outline-none transition ${
                        errors.price ? 'border-red-500' : 'border-white/10 focus:border-primary'
                      }`}
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 font-semibold">
                      SUI
                    </span>
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price}</p>}
                  <p className="text-sm text-text-secondary-dark/60 mt-3">
                    Platform fee: 2.5% • You'll receive:{' '}
                    {formData.price && !isNaN(parseFloat(formData.price))
                      ? `~${(parseFloat(formData.price) * 0.975).toFixed(2)} SUI`
                      : '~0 SUI'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="ghost" size="lg" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="pill" size="lg" onClick={handleNext}>
                  Next Step
                </Button>
              </div>
            </Card>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <Card className="p-8 md:p-10">
              <h2 className="text-3xl font-bold text-white mb-8">
                Review & Publish
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="bg-surface-dark rounded-xl p-6 border border-white/10">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary-dark/60">File:</span>
                      <span className="text-white font-semibold">
                        {formData.file?.name} ({(formData.file!.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary-dark/60">Title:</span>
                      <span className="text-white font-semibold">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary-dark/60">Category:</span>
                      <span className="text-white font-semibold capitalize">{formData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary-dark/60">Price:</span>
                      <span className="text-primary font-bold text-lg">{formData.price} SUI</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.termsAccepted}
                    onChange={(e) => updateField('termsAccepted', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-transparent checked:bg-primary checked:border-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-text-secondary-dark/70">
                    I confirm I own the rights to this data <span className="text-red-500">*</span>
                  </label>
                </div>
                {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" size="lg" onClick={handleBack} disabled={uploading}>
                  Back
                </Button>
                <Button variant="pill" size="lg" onClick={handlePublish} disabled={uploading}>
                  {uploading ? 'Publishing...' : 'Publish to Marketplace'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

---

## 🎯 Phase 4: Marketplace Page (2 hours)

### Step 4.1: Create Marketplace Page

**File**: `app/marketplace/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DatasetCard } from '@/components/ui/DatasetCard';
import { Button } from '@/components/ui/Button';
import { MarketplaceContract, DataNFTContract } from '@/lib/sui/contracts';
import { useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';

export default function MarketplacePage() {
  const client = useSuiClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    medical: false,
    finance: false,
    legal: false,
    code: false,
    literature: false,
  });
  const [aiVerifiedOnly, setAiVerifiedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Fetch all listings from blockchain
  const { data: listings, isLoading } = useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async () => {
      const allListings = await MarketplaceContract.getAllListings(client);
      
      // Fetch NFT data for each listing
      const datasetsWithDetails = await Promise.all(
        allListings.map(async (listing) => {
          const nft = await DataNFTContract.getNFTById(client, listing.nftId);
          return {
            id: nft?.id || listing.nftId,
            title: nft?.title || 'Untitled Dataset',
            description: nft?.description || '',
            price: listing.price / 1_000_000_000, // Convert MIST to SUI
            size: nft?.fileSize ? `${(nft.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
            category: nft?.category || 'Unknown',
            fileType: nft?.fileType || 'Unknown',
            seller: listing.seller,
            verified: nft?.verified || false,
            listingId: listing.id,
          };
        })
      );
      
      return datasetsWithDetails;
    },
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // Filter datasets
  const filteredDatasets = (listings || []).filter((dataset) => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase());

    const selectedCategories = Object.entries(filters)
      .filter(([_, isSelected]) => isSelected)
      .map(([category]) => category);
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.some(cat => dataset.category.toLowerCase() === cat.toLowerCase());

    const matchesVerified = !aiVerifiedOnly || dataset.verified;

    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPrice = dataset.price >= minPrice && dataset.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesVerified && matchesPrice;
  });

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev]
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      medical: false,
      finance: false,
      legal: false,
      code: false,
      literature: false,
    });
    setAiVerifiedOnly(false);
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-[84px] space-y-6 bg-surface-dark rounded-2xl p-8 border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Filters</h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-primary hover:text-primary-hover transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Category Filter */}
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-text-secondary-dark uppercase tracking-wide">Category</label>
                  <div className="space-y-2">
                    {Object.keys(filters).map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters[category as keyof typeof filters]}
                          onChange={() => handleCategoryToggle(category)}
                          className="w-5 h-5 rounded border-2 border-white/20 bg-transparent checked:bg-primary checked:border-primary"
                        />
                        <span className="capitalize text-sm text-text-secondary-dark group-hover:text-white">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Verification Toggle */}
                <div className="space-y-4 border-t border-white/[0.06] pt-6">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-white font-medium">AI-Verified Only</span>
                    <input
                      type="checkbox"
                      checked={aiVerifiedOnly}
                      onChange={(e) => setAiVerifiedOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-white/20 bg-transparent checked:bg-primary checked:border-primary"
                    />
                  </label>
                </div>

                {/* Price Range */}
                <div className="space-y-4 border-t border-white/[0.06] pt-6">
                  <label className="text-xs font-semibold text-text-secondary-dark uppercase tracking-wide">Price Range (SUI)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full rounded-xl bg-bg-dark border border-white/10 px-4 py-3 text-white text-sm"
                    />
                    <span className="text-text-secondary-dark text-sm">→</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full rounded-xl bg-bg-dark border border-white/10 px-4 py-3 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-white text-4xl md:text-5xl font-black mb-10">
                Explore Datasets
              </h1>

              {/* Search Bar */}
              <div className="mb-10">
                <div className="bg-surface-dark rounded-full flex items-center gap-3 px-6 py-4 border border-white/10">
                  <span className="material-symbols-outlined text-white/40">search</span>
                  <input
                    className="flex-1 bg-transparent border-none text-white placeholder:text-white/40 focus:outline-none text-base"
                    placeholder="Search datasets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-text-secondary-dark/80 text-sm">
                  {isLoading ? 'Loading...' : `Showing ${filteredDatasets.length} dataset${filteredDatasets.length !== 1 ? 's' : ''}`}
                </p>
              </div>

              {/* Dataset Grid */}
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {isLoading ? (
                  <div className="col-span-full text-center py-16">
                    <p className="text-white/60">Loading datasets from blockchain...</p>
                  </div>
                ) : filteredDatasets.length > 0 ? (
                  filteredDatasets.map((dataset) => (
                    <DatasetCard key={dataset.id} dataset={dataset} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <span className="material-symbols-outlined text-white/20 text-7xl mb-4 block">
                      search_off
                    </span>
                    <p className="text-white/60 text-lg">No datasets found</p>
                    <Button variant="ghost" size="md" className="mt-6" onClick={handleResetFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

---

## Time Estimate Summary

| Phase | Task | Time |
|-------|------|------|
| 1 | Deploy Contracts | 1 hour |
| 2 | Wallet Integration | 30 min |
| 3 | Upload Page | 3 hours |
| 4 | Marketplace Page | 2 hours |
| 5 | Dataset Detail (see HACKATHON.md) | 1 hour |
| 6 | Purchase Flow | 2 hours |
| 7 | Testing & Polish | 1 hour |
| **Total** | | **10.5 hours** |

---

## 🎯 Quick Win Path (4 hours minimum)

If you need a working demo ASAP:

1. **Deploy contracts** (1 hour)
2. **Add wallet provider** (30 min)
3. **Basic upload** (1.5 hours) - Just file upload + mint, skip fancy UI
4. **Show on marketplace** (1 hour) - Just list NFTs, no filters

This gives you: **Upload → Mint → View on Marketplace** = core demo!

---

## 🚀 Ready to Start?

```bash
# Start here:
cd /Users/ibraschwan/Suilex/suilex-app

# Get testnet tokens
sui client faucet

# Deploy contracts
cd move/suilex
sui move publish --gas-budget 100000000

# Update .env.local with output
# Then start implementing!
```

Good luck! 🎉

