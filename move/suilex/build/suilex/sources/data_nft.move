module suilex::data_nft {
    use std::string::{Self, String};
    use sui::url::{Self, Url};
    use sui::event;
    use suilex::profile::{Self, Profile};

    // ===== Errors =====
    const ENotNFTOwner: u64 = 1;
    const EInvalidPrice: u64 = 2;

    // ===== Structs =====

    /// DataNFT represents a dataset minted as an NFT
    public struct DataNFT has key, store {
        id: UID,
        // Creator info
        creator: address,
        // Dataset metadata (stored in Walrus)
        metadata_blob_id: String, // Walrus blob ID for JSON metadata
        data_blob_id: String,     // Walrus blob ID for actual dataset file
        // On-chain searchable info
        title: String,
        description: String,
        category: String,
        file_type: String,
        file_size: u64, // in bytes
        // Verification
        verified: bool,
        verification_hash: String,
        // Timestamps
        created_at: u64,
        updated_at: u64,
        // Stats
        view_count: u64,
        download_count: u64,
    }

    /// Capability to access dataset (given to buyers)
    public struct DataAccessCap has key, store {
        id: UID,
        nft_id: ID,
        buyer: address,
        granted_at: u64,
    }

    // ===== Events =====

    public struct NFTMinted has copy, drop {
        nft_id: ID,
        creator: address,
        title: String,
        data_blob_id: String,
    }

    public struct NFTTransferred has copy, drop {
        nft_id: ID,
        from: address,
        to: address,
    }

    public struct AccessGranted has copy, drop {
        nft_id: ID,
        buyer: address,
        cap_id: ID,
    }

    // ===== Public Functions =====

    /// Mint a new DataNFT
    public entry fun mint(
        profile: &mut Profile,
        metadata_blob_id: String,
        data_blob_id: String,
        title: String,
        description: String,
        category: String,
        file_type: String,
        file_size: u64,
        verification_hash: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        let nft_uid = object::new(ctx);
        let nft_id = object::uid_to_inner(&nft_uid);

        let nft = DataNFT {
            id: nft_uid,
            creator: sender,
            metadata_blob_id,
            data_blob_id,
            title: title,
            description,
            category,
            file_type,
            file_size,
            verified: false, // Can be verified later by admin/oracle
            verification_hash,
            created_at: tx_context::epoch(ctx),
            updated_at: tx_context::epoch(ctx),
            view_count: 0,
            download_count: 0,
        };

        // Update creator's profile stats
        profile::increment_datasets(profile);

        event::emit(NFTMinted {
            nft_id,
            creator: sender,
            title,
            data_blob_id,
        });

        transfer::transfer(nft, sender);
    }

    /// Transfer NFT to another address
    public entry fun transfer_nft(
        nft: DataNFT,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft_id = object::id(&nft);

        event::emit(NFTTransferred {
            nft_id,
            from: sender,
            to: recipient,
        });

        transfer::transfer(nft, recipient);
    }

    /// Grant access capability to a buyer (called by marketplace after purchase)
    public fun grant_access(
        nft: &DataNFT,
        buyer: address,
        ctx: &mut TxContext
    ): DataAccessCap {
        let cap = DataAccessCap {
            id: object::new(ctx),
            nft_id: object::id(nft),
            buyer,
            granted_at: tx_context::epoch(ctx),
        };

        event::emit(AccessGranted {
            nft_id: object::id(nft),
            buyer,
            cap_id: object::id(&cap),
        });

        cap
    }

    /// Update metadata (owner only)
    public entry fun update_metadata(
        nft: &mut DataNFT,
        metadata_blob_id: String,
        title: String,
        description: String,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == nft.creator, ENotNFTOwner);

        nft.metadata_blob_id = metadata_blob_id;
        nft.title = title;
        nft.description = description;
        nft.updated_at = tx_context::epoch(ctx);
    }

    /// Mark as verified (admin/oracle only - simplified version)
    public entry fun mark_verified(
        nft: &mut DataNFT,
        ctx: &mut TxContext
    ) {
        // In production, add admin capability check
        nft.verified = true;
        nft.updated_at = tx_context::epoch(ctx);
    }

    /// Increment view count
    public fun increment_views(nft: &mut DataNFT) {
        nft.view_count = nft.view_count + 1;
    }

    /// Increment download count
    public fun increment_downloads(nft: &mut DataNFT) {
        nft.download_count = nft.download_count + 1;
    }

    // ===== View Functions =====

    public fun get_creator(nft: &DataNFT): address {
        nft.creator
    }

    public fun get_data_blob_id(nft: &DataNFT): String {
        nft.data_blob_id
    }

    public fun get_metadata_blob_id(nft: &DataNFT): String {
        nft.metadata_blob_id
    }

    public fun get_title(nft: &DataNFT): String {
        nft.title
    }

    public fun get_description(nft: &DataNFT): String {
        nft.description
    }

    public fun get_category(nft: &DataNFT): String {
        nft.category
    }

    public fun is_verified(nft: &DataNFT): bool {
        nft.verified
    }

    public fun get_stats(nft: &DataNFT): (u64, u64) {
        (nft.view_count, nft.download_count)
    }

    public fun get_file_info(nft: &DataNFT): (String, u64) {
        (nft.file_type, nft.file_size)
    }
}
