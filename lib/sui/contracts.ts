import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';

// Contract addresses (to be updated after deployment)
export const CONTRACTS = {
  PROFILE_PACKAGE: process.env.NEXT_PUBLIC_PROFILE_PACKAGE_ID || '',
  MARKETPLACE_PACKAGE: process.env.NEXT_PUBLIC_MARKETPLACE_PACKAGE_ID || '',
  PROFILE_REGISTRY: process.env.NEXT_PUBLIC_PROFILE_REGISTRY_ID || '',
  MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ID || '',
};

export interface ProfileData {
  id: string;
  owner: string;
  username: string;
  bio: string;
  avatarBlobId: string;
  verificationLevel: number;
  createdAt: number;
  updatedAt: number;
  twitter: string;
  github: string;
  website: string;
  totalDatasets: number;
  totalSales: number;
  totalRevenue: number;
  ratingSum: number;
  ratingCount: number;
}

export interface DataNFTData {
  id: string;
  creator: string;
  metadataBlobId: string;
  dataBlobId: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: number;
  verified: boolean;
  verificationHash: string;
  createdAt: number;
  updatedAt: number;
  viewCount: number;
  downloadCount: number;
}

export interface ListingData {
  id: string;
  nftId: string;
  seller: string;
  price: number;
  listedAt: number;
}

/**
 * Profile Contract Functions
 */
