# Suilex Complete Development Plan

**Version**: 1.0
**Last Updated**: October 25, 2025
**Status**: Phase 0 Complete (UI Prototypes)

---

## Table of Contents

1. [Current State](#current-state)
2. [Phase 1: Blockchain & Storage Integration](#phase-1-blockchain--storage-integration)
3. [Phase 2: State Management & API Layer](#phase-2-state-management--api-layer)
4. [Phase 3: Authentication & User Management](#phase-3-authentication--user-management)
5. [Phase 4: Core Features Implementation](#phase-4-core-features-implementation)
6. [Phase 5: Enhanced UI/UX](#phase-5-enhanced-uiux)
7. [Phase 6: Testing Strategy](#phase-6-testing-strategy)
8. [Phase 7: DevOps & Deployment](#phase-7-devops--deployment)
9. [Phase 8: Security & Performance](#phase-8-security--performance)
10. [Phase 9: Future Enhancements](#phase-9-future-enhancements)
11. [Implementation Timeline](#implementation-timeline)
12. [Tech Stack Reference](#tech-stack-reference)

---

## Current State

### ✅ Completed (Phase 0: UI Prototypes)

#### Pages
1. **Homepage** (`/`) - Landing page with hero, how it works, featured datasets
2. **Marketplace** (`/marketplace`) - Browse datasets with filters and search
3. **Dashboard** (`/dashboard`) - User profile with stats, listings, earnings
4. **Dataset Detail** (`/dataset/[id]`) - Individual dataset information
5. **Upload Portal** (`/upload`) - 4-step upload flow for sellers

#### Components
- **UI Components**: Button, Card, Badge, DatasetCard, StatCard, ListingCard
- **Layout Components**: Header with navigation
- **TypeScript Types**: Dataset, Listing, Sale, UserStats

#### Technology Stack
- Next.js 16.0.0 (App Router, Turbopack)
- React 19.2.0
- TypeScript 5
- Tailwind CSS v4
- Material Symbols Outlined icons

### 🔴 Current Limitations
- ❌ No blockchain integration (data is mock/static)
- ❌ No wallet connection
- ❌ No real data storage or database
- ❌ No authentication system
- ❌ No file upload functionality
- ❌ No search/filter logic implementation
- ❌ No API routes or backend
- ❌ No state management
- ❌ No testing infrastructure

---

## Phase 1: Blockchain & Storage Integration

**Priority**: CRITICAL
**Duration**: 3-4 weeks
**Dependencies**: None

### 1.1 Sui Blockchain Integration

#### Install Dependencies
```bash
npm install @mysten/sui.js @mysten/dapp-kit @tanstack/react-query
```

#### Smart Contract Development
**Location**: Create new `/contracts` directory

**Required Move Modules**:
1. **DataNFT Module** (`sources/data_nft.move`)
   - Struct: `DataNFT` with metadata (title, description, price, size, category, IPFS hash, seller)
   - Function: `mint_data_nft()` - Create new DataNFT
   - Function: `transfer_data_nft()` - Transfer ownership
   - Function: `update_price()` - Modify listing price
   - Function: `delist()` - Remove from marketplace

2. **Marketplace Module** (`sources/marketplace.move`)
   - Struct: `Listing` for active marketplace listings
   - Function: `list_nft()` - List DataNFT for sale
   - Function: `buy_nft()` - Purchase with SUI tokens
   - Function: `apply_filters()` - Query by category, price range
   - Event: `ListingCreated`, `Purchase`, `PriceUpdate`

3. **Verification Module** (`sources/verification.move`)
   - Struct: `VerificationBadge`
   - Function: `verify_dataset()` - Mark dataset as AI-verified
   - Function: `revoke_verification()` - Admin function

#### Wallet Integration
**File**: `lib/wallet/config.ts`

```typescript
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient } from '@tanstack/react-query';

// Configure for Sui testnet/mainnet
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

export const queryClient = new QueryClient();
export { networkConfig };
```

**File**: `app/layout.tsx` - Update with wallet providers

```typescript
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClientProvider } from '@tanstack/react-query';
import { networkConfig, queryClient } from '@/lib/wallet/config';
import '@mysten/dapp-kit/dist/index.css';

// Wrap app with providers
```

**Files to Create**:
- `components/wallet/ConnectButton.tsx` - Wallet connection UI
- `components/wallet/WalletInfo.tsx` - Display connected wallet
- `hooks/useWallet.ts` - Custom hook for wallet operations

### 1.2 Decentralized Storage (IPFS)

#### Install Dependencies
```bash
npm install ipfs-http-client @pinata/sdk
```

#### IPFS Integration
**File**: `lib/storage/ipfs.ts`

```typescript
import { create } from 'ipfs-http-client';
import PinataClient from '@pinata/sdk';

// Configure Pinata or Infura IPFS gateway
export class IPFSManager {
  async uploadDataset(file: File): Promise<string> {
    // Upload to IPFS, return CID
  }

  async uploadMetadata(metadata: object): Promise<string> {
    // Upload JSON metadata
  }

  async getDataset(cid: string): Promise<Blob> {
    // Retrieve dataset from IPFS
  }
}
```

**Alternative**: Consider Arweave for permanent storage
```bash
npm install arweave
```

**File**: `lib/storage/arweave.ts` - Similar interface for Arweave

### 1.3 Database Layer

#### Option A: Supabase (Recommended for MVP)
```bash
npm install @supabase/supabase-js
```

**Setup**: Create Supabase project
**Tables**:
- `datasets` - Cache of on-chain data for faster queries
- `users` - User profiles and preferences
- `transactions` - Purchase history
- `favorites` - User wishlists

**File**: `lib/database/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### Option B: Prisma + PostgreSQL
For more control, use Prisma ORM with PostgreSQL

**File**: `prisma/schema.prisma`
```prisma
model Dataset {
  id          String   @id @default(cuid())
  nftId       String   @unique
  title       String
  description String
  price       Float
  seller      String
  verified    Boolean  @default(false)
  ipfsHash    String
  createdAt   DateTime @default(now())
}
```

### 1.4 Environment Configuration

**File**: `.env.local`
```env
# Sui Network
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_PACKAGE_ID=0x...

# IPFS/Pinata
NEXT_PUBLIC_PINATA_API_KEY=...
NEXT_PUBLIC_PINATA_SECRET=...
PINATA_JWT=...

# Database (choose one)
# Option A: Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Option B: PostgreSQL
DATABASE_URL=postgresql://...

# API Keys
NEXT_PUBLIC_INFURA_ID=...
```

### Deliverables - Phase 1
- [ ] Move smart contracts written and deployed to Sui testnet
- [ ] Wallet connection working in UI
- [ ] IPFS upload functional
- [ ] Database schema created
- [ ] Environment variables configured

---

## Phase 2: State Management & API Layer

**Priority**: HIGH
**Duration**: 2-3 weeks
**Dependencies**: Phase 1

### 2.1 Global State Management

#### Option A: Zustand (Recommended - Lightweight)
```bash
npm install zustand
```

**File**: `store/useDatasetStore.ts`
```typescript
import { create } from 'zustand';
import { Dataset } from '@/types';

interface DatasetStore {
  datasets: Dataset[];
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useDatasetStore = create<DatasetStore>((set) => ({
  datasets: [],
  filters: {},
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
```

**File**: `store/useWalletStore.ts`
```typescript
interface WalletStore {
  address: string | null;
  connected: boolean;
  balance: number;
  connect: () => Promise<void>;
  disconnect: () => void;
}
```

**File**: `store/useUserStore.ts`
```typescript
interface UserStore {
  profile: UserProfile | null;
  listings: Listing[];
  purchases: Dataset[];
  earnings: EarningsData;
}
```

#### Option B: React Context API
For simpler state needs, create contexts in `contexts/` directory

### 2.2 Server State with React Query

**File**: `hooks/useDatasets.ts`
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

export function useDatasets(filters?: FilterState) {
  return useQuery({
    queryKey: ['datasets', filters],
    queryFn: () => fetchDatasets(filters),
  });
}

export function useDataset(id: string) {
  return useQuery({
    queryKey: ['dataset', id],
    queryFn: () => fetchDataset(id),
  });
}

export function usePurchaseDataset() {
  return useMutation({
    mutationFn: (datasetId: string) => purchaseDataset(datasetId),
  });
}
```

**File**: `hooks/useListings.ts`
```typescript
export function useMyListings() {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: fetchMyListings,
  });
}

export function useCreateListing() {
  return useMutation({
    mutationFn: (data: CreateListingData) => createListing(data),
  });
}
```

### 2.3 API Routes

**Directory**: `app/api/`

**File**: `app/api/datasets/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Query datasets from DB with filters
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  // Return filtered datasets
}

export async function POST(request: NextRequest) {
  // Create new dataset listing
  const body = await request.json();

  // Validate and store in DB
}
```

**File**: `app/api/datasets/[id]/route.ts`
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Fetch single dataset
}

export async function PATCH(request: NextRequest, { params }) {
  // Update dataset (price, delist, etc.)
}
```

**File**: `app/api/purchase/route.ts`
```typescript
export async function POST(request: NextRequest) {
  // Handle purchase transaction
  // 1. Verify wallet signature
  // 2. Execute blockchain transfer
  // 3. Update database
  // 4. Grant access to IPFS content
}
```

**File**: `app/api/upload/route.ts`
```typescript
export async function POST(request: NextRequest) {
  // Handle file upload to IPFS
  // Return CID
}
```

**File**: `app/api/verify/route.ts`
```typescript
export async function POST(request: NextRequest) {
  // AI verification endpoint
  // Call verification service
}
```

### 2.4 Service Layer

**File**: `lib/services/datasetService.ts`
```typescript
export class DatasetService {
  async listDataset(data: ListDatasetInput): Promise<Dataset> {
    // Upload to IPFS
    // Mint DataNFT on blockchain
    // Store in database
  }

  async purchaseDataset(id: string, buyer: string): Promise<Transaction> {
    // Execute purchase on blockchain
    // Transfer ownership
    // Update database
  }

  async searchDatasets(query: string, filters: FilterState): Promise<Dataset[]> {
    // Query database with full-text search
  }
}
```

**File**: `lib/services/verificationService.ts`
```typescript
export class VerificationService {
  async verifyDataset(ipfsHash: string): Promise<VerificationResult> {
    // Call AI verification API
    // Check data quality, format, integrity
  }
}
```

### Deliverables - Phase 2
- [ ] Zustand stores created and integrated
- [ ] React Query hooks for all data fetching
- [ ] API routes implemented
- [ ] Service layer abstraction complete
- [ ] Error handling patterns established

---

## Phase 3: Authentication & User Management

**Priority**: HIGH
**Duration**: 2 weeks
**Dependencies**: Phase 1

### 3.1 Wallet-Based Authentication

**File**: `lib/auth/walletAuth.ts`
```typescript
import { verifyPersonalMessage } from '@mysten/sui.js/verify';

export async function authenticateWallet(address: string, signature: string): Promise<boolean> {
  // Verify signature
  // Generate session token
}

export function createAuthMessage(address: string): string {
  return `Sign this message to authenticate with Suilex\n\nWallet: ${address}\nNonce: ${Date.now()}`;
}
```

### 3.2 Session Management

**Option A**: NextAuth.js with custom credentials provider
```bash
npm install next-auth
```

**File**: `app/api/auth/[...nextauth]/route.ts`
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Sui Wallet',
      credentials: {
        address: { type: 'text' },
        signature: { type: 'text' },
      },
      authorize: async (credentials) => {
        // Verify wallet signature
        // Return user object
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Option B**: Custom JWT implementation
```bash
npm install jose
```

### 3.3 User Profile Management

**File**: `app/api/user/profile/route.ts`
```typescript
export async function GET(request: NextRequest) {
  // Fetch user profile from DB
}

export async function PUT(request: NextRequest) {
  // Update user profile (email, preferences)
}
```

**Component**: `components/user/ProfileSettings.tsx`
- Email notifications toggle
- Display name
- Avatar upload
- Privacy settings

### 3.4 Middleware for Protected Routes

**File**: `middleware.ts`
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check authentication for /dashboard, /upload routes
  // Redirect to homepage if not authenticated
}

export const config = {
  matcher: ['/dashboard/:path*', '/upload/:path*'],
};
```

### Deliverables - Phase 3
- [ ] Wallet authentication flow complete
- [ ] Session management working
- [ ] User profile CRUD operations
- [ ] Protected routes middleware
- [ ] "Connect Wallet" button functional

---

## Phase 4: Core Features Implementation

**Priority**: CRITICAL
**Duration**: 4-5 weeks
**Dependencies**: Phases 1-3

### 4.1 Dataset Upload Flow

**Update**: `app/upload/page.tsx`

**Step 1: File Upload**
```typescript
'use client';
import { useDropzone } from 'react-dropzone';

export default function UploadStep1() {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024 * 1024, // 10GB
    onDrop: async (files) => {
      // Upload to IPFS via API route
      const formData = new FormData();
      formData.append('file', files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const { cid } = await res.json();
      // Store CID in state
    },
  });
}
```

**Dependencies**:
```bash
npm install react-dropzone
```

**Step 2: Metadata Form**
- Use React Hook Form for validation
```bash
npm install react-hook-form zod @hookform/resolvers
```

**File**: `lib/validation/uploadSchema.ts`
```typescript
import { z } from 'zod';

export const uploadSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  category: z.enum(['Medical', 'Finance', 'Legal', 'Code', 'Literature']),
  fileType: z.enum(['JSON', 'CSV', 'TXT', 'PDF']),
  license: z.string(),
  price: z.number().min(0).max(1000000),
});
```

**Step 3: Pricing**
- Show platform fee calculation (2.5%)
- Display recommended pricing based on category

**Step 4: Blockchain Minting**
```typescript
import { TransactionBlock } from '@mysten/sui.js/transactions';

async function mintDataNFT(metadata: DatasetMetadata) {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::data_nft::mint_data_nft`,
    arguments: [
      tx.pure(metadata.title),
      tx.pure(metadata.description),
      tx.pure(metadata.ipfsHash),
      tx.pure(metadata.price),
    ],
  });

  const result = await signAndExecuteTransactionBlock({ transactionBlock: tx });
  return result;
}
```

### 4.2 Marketplace Browse & Search

**Update**: `app/marketplace/page.tsx`

**File**: `lib/search/algolia.ts` (Optional - Enhanced Search)
```bash
npm install algoliasearch react-instantsearch-dom
```

**Implement Filtering Logic**:
```typescript
import { useDatasetStore } from '@/store/useDatasetStore';

export default function MarketplacePage() {
  const { filters, setFilters, searchQuery } = useDatasetStore();
  const { data: datasets, isLoading } = useDatasets(filters);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters({
      categories: checked
        ? [...filters.categories, category]
        : filters.categories.filter(c => c !== category)
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters({ priceRange: { min, max } });
  };
}
```

**Pagination**:
```typescript
import { usePagination } from '@/hooks/usePagination';

const { currentPage, totalPages, goToPage } = usePagination({
  totalItems: datasets.length,
  itemsPerPage: 12,
});

const paginatedDatasets = datasets.slice(
  (currentPage - 1) * 12,
  currentPage * 12
);
```

### 4.3 Purchase Flow

**Update**: `app/dataset/[id]/page.tsx`

**Component**: `components/dataset/PurchaseButton.tsx`
```typescript
export function PurchaseButton({ dataset }: { dataset: Dataset }) {
  const { mutate: purchase, isLoading } = usePurchaseDataset();
  const { address, connected } = useWalletStore();

  const handlePurchase = async () => {
    if (!connected) {
      // Prompt wallet connection
      return;
    }

    // Execute purchase transaction
    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${packageId}::marketplace::buy_nft`,
      arguments: [
        tx.pure(dataset.nftId),
        tx.object(MARKETPLACE_OBJECT_ID),
      ],
    });

    const result = await signAndExecuteTransactionBlock({ transactionBlock: tx });

    if (result.effects?.status?.status === 'success') {
      // Grant access to IPFS content
      // Update database
      // Show success message
    }
  };

  return (
    <Button onClick={handlePurchase} disabled={isLoading}>
      {isLoading ? 'Processing...' : `Purchase for ${dataset.price} SUI`}
    </Button>
  );
}
```

### 4.4 Dashboard Data Integration

**Update**: `app/dashboard/page.tsx`

**Fetch Real Data**:
```typescript
import { useMyListings } from '@/hooks/useListings';
import { useMyPurchases } from '@/hooks/usePurchases';
import { useEarnings } from '@/hooks/useEarnings';

export default function DashboardPage() {
  const { address } = useWalletStore();
  const { data: listings } = useMyListings(address);
  const { data: purchases } = useMyPurchases(address);
  const { data: earnings } = useEarnings(address);

  // Render with real data
}
```

**Edit/Delist Functionality**:
```typescript
const { mutate: updatePrice } = useUpdateListingPrice();
const { mutate: delistDataset } = useDelistDataset();

const handleEditPrice = (listingId: string, newPrice: number) => {
  updatePrice({ listingId, price: newPrice });
};
```

### 4.5 AI Verification System

**Option A**: Mock verification (MVP)
```typescript
// Simulate verification delay
await new Promise(resolve => setTimeout(resolve, 3000));
return { verified: true, score: 95 };
```

**Option B**: Real AI verification
- Integrate with ML service (TensorFlow.js, HuggingFace)
- Check data quality metrics
- Validate file format and structure
- Detect anomalies

**File**: `lib/verification/aiVerifier.ts`
```typescript
export async function verifyDataQuality(ipfsHash: string): Promise<VerificationResult> {
  // Download sample from IPFS
  // Run quality checks
  // Return verification badge
}
```

### Deliverables - Phase 4
- [ ] Complete upload flow with IPFS
- [ ] NFT minting functional
- [ ] Search and filters working
- [ ] Purchase flow complete
- [ ] Dashboard shows real user data
- [ ] Edit/delist operations functional
- [ ] AI verification integrated (at least mock)

---

## Phase 5: Enhanced UI/UX

**Priority**: MEDIUM
**Duration**: 2-3 weeks
**Dependencies**: Phase 4

### 5.1 Loading States & Skeletons

**Install**:
```bash
npm install react-loading-skeleton
```

**Component**: `components/ui/SkeletonCard.tsx`
```typescript
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function DatasetCardSkeleton() {
  return (
    <div className="rounded-xl border border-surface-dark bg-surface-dark p-4">
      <Skeleton height={24} width="80%" />
      <Skeleton height={16} width="60%" style={{ marginTop: 8 }} />
      <Skeleton height={20} width={100} style={{ marginTop: 16 }} />
    </div>
  );
}
```

**Usage in pages**:
```typescript
{isLoading ? (
  Array(6).fill(0).map((_, i) => <DatasetCardSkeleton key={i} />)
) : (
  datasets.map(dataset => <DatasetCard key={dataset.id} dataset={dataset} />)
)}
```

### 5.2 Toast Notifications

**Install**:
```bash
npm install sonner
```

**File**: `app/layout.tsx`
```typescript
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

**Usage**:
```typescript
import { toast } from 'sonner';

// Success
toast.success('Dataset purchased successfully!');

// Error
toast.error('Transaction failed. Please try again.');

// Loading
const toastId = toast.loading('Minting DataNFT...');
// Later: toast.success('Minted!', { id: toastId });
```

### 5.3 Modal Components

**Component**: `components/ui/Modal.tsx`
```typescript
'use client';
import { Dialog, Transition } from '@headlessui/react';

export function Modal({ isOpen, onClose, children, title }) {
  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-md rounded-xl bg-surface-dark p-6">
              <Dialog.Title className="text-xl font-bold text-text-primary-dark">
                {title}
              </Dialog.Title>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
```

**Install**:
```bash
npm install @headlessui/react
```

**Use Cases**:
- Confirm purchase modal
- Edit price modal
- Delete confirmation
- Wallet connection modal

### 5.4 Form Validation with React Hook Form

**Example**: Edit Price Modal
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const priceSchema = z.object({
  price: z.number().min(1).max(1000000),
});

type PriceFormData = z.infer<typeof priceSchema>;

export function EditPriceModal({ listing, onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm<PriceFormData>({
    resolver: zodResolver(priceSchema),
    defaultValues: { price: listing.price },
  });

  const onSubmit = (data: PriceFormData) => {
    // Update price
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Price">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('price', { valueAsNumber: true })} />
        {errors.price && <span className="text-red-500">{errors.price.message}</span>}
        <Button type="submit">Update Price</Button>
      </form>
    </Modal>
  );
}
```

### 5.5 Error Boundaries

**File**: `components/error/ErrorBoundary.tsx`
```typescript
'use client';
import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 5.6 Optimistic Updates

**Example**: Wishlist Toggle
```typescript
const { mutate: toggleWishlist } = useMutation({
  mutationFn: (datasetId: string) => addToWishlist(datasetId),
  onMutate: async (datasetId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['wishlist'] });

    // Snapshot current value
    const previousWishlist = queryClient.getQueryData(['wishlist']);

    // Optimistically update
    queryClient.setQueryData(['wishlist'], (old: string[]) => [...old, datasetId]);

    return { previousWishlist };
  },
  onError: (err, datasetId, context) => {
    // Rollback on error
    queryClient.setQueryData(['wishlist'], context.previousWishlist);
  },
});
```

### 5.7 Empty States

**Component**: `components/ui/EmptyState.tsx`
```typescript
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="material-symbols-outlined text-6xl text-text-secondary-dark mb-4">
        {icon}
      </span>
      <h3 className="text-xl font-bold text-text-primary-dark mb-2">{title}</h3>
      <p className="text-text-secondary-dark mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
}
```

**Usage**:
```typescript
{listings.length === 0 ? (
  <EmptyState
    icon="inventory"
    title="No listings yet"
    description="Start earning by uploading your first dataset"
    action={<Button>Upload Dataset</Button>}
  />
) : (
  // Show listings
)}
```

### Deliverables - Phase 5
- [ ] Loading skeletons on all pages
- [ ] Toast notifications integrated
- [ ] Modal components for key interactions
- [ ] Form validation on all forms
- [ ] Error boundaries implemented
- [ ] Optimistic updates for instant feedback
- [ ] Empty states for zero-data scenarios

---

## Phase 6: Testing Strategy

**Priority**: HIGH
**Duration**: 2-3 weeks
**Dependencies**: Phase 4

### 6.1 Unit Testing Setup

**Install**:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

**File**: `jest.config.js`
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

**File**: `jest.setup.js`
```javascript
import '@testing-library/jest-dom';
```

**Example Test**: `components/ui/Button.test.tsx`
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    const { container } = render(<Button variant="secondary">Test</Button>);
    expect(container.firstChild).toHaveClass('bg-primary/20');
  });
});
```

### 6.2 Integration Testing

**Example**: `app/marketplace/page.test.tsx`
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MarketplacePage from './page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('MarketplacePage', () => {
  it('displays datasets', async () => {
    render(<MarketplacePage />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Medical Imaging Dataset')).toBeInTheDocument();
    });
  });

  it('filters by category', async () => {
    const user = userEvent.setup();
    render(<MarketplacePage />, { wrapper });

    const medicalCheckbox = screen.getByLabelText('Medical');
    await user.click(medicalCheckbox);

    // Assert filtered results
  });
});
```

### 6.3 E2E Testing with Playwright

**Install**:
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**File**: `playwright.config.ts`
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
```

**Test**: `e2e/purchase-flow.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test('complete purchase flow', async ({ page }) => {
  // Go to marketplace
  await page.goto('/marketplace');

  // Click on a dataset
  await page.click('text=Medical Imaging Dataset');

  // Click purchase button
  await page.click('button:has-text("Purchase")');

  // Wait for wallet connection (mock)
  // ... wallet interaction ...

  // Verify success
  await expect(page.locator('text=Purchase successful')).toBeVisible();
});

test('upload dataset flow', async ({ page }) => {
  await page.goto('/upload');

  // Upload file
  await page.setInputFiles('input[type="file"]', './test-data/sample.csv');

  // Fill form
  await page.fill('input[name="title"]', 'Test Dataset');
  await page.fill('textarea[name="description"]', 'Test description...');

  // Submit
  await page.click('button:has-text("Publish")');

  // Verify listing created
  await expect(page.locator('text=Dataset listed successfully')).toBeVisible();
});
```

### 6.4 Smart Contract Testing

**File**: `contracts/tests/data_nft_tests.move`
```move
#[test_only]
module suilex::data_nft_tests {
    use suilex::data_nft;

    #[test]
    fun test_mint_data_nft() {
        // Setup test scenario
        // Mint NFT
        // Assert ownership
    }

    #[test]
    fun test_transfer_nft() {
        // Mint NFT
        // Transfer to another address
        // Assert new ownership
    }
}
```

**Run tests**:
```bash
sui move test
```

### 6.5 Test Coverage

**Add to package.json**:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test"
  }
}
```

**Coverage Goals**:
- Unit tests: >80% coverage
- Integration tests: Critical user flows
- E2E tests: Happy paths + error scenarios

### Deliverables - Phase 6
- [ ] Unit tests for all components
- [ ] Integration tests for pages
- [ ] E2E tests for critical flows
- [ ] Smart contract tests passing
- [ ] CI pipeline running tests
- [ ] Coverage reports generated

---

## Phase 7: DevOps & Deployment

**Priority**: MEDIUM
**Duration**: 1-2 weeks
**Dependencies**: Phase 6

### 7.1 Environment Configuration

**Files**: `.env.development`, `.env.production`

**Development**:
```env
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_PACKAGE_ID=0x...testnet...
```

**Production**:
```env
NEXT_PUBLIC_SUI_NETWORK=mainnet
NEXT_PUBLIC_PACKAGE_ID=0x...mainnet...
```

### 7.2 CI/CD Pipeline (GitHub Actions)

**File**: `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 7.3 Vercel Deployment

**Steps**:
1. Connect GitHub repo to Vercel
2. Configure environment variables in Vercel dashboard
3. Enable automatic deployments

**File**: `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sfo1"]
}
```

### 7.4 Monitoring & Analytics

**Vercel Analytics**:
```bash
npm install @vercel/analytics
```

**File**: `app/layout.tsx`
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Sentry Error Tracking**:
```bash
npm install @sentry/nextjs
```

**File**: `sentry.client.config.ts`
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 7.5 Performance Monitoring

**Lighthouse CI**:
```bash
npm install --save-dev @lhci/cli
```

**File**: `lighthouserc.json`
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/", "http://localhost:3000/marketplace"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Deliverables - Phase 7
- [ ] CI/CD pipeline operational
- [ ] Automatic deployments to Vercel
- [ ] Environment variables configured
- [ ] Analytics tracking implemented
- [ ] Error monitoring with Sentry
- [ ] Performance monitoring setup

---

## Phase 8: Security & Performance

**Priority**: CRITICAL
**Duration**: 2 weeks
**Dependencies**: Phase 7

### 8.1 Security Best Practices

#### Input Validation
**All user inputs must be validated**:
- File uploads: Check MIME type, size limits
- Form data: Use Zod schemas
- API routes: Validate request bodies

**Example**: `app/api/datasets/route.ts`
```typescript
import { z } from 'zod';

const createDatasetSchema = z.object({
  title: z.string().min(5).max(100),
  price: z.number().positive().max(1000000),
  // ... more fields
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = createDatasetSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Process validated data
}
```

#### Rate Limiting
```bash
npm install @upstash/ratelimit @upstash/redis
```

**File**: `lib/ratelimit.ts`
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});
```

**Usage in API routes**:
```typescript
const { success } = await ratelimit.limit(request.ip);
if (!success) {
  return new Response('Too many requests', { status: 429 });
}
```

#### CORS Configuration
**File**: `middleware.ts`
```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}
```

#### Content Security Policy
**File**: `next.config.ts`
```typescript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'; img-src 'self' data: https:;",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 8.2 Smart Contract Security

**Audit Checklist**:
- [ ] Reentrancy protection
- [ ] Integer overflow/underflow checks (Sui Move handles this)
- [ ] Access control (only owner can delist)
- [ ] Payment verification before transfer
- [ ] Event emission for all state changes

**Security Audit**: Hire professional auditor before mainnet (e.g., CertiK, Trail of Bits)

### 8.3 Performance Optimization

#### Image Optimization
**Use Next.js Image component**:
```typescript
import Image from 'next/image';

<Image
  src={dataset.imageUrl}
  alt={dataset.title}
  width={300}
  height={200}
  placeholder="blur"
  blurDataURL={dataset.blurHash}
/>
```

#### Code Splitting
**Dynamic imports for heavy components**:
```typescript
import dynamic from 'next/dynamic';

const DatasetVisualization = dynamic(() => import('@/components/DatasetVisualization'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

#### Database Optimization
**Add indexes**:
```sql
CREATE INDEX idx_datasets_category ON datasets(category);
CREATE INDEX idx_datasets_price ON datasets(price);
CREATE INDEX idx_datasets_verified ON datasets(verified);
CREATE INDEX idx_datasets_seller ON datasets(seller);
```

**Query optimization**:
```typescript
// Bad: N+1 queries
for (const dataset of datasets) {
  const seller = await db.users.findOne({ address: dataset.seller });
}

// Good: Single query with join
const datasets = await db.datasets.findMany({
  include: { seller: true },
});
```

#### Caching Strategy
```bash
npm install @vercel/kv
```

**File**: `lib/cache.ts`
```typescript
import { kv } from '@vercel/kv';

export async function getCachedDatasets(filters: FilterState) {
  const cacheKey = `datasets:${JSON.stringify(filters)}`;

  const cached = await kv.get(cacheKey);
  if (cached) return cached;

  const datasets = await fetchDatasets(filters);
  await kv.set(cacheKey, datasets, { ex: 300 }); // 5 min cache

  return datasets;
}
```

#### Bundle Size Optimization
```bash
npm install @next/bundle-analyzer
```

**File**: `next.config.ts`
```typescript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... other config
});
```

**Run**: `ANALYZE=true npm run build`

### 8.4 SEO Optimization

**Metadata for all pages**:
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suilex - Decentralized AI Data Marketplace',
  description: 'Buy and sell verified datasets on the Sui blockchain',
  openGraph: {
    images: ['/og-image.png'],
  },
};
```

**Dynamic metadata for datasets**:
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const dataset = await fetchDataset(params.id);

  return {
    title: `${dataset.title} | Suilex`,
    description: dataset.description,
    openGraph: {
      images: [dataset.imageUrl],
    },
  };
}
```

**Sitemap**:
```typescript
// app/sitemap.ts
export default async function sitemap() {
  const datasets = await getAllDatasets();

  const datasetUrls = datasets.map(dataset => ({
    url: `https://suilex.io/dataset/${dataset.id}`,
    lastModified: dataset.updatedAt,
  }));

  return [
    { url: 'https://suilex.io', lastModified: new Date() },
    { url: 'https://suilex.io/marketplace', lastModified: new Date() },
    ...datasetUrls,
  ];
}
```

### 8.5 Accessibility (a11y)

**Install linter**:
```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

**Checklist**:
- [ ] All images have alt text
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Focus management (modals, dropdowns)
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels where needed

**Component example**:
```typescript
<button
  onClick={handlePurchase}
  aria-label={`Purchase ${dataset.title} for ${dataset.price} SUI`}
  disabled={isLoading}
>
  {isLoading ? 'Processing...' : 'Purchase'}
</button>
```

### Deliverables - Phase 8
- [ ] All inputs validated with Zod
- [ ] Rate limiting on API routes
- [ ] Security headers configured
- [ ] Smart contracts audited
- [ ] Images optimized with Next/Image
- [ ] Code splitting implemented
- [ ] Database queries indexed
- [ ] Caching strategy in place
- [ ] Bundle size under 500KB (initial)
- [ ] SEO metadata complete
- [ ] Lighthouse score >90
- [ ] Accessibility audit passed

---

## Phase 9: Future Enhancements

**Priority**: LOW
**Duration**: Ongoing

### 9.1 Advanced Features

#### Dataset Previews
- Show sample data before purchase
- Data visualization charts
- Schema explorer

#### Subscription Model
- Monthly access to dataset updates
- Recurring payments via smart contract

#### API Access
- Provide API endpoints for purchased datasets
- API key management
- Usage analytics

#### Social Features
- User reviews and ratings
- Dataset comments
- Follow sellers
- Activity feed

#### Advanced Search
- Full-text search with Algolia
- Faceted search
- Saved searches
- Search recommendations

### 9.2 Data Collaboration

#### Multi-party Data Pools
- Allow multiple sellers to contribute to one dataset
- Revenue sharing via smart contract
- DAO governance for shared datasets

#### Data Licensing
- Multiple license types (commercial, research, attribution)
- Time-limited licenses
- Geographic restrictions

### 9.3 Analytics Dashboard

#### Seller Analytics
- Views, impressions, conversion rate
- Revenue trends
- Top performing datasets
- Customer demographics

#### Buyer Analytics
- ROI from purchased datasets
- Usage tracking
- Model performance metrics

### 9.4 Integration Features

#### Webhook Support
- Notify sellers on purchase
- Alert on price changes
- Dataset verification status

#### Third-party Integrations
- Google Cloud Storage export
- AWS S3 sync
- Kaggle import
- HuggingFace integration

### 9.5 Mobile App

#### React Native App
- Browse marketplace
- Purchase datasets
- Manage listings
- Mobile wallet integration

### 9.6 Enterprise Features

#### Bulk Purchases
- Discounts for bulk buyers
- Custom contracts
- Invoicing system

#### Private Marketplace
- Enterprise-only datasets
- Custom licensing terms
- Dedicated support

---

## Implementation Timeline

### Months 1-2: Foundation
- **Week 1-2**: Phase 1 - Blockchain integration
- **Week 3-4**: Phase 1 - Storage (IPFS)
- **Week 5-6**: Phase 2 - State management & API
- **Week 7-8**: Phase 3 - Authentication

**Milestone**: Basic blockchain functionality working

### Months 3-4: Core Features
- **Week 9-10**: Phase 4 - Upload flow
- **Week 11-12**: Phase 4 - Marketplace logic
- **Week 13-14**: Phase 4 - Purchase flow
- **Week 15-16**: Phase 4 - Dashboard integration

**Milestone**: MVP with full buy/sell functionality

### Month 5: Polish & Testing
- **Week 17-18**: Phase 5 - UI/UX enhancements
- **Week 19-20**: Phase 6 - Testing (unit, integration, E2E)

**Milestone**: Production-ready app

### Month 6: Launch
- **Week 21**: Phase 7 - DevOps setup
- **Week 22**: Phase 8 - Security audit
- **Week 23**: Phase 8 - Performance optimization
- **Week 24**: Mainnet deployment & launch

**Milestone**: Live on mainnet

### Beyond Month 6
- Bug fixes and iterations
- Phase 9 - Future enhancements
- Community feedback integration
- Scaling and optimization

---

## Tech Stack Reference

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **State**: Zustand / React Query
- **Forms**: React Hook Form + Zod
- **UI Components**: Headless UI, Radix UI
- **Notifications**: Sonner
- **Icons**: Material Symbols

### Blockchain
- **Network**: Sui
- **SDK**: @mysten/sui.js, @mysten/dapp-kit
- **Wallets**: Sui Wallet, Suiet, Ethos
- **Smart Contracts**: Move language

### Backend
- **Runtime**: Node.js (via Next.js API routes)
- **Database**: Supabase (PostgreSQL) / Prisma
- **Storage**: IPFS (Pinata) / Arweave
- **Caching**: Vercel KV (Redis)

### DevOps
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Vercel Analytics
- **Testing**: Jest, Playwright, React Testing Library

### Security
- **Rate Limiting**: Upstash
- **Validation**: Zod
- **Auth**: NextAuth.js / Custom JWT

---

## Key Decisions & Trade-offs

### Architecture Decisions

1. **Next.js App Router** ✅
   - Modern, server components by default
   - Built-in API routes
   - Great performance
   - **Trade-off**: Learning curve for team

2. **Sui Blockchain** ✅
   - Fast finality
   - Move language safety
   - Growing ecosystem
   - **Trade-off**: Smaller community than Ethereum

3. **IPFS for Storage** ✅
   - Decentralized
   - Content-addressable
   - **Trade-off**: Availability depends on pinning service

4. **Supabase vs Prisma**
   - **Supabase**: Faster MVP, hosted, real-time features
   - **Prisma**: More control, self-hosted, type-safety
   - **Recommendation**: Supabase for MVP, migrate later if needed

5. **Zustand vs Redux**
   - **Zustand**: Simpler, less boilerplate
   - **Redux**: More ecosystem, devtools
   - **Recommendation**: Zustand for this app size

---

## Risk Mitigation

### Technical Risks
1. **Blockchain complexity**
   - Mitigation: Start with testnet, extensive testing
   - Backup: Hire Sui consultant

2. **IPFS reliability**
   - Mitigation: Use Pinata (paid pinning)
   - Backup: Hybrid approach with S3

3. **Scalability**
   - Mitigation: Database indexing, caching layer
   - Backup: CDN, edge functions

### Business Risks
1. **Market fit**
   - Mitigation: MVP first, gather feedback
   - Backup: Pivot features based on data

2. **Competition**
   - Mitigation: Focus on Sui ecosystem, AI-specific features
   - Backup: Differentiate with verification

---

## Success Metrics

### Phase 1-3 (Foundation)
- [ ] Wallet connection success rate >95%
- [ ] Upload to IPFS <10s for 1GB file
- [ ] Smart contract gas costs <0.1 SUI per transaction

### Phase 4-6 (Core Features)
- [ ] Purchase flow completion rate >80%
- [ ] Search results latency <500ms
- [ ] Dashboard load time <2s

### Phase 7-8 (Production)
- [ ] Uptime >99.9%
- [ ] Lighthouse score >90
- [ ] Zero critical security vulnerabilities

### Business Metrics (Post-Launch)
- MAU (Monthly Active Users)
- GMV (Gross Merchandise Volume)
- Average dataset price
- Seller retention rate
- Buyer repeat purchase rate

---

## Resources & Documentation

### Learning Resources
- [Sui Documentation](https://docs.sui.io/)
- [Move Language Book](https://move-language.github.io/move/)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [IPFS Docs](https://docs.ipfs.tech/)

### Community
- Sui Discord
- Sui Forum
- GitHub Discussions

### Tools
- [Sui Explorer](https://suiexplorer.com/)
- [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet)
- [Move Analyzer VSCode Extension](https://marketplace.visualstudio.com/items?itemName=move.move-analyzer)

---

## Conclusion

This plan provides a comprehensive roadmap to transform Suilex from UI prototypes to a fully functional decentralized marketplace. The phased approach allows for iterative development, testing, and user feedback.

**Next Immediate Steps**:
1. Set up Sui wallet and get testnet SUI
2. Deploy initial smart contracts to testnet
3. Integrate wallet connection in UI
4. Set up IPFS account (Pinata)
5. Configure Supabase project

**Questions or Need Clarification?**
- Review CLAUDE.md for development guidelines
- Check package.json for available scripts
- See README.md for getting started

**Good luck building! 🚀**
