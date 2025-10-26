import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { MarketplaceContract, DataNFTContract, ListingData, DataNFTData } from '@/lib/sui/contracts';
import { walrusClient } from '@/lib/walrus/client';
import { DatasetMetadata } from '@/lib/utils/upload';
import { getDatasetById, mockDatasets } from '@/lib/mock-data/datasets';

export interface MarketplaceDataset {
  nft: DataNFTData;
  listing: ListingData;
  metadata: DatasetMetadata | null;
}

/**
 * Hook to fetch all marketplace listings
 */
export function useMarketplaceListings() {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ['marketplace', 'listings'],
    queryFn: async () => {
      // Get all listings from marketplace
      const listings = await MarketplaceContract.getAllListings(suiClient);

      // Fetch NFT details for each listing
      const datasetsPromises = listings.map(async (listing) => {
        const nft = await DataNFTContract.getNFTById(suiClient, listing.nftId);
        if (!nft) return null;

        // Load metadata from Walrus
        let metadata: DatasetMetadata | null = null;
        try {
          metadata = await walrusClient.downloadJSON<DatasetMetadata>(nft.metadataBlobId);
        } catch (error) {
          console.error('Failed to load metadata:', error);
        }

        return {
          nft,
          listing,
          metadata,
        } as MarketplaceDataset;
      });

      const datasets = await Promise.all(datasetsPromises);
      return datasets.filter((d): d is MarketplaceDataset => d !== null);
    },
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Hook to fetch a single NFT with its listing (if exists)
 */
export function useDatasetDetail(nftId: string) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ['dataset', nftId],
    queryFn: async () => {
      try {
        // Try to fetch from blockchain
        const nft = await DataNFTContract.getNFTById(suiClient, nftId);
        if (!nft) throw new Error('Dataset not found on blockchain');

        // Load metadata from Walrus
        let metadata: DatasetMetadata | null = null;
        try {
          metadata = await walrusClient.downloadJSON<DatasetMetadata>(nft.metadataBlobId);
        } catch (error) {
          console.error('Failed to load metadata:', error);
        }

        // Check if listed
        const allListings = await MarketplaceContract.getAllListings(suiClient);
        const listing = allListings.find((l) => l.nftId === nftId);

        return {
          nft,
          listing: listing || null,
          metadata,
        };
      } catch (error) {
        // Fallback to mock data in development
        console.log('Blockchain data unavailable, using mock data for:', nftId);
        const mockDataset = getDatasetById(nftId);

        if (!mockDataset) {
          throw new Error('Dataset not found');
        }

        // Transform mock data to match expected format
        const mockNFT: DataNFTData = {
          id: mockDataset.id,
          title: mockDataset.title,
          description: mockDataset.description,
          category: mockDataset.category,
          fileType: mockDataset.fileType,
          fileSize: mockDataset.fileSize,
          creator: mockDataset.creator,
          verified: mockDataset.verified,
          dataBlobId: mockDataset.blobId,
          metadataBlobId: mockDataset.metadataBlobId,
          verificationHash: mockDataset.verificationHash,
          createdAt: mockDataset.created,
          viewCount: mockDataset.viewCount,
          downloadCount: mockDataset.downloadCount,
        };

        const mockMetadata: DatasetMetadata = {
          fileName: mockDataset.fileName,
          fileSize: mockDataset.fileSize,
          license: mockDataset.license,
          version: mockDataset.version,
          uploadedAt: mockDataset.created * 1000, // Convert to milliseconds
        };

        // Create a mock listing (price in MIST)
        const mockListing: ListingData = {
          id: `listing-${mockDataset.id}`,
          nftId: mockDataset.id,
          seller: mockDataset.creator,
          price: mockDataset.price * 1_000_000_000, // Convert SUI to MIST
          createdAt: mockDataset.created,
        };

        return {
          nft: mockNFT,
          listing: mockListing,
          metadata: mockMetadata,
        };
      }
    },
    enabled: !!nftId,
    staleTime: 30000,
  });
}

/**
 * Hook to list an NFT on the marketplace
 */
export function useListNFT() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      nftId,
      price,
    }: {
      nftId: string;
      price: number; // in MIST
    }) => {
      return new Promise((resolve, reject) => {
        const tx = MarketplaceContract.listNFT(nftId, price);

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              resolve(result);
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });
    },
    onSuccess: () => {
      // Invalidate marketplace listings to refetch
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'listings'] });
    },
  });
}

/**
 * Hook to purchase an NFT
 */
export function usePurchaseNFT() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      nftId,
      sellerProfileId,
      paymentCoinId,
    }: {
      listingId: string;
      nftId: string;
      sellerProfileId: string;
      paymentCoinId: string;
    }) => {
      return new Promise((resolve, reject) => {
        const tx = MarketplaceContract.buyNFT(
          listingId,
          nftId,
          sellerProfileId,
          paymentCoinId
        );

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              resolve(result);
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'listings'] });
      queryClient.invalidateQueries({ queryKey: ['dataset', variables.nftId] });
    },
  });
}

/**
 * Hook to update listing price
 */
export function useUpdatePrice() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      newPrice,
    }: {
      listingId: string;
      newPrice: number; // in MIST
    }) => {
      return new Promise((resolve, reject) => {
        const tx = MarketplaceContract.updatePrice(listingId, newPrice);

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              resolve(result);
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'listings'] });
    },
  });
}

/**
 * Hook to check if user can access a dataset (owns DataAccessCap)
 */
export function useCanAccessDataset(nftId: string, userAddress?: string) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ['access', nftId, userAddress],
    queryFn: async () => {
      if (!userAddress) return false;

      // Query user's DataAccessCap objects
      const objects = await suiClient.getOwnedObjects({
        owner: userAddress,
        filter: {
          StructType: `${process.env.NEXT_PUBLIC_PROFILE_PACKAGE_ID}::data_nft::DataAccessCap`,
        },
        options: {
          showContent: true,
        },
      });

      // Check if any DataAccessCap is for this NFT
      for (const obj of objects.data) {
        if (obj.data && obj.data.content?.dataType === 'moveObject') {
          const fields = (obj.data.content as any).fields;
          if (fields.nft_id === nftId) {
            return true;
          }
        }
      }

      return false;
    },
    enabled: !!nftId && !!userAddress,
    staleTime: 60000, // Cache for 1 minute
  });
}