export const ProfileContract = {
  /**
   * Create a new user profile
   */
  createProfile(
    username: string,
    bio: string,
    avatarBlobId: string
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACTS.PROFILE_PACKAGE}::profile::create_profile`,
      arguments: [
        tx.object(CONTRACTS.PROFILE_REGISTRY),
        tx.pure.string(username),
        tx.pure.string(bio),
        tx.pure.string(avatarBlobId),
      ],
    });

    return tx;
  },

  /**
   * Update profile information
   */
  updateProfile(
    profileId: string,
    bio: string,
    avatarBlobId: string,
    twitter: string,
    github: string,
    website: string
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACTS.PROFILE_PACKAGE}::profile::update_profile`,
      arguments: [
        tx.object(profileId),
        tx.pure.string(bio),
        tx.pure.string(avatarBlobId),
        tx.pure.string(twitter),
        tx.pure.string(github),
        tx.pure.string(website),
      ],
    });

    return tx;
  },

  /**
   * Update username
   */
  updateUsername(
    profileId: string,
    newUsername: string
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACTS.PROFILE_PACKAGE}::profile::update_username`,
      arguments: [
        tx.object(CONTRACTS.PROFILE_REGISTRY),
        tx.object(profileId),
        tx.pure.string(newUsername),
      ],
    });

    return tx;
  },

  /**
   * Fetch profile by owner address
   */
  async getProfileByOwner(
    client: SuiClient,
    ownerAddress: string
  ): Promise<ProfileData | null> {
    try {
      const objects = await client.getOwnedObjects({
        owner: ownerAddress,
        filter: {
          StructType: `${CONTRACTS.PROFILE_PACKAGE}::profile::Profile`,
        },
        options: {
          showContent: true,
        },
      });

      if (objects.data.length === 0) {
        return null;
      }

      const profileObj = objects.data[0];
      if (!profileObj.data || profileObj.data.content?.dataType !== 'moveObject') {
        return null;
      }

      const fields = profileObj.data.content.fields as any;

      return {
        id: profileObj.data.objectId,
        owner: fields.owner,
        username: fields.username,
        bio: fields.bio,
        avatarBlobId: fields.avatar_blob_id,
        verificationLevel: parseInt(fields.verification_level),
        createdAt: parseInt(fields.created_at),
        updatedAt: parseInt(fields.updated_at),
        twitter: fields.twitter,
        github: fields.github,
        website: fields.website,
        totalDatasets: parseInt(fields.total_datasets),
        totalSales: parseInt(fields.total_sales),
        totalRevenue: parseInt(fields.total_revenue),
        ratingSum: parseInt(fields.rating_sum),
        ratingCount: parseInt(fields.rating_count),
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },
};

/**
 * DataNFT Contract Functions
 */
export const DataNFTContract = {
  /**
   * Mint a new DataNFT
   */
  mint(
    profileId: string,
    metadataBlobId: string,
    dataBlobId: string,
    title: string,
    description: string,
    category: string,
    fileType: string,
    fileSize: number,
    verificationHash: string
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACTS.PROFILE_PACKAGE}::data_nft::mint`,
      arguments: [
        tx.object(profileId),
        tx.pure.string(metadataBlobId),
        tx.pure.string(dataBlobId),
        tx.pure.string(title),
        tx.pure.string(description),
        tx.pure.string(category),
        tx.pure.string(fileType),
        tx.pure.u64(fileSize),
        tx.pure.string(verificationHash),
      ],
    });

    return tx;
  },

  /**
   * Update NFT metadata
   */
  updateMetadata(
    nftId: string,
    metadataBlobId: string,
    title: string,
    description: string
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACTS.PROFILE_PACKAGE}::data_nft::update_metadata`,
      arguments: [
        tx.object(nftId),
        tx.pure.string(metadataBlobId),
        tx.pure.string(title),
        tx.pure.string(description),
      ],
    });

    return tx;
  },

  /**
   * Fetch NFT by ID
   */
  async getNFTById(
    client: SuiClient,
    nftId: string
  ): Promise<DataNFTData | null> {
    try {
      const object = await client.getObject({
        id: nftId,
        options: {
          showContent: true,
        },
      });

      if (!object.data || object.data.content?.dataType !== 'moveObject') {
        return null;
      }

      const fields = object.data.content.fields as any;

      return {
        id: object.data.objectId,
        creator: fields.creator,
        metadataBlobId: fields.metadata_blob_id,
        dataBlobId: fields.data_blob_id,
        title: fields.title,
        description: fields.description,
        category: fields.category,
        fileType: fields.file_type,
        fileSize: parseInt(fields.file_size),
        verified: fields.verified,
        verificationHash: fields.verification_hash,
        createdAt: parseInt(fields.created_at),
        updatedAt: parseInt(fields.updated_at),
        viewCount: parseInt(fields.view_count),
        downloadCount: parseInt(fields.download_count),
      };
    } catch (error) {
      console.error('Error fetching NFT:', error);
      return null;
    }
  },

  /**
   * Fetch all NFTs owned by address
   */
  async getNFTsByOwner(
    client: SuiClient,
    ownerAddress: string
  ): Promise<DataNFTData[]> {
    try {
      const objects = await client.getOwnedObjects({
        owner: ownerAddress,
        filter: {
          StructType: `${CONTRACTS.PROFILE_PACKAGE}::data_nft::DataNFT`,
        },
        options: {
          showContent: true,
        },
      });

      return objects.data
        .filter(obj => obj.data && obj.data.content?.dataType === 'moveObject')
        .map(obj => {
          const fields = (obj.data!.content as any).fields;
          return {
            id: obj.data!.objectId,
            creator: fields.creator,
            metadataBlobId: fields.metadata_blob_id,
            dataBlobId: fields.data_blob_id,
            title: fields.title,
            description: fields.description,
            category: fields.category,
            fileType: fields.file_type,
            fileSize: parseInt(fields.file_size),
            verified: fields.verified,
            verificationHash: fields.verification_hash,
            createdAt: parseInt(fields.created_at),
            updatedAt: parseInt(fields.updated_at),
            viewCount: parseInt(fields.view_count),
            downloadCount: parseInt(fields.download_count),
          };
        });
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  },
};

/**
 * Marketplace Contract Functions
 */
export const MarketplaceContract = {
  /**
   * List an NFT for sale
   */
  listNFT(
    nftId: string,
    price: number
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACTS.MARKETPLACE_PACKAGE}::marketplace::list_nft`,
      arguments: [
        tx.object(CONTRACTS.MARKETPLACE),
        tx.object(nftId),
        tx.pure.u64(price),
      ],
    });

    return tx;
  },

  /**
   * Buy a listed NFT
   */
  buyNFT(
    listingId: string,
    nftId: string,
    sellerProfileId: string,
    paymentCoinId: string
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACTS.MARKETPLACE_PACKAGE}::marketplace::buy_nft`,
      arguments: [
        tx.object(CONTRACTS.MARKETPLACE),
        tx.object(listingId),
        tx.object(nftId),
        tx.object(sellerProfileId),
        tx.object(paymentCoinId),
      ],
    });

    return tx;
  },

  /**
   * Update listing price
   */
  updatePrice(
    listingId: string,
    newPrice: number
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${CONTRACTS.MARKETPLACE_PACKAGE}::marketplace::update_price`,
      arguments: [
        tx.object(listingId),
        tx.pure.u64(newPrice),
      ],
    });

    return tx;
  },

  /**
   * Fetch all active listings
   */
  async getAllListings(
    client: SuiClient
  ): Promise<ListingData[]> {
    try {
      const listingType = `${CONTRACTS.MARKETPLACE_PACKAGE}::marketplace::Listing`;

      // Query dynamic fields of the Marketplace object
      const dynamicFields = await client.getDynamicFields({
        parentId: CONTRACTS.MARKETPLACE,
      });

      const listings: ListingData[] = [];

      for (const field of dynamicFields.data) {
        const listing = await client.getObject({
          id: field.objectId,
          options: {
            showContent: true,
          },
        });

        if (listing.data && listing.data.content?.dataType === 'moveObject') {
          const fields = (listing.data.content as any).fields;
          listings.push({
            id: listing.data.objectId,
            nftId: fields.nft_id,
            seller: fields.seller,
            price: parseInt(fields.price),
            listedAt: parseInt(fields.listed_at),
          });
        }
      }

      return listings;
    } catch (error) {
      console.error('Error fetching listings:', error);
      return [];
    }
  },
};
