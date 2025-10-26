module suilex::profile {
    use std::string::{Self, String};
    use sui::table::{Self, Table};
    use sui::event;

    // ===== Errors =====
    const EProfileAlreadyExists: u64 = 1;
    const EProfileDoesNotExist: u64 = 2;
    const ENotProfileOwner: u64 = 3;
    const EUsernameAlreadyTaken: u64 = 4;
    const EInvalidUsername: u64 = 5;

    // ===== Structs =====

    /// User profile stored on-chain
    public struct Profile has key, store {
        id: UID,
        owner: address,
        username: String,
        bio: String,
        avatar_blob_id: String, // Walrus blob ID for avatar
        verification_level: u8, // 0 = unverified, 1 = verified, 2 = official
        created_at: u64,
        updated_at: u64,
        // Social links
        twitter: String,
        github: String,
        website: String,
        // Stats
        total_datasets: u64,
        total_sales: u64,
        total_revenue: u64,
        rating_sum: u64,
        rating_count: u64,
    }

    /// Global registry to track username uniqueness
    public struct ProfileRegistry has key {
        id: UID,
        username_to_address: Table<String, address>,
        address_to_profile_id: Table<address, ID>,
    }

    // ===== Events =====

    public struct ProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
        username: String,
    }

    public struct ProfileUpdated has copy, drop {
        profile_id: ID,
        owner: address,
    }

    // ===== Init =====

    fun init(ctx: &mut TxContext) {
        let registry = ProfileRegistry {
            id: object::new(ctx),
            username_to_address: table::new(ctx),
            address_to_profile_id: table::new(ctx),
        };
        transfer::share_object(registry);
    }

    // ===== Public Functions =====

    /// Create a new user profile
    public entry fun create_profile(
        registry: &mut ProfileRegistry,
        username: String,
        bio: String,
        avatar_blob_id: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // Check if profile already exists
        assert!(!table::contains(&registry.address_to_profile_id, sender), EProfileAlreadyExists);

        // Validate username (basic check: not empty, length > 3)
        let username_bytes = string::bytes(&username);
        assert!(std::vector::length(username_bytes) >= 3, EInvalidUsername);

        // Check if username is already taken
        assert!(!table::contains(&registry.username_to_address, username), EUsernameAlreadyTaken);

        let profile_uid = object::new(ctx);
        let profile_id = object::uid_to_inner(&profile_uid);

        let profile = Profile {
            id: profile_uid,
            owner: sender,
            username: username,
            bio,
            avatar_blob_id,
            verification_level: 0,
            created_at: tx_context::epoch(ctx),
            updated_at: tx_context::epoch(ctx),
            twitter: string::utf8(b""),
            github: string::utf8(b""),
            website: string::utf8(b""),
            total_datasets: 0,
            total_sales: 0,
            total_revenue: 0,
            rating_sum: 0,
            rating_count: 0,
        };

        // Register username and address
        table::add(&mut registry.username_to_address, username, sender);
        table::add(&mut registry.address_to_profile_id, sender, profile_id);

        event::emit(ProfileCreated {
            profile_id,
            owner: sender,
            username,
        });

        transfer::transfer(profile, sender);
    }

    /// Update profile information
    public entry fun update_profile(
        profile: &mut Profile,
        bio: String,
        avatar_blob_id: String,
        twitter: String,
        github: String,
        website: String,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == profile.owner, ENotProfileOwner);

        profile.bio = bio;
        profile.avatar_blob_id = avatar_blob_id;
        profile.twitter = twitter;
        profile.github = github;
        profile.website = website;
        profile.updated_at = tx_context::epoch(ctx);

        event::emit(ProfileUpdated {
            profile_id: object::uid_to_inner(&profile.id),
            owner: profile.owner,
        });
    }

    /// Update username (admin only in practice, or can be public with checks)
    public entry fun update_username(
        registry: &mut ProfileRegistry,
        profile: &mut Profile,
        new_username: String,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == profile.owner, ENotProfileOwner);

        // Validate new username
        let username_bytes = string::bytes(&new_username);
        assert!(std::vector::length(username_bytes) >= 3, EInvalidUsername);

        // Check if new username is already taken
        assert!(!table::contains(&registry.username_to_address, new_username), EUsernameAlreadyTaken);

        // Remove old username mapping
        table::remove(&mut registry.username_to_address, profile.username);

        // Add new username mapping
        table::add(&mut registry.username_to_address, new_username, profile.owner);

        profile.username = new_username;
        profile.updated_at = tx_context::epoch(ctx);

        event::emit(ProfileUpdated {
            profile_id: object::uid_to_inner(&profile.id),
            owner: profile.owner,
        });
    }

    /// Increment dataset count (called by DataNFT module)
    public fun increment_datasets(profile: &mut Profile) {
        profile.total_datasets = profile.total_datasets + 1;
    }

    /// Increment sales stats (called by Marketplace module)
    public fun increment_sales(profile: &mut Profile, revenue: u64) {
        profile.total_sales = profile.total_sales + 1;
        profile.total_revenue = profile.total_revenue + revenue;
    }

    /// Add rating (called by review system)
    public fun add_rating(profile: &mut Profile, rating: u64) {
        profile.rating_sum = profile.rating_sum + rating;
        profile.rating_count = profile.rating_count + 1;
    }

    // ===== View Functions =====

    public fun get_username(profile: &Profile): String {
        profile.username
    }

    public fun get_bio(profile: &Profile): String {
        profile.bio
    }

    public fun get_avatar_blob_id(profile: &Profile): String {
        profile.avatar_blob_id
    }

    public fun get_owner(profile: &Profile): address {
        profile.owner
    }

    public fun get_stats(profile: &Profile): (u64, u64, u64, u64, u64) {
        (profile.total_datasets, profile.total_sales, profile.total_revenue, profile.rating_sum, profile.rating_count)
    }
}
