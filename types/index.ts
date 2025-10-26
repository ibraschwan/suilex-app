export type VerificationLevel = 'unverified' | 'verified' | 'official';

export interface SellerProfile {
  walletAddress: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  verified: boolean;
  verificationLevel: VerificationLevel;
  email?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
  stats: {
    totalSales: number;
    totalRevenue: number;
    datasetsListed: number;
    rating: number;
  };
  joinedDate?: string;
}

export interface Dataset {
  id: string;
  title: string;
  description: string;
  price: number;
  size: string;
  category: string;
  fileType: string;
  seller: string;
  sellerProfile?: SellerProfile;
  verified: boolean;
  fromHuggingFace?: boolean;
  huggingFaceId?: string;
  huggingFaceStats?: {
    downloads: number;
    likes: number;
  };
}

export interface UserStats {
  totalEarnings: number;
  datasetsPurchased: number;
  activeListings: number;
  monthlyChange?: string;
}

// Buyer-specific stats
export interface BuyerStats {
  totalSpent: number;
  datasetsOwned: number;
  wishlistCount: number;
  recentPurchases: number;
}

// Seller-specific stats
export interface SellerStats {
  totalEarnings: number;
  activeListings: number;
  totalSales: number;
  monthlyEarnings: number;
  monthlyChange?: string;
}

// Purchase history
export interface PurchaseHistoryItem {
  id: string;
  datasetId: string;
  datasetTitle: string;
  price: number;
  purchaseDate: string;
  seller: string;
  transactionHash: string;
}

// Wishlist
export interface WishlistItem {
  id: string;
  dataset: Dataset;
  addedDate: string;
}

export interface Listing {
  id: string;
  title: string;
  size: string;
  records: string;
  price: number;
  imageUrl?: string;
}

export interface Sale {
  datasetTitle: string;
  amount: number;
  timeAgo: string;
}

export interface HuggingFaceDataset {
  id: string;
  name: string;
  description: string;
  author: string;
  downloads: number;
  likes: number;
  size: string;
  tags: string[];
}
