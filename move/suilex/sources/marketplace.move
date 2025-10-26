module suilex::marketplace {
    use std::string::{Self, String};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::table::{Self, Table};
    use sui::event;
    use suilex::data_nft::{Self, DataNFT, DataAccessCap};
    use suilex::profile::{Self, Profile};

    // ===== Errors =====
    const ENotListingOwner: u64 = 1;
    const EListingNotFound: u64 = 2;
    const EInsufficientPayment: u64 = 3;
    const ECannotBuyOwnListing: u64 = 4;
    const EListingAlreadyExists: u64 = 5;

    // ===== Structs =====

    /// Marketplace listing for a DataNFT
    public struct Listing has key, store {
        id: UID,
        nft_id: ID,
        seller: address,
        price: u64, // in MIST (1 SUI = 1,000,000,000 MIST)
        listed_at: u64,
    }

    /// Global marketplace registry
    public struct Marketplace has key {
        id: UID,
        listings: Table<ID, ID>, // NFT ID -> Listing ID
        platform_fee_bps: u64, // Basis points (100 bps = 1%)
        platform_balance: Balance<SUI>,
    }

    // ===== Events =====

    public struct Listed has copy, drop {
        listing_id: ID,
        nft_id: ID,
        seller: address,
        price: u64,
    }

    public struct Delisted has copy, drop {
        listing_id: ID,
        nft_id: ID,
        seller: address,
    }

    public struct Sold has copy, drop {
        listing_id: ID,
        nft_id: ID,
        seller: address,
        buyer: address,
        price: u64,
    }

    public struct PriceUpdated has copy, drop {
        listing_id: ID,
        nft_id: ID,
        old_price: u64,
        new_price: u64,
    }

    // ===== Init =====

    fun init(ctx: &mut TxContext) {
        let marketplace = Marketplace {
            id: object::new(ctx),
            listings: table::new(ctx),
            platform_fee_bps: 250, // 2.5% platform fee
            platform_balance: balance::zero(),
        };
        transfer::share_object(marketplace);
    }

    // ===== Public Functions =====

    /// List a DataNFT for sale
    public entry fun list_nft(
        marketplace: &mut Marketplace,
        nft: DataNFT,
        price: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft_id = object::id(&nft);

        // Check if NFT is already listed
        assert!(!table::contains(&marketplace.listings, nft_id), EListingAlreadyExists);

        let listing_uid = object::new(ctx);
        let listing_id = object::uid_to_inner(&listing_uid);

        let listing = Listing {
            id: listing_uid,
            nft_id,
            seller: sender,
            price,
            listed_at: tx_context::epoch(ctx),
        };

        // Add to marketplace registry
        table::add(&mut marketplace.listings, nft_id, listing_id);

        event::emit(Listed {
            listing_id,
            nft_id,
            seller: sender,
            price,
        });

        // Share listing object
        transfer::share_object(listing);
        // Keep NFT in seller's custody but transfer to a shared object would be better for true escrow
        transfer::public_transfer(nft, sender);
    }

    /// Buy a listed DataNFT
    public entry fun buy_nft(
        marketplace: &mut Marketplace,
        listing: &mut Listing,
        nft: DataNFT,
        seller_profile: &mut Profile,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let buyer = tx_context::sender(ctx);
        let nft_id = object::id(&nft);
        let listing_id = object::id(listing);

        // Validate
        assert!(nft_id == listing.nft_id, EListingNotFound);
        assert!(buyer != listing.seller, ECannotBuyOwnListing);
        assert!(coin::value(&payment) >= listing.price, EInsufficientPayment);

        // Calculate fees
        let price = listing.price;
        let platform_fee = (price * marketplace.platform_fee_bps) / 10000;
        let seller_amount = price - platform_fee;

        // Split payment
        let mut payment_balance = coin::into_balance(payment);
        let platform_fee_balance = balance::split(&mut payment_balance, platform_fee);
        let seller_payment = coin::from_balance(payment_balance, ctx);

        // Add platform fee to marketplace balance
        balance::join(&mut marketplace.platform_balance, platform_fee_balance);

        // Pay seller
        transfer::public_transfer(seller_payment, listing.seller);

        // Grant access capability to buyer
        let access_cap = data_nft::grant_access(&nft, buyer, ctx);

        // Update seller profile stats
        profile::increment_sales(seller_profile, price);

        // Remove listing from registry
        table::remove(&mut marketplace.listings, nft_id);

        event::emit(Sold {
            listing_id,
            nft_id,
            seller: listing.seller,
            buyer,
            price,
        });

        // Transfer NFT ownership to buyer (or keep with seller, access via cap)
        // For data marketplace, we keep NFT with seller but grant access
        transfer::public_transfer(nft, listing.seller);
        transfer::public_transfer(access_cap, buyer);
    }

    /// Delist a DataNFT
    public fun delist_nft(
        marketplace: &mut Marketplace,
        listing: Listing,
        nft: DataNFT,
        ctx: &mut TxContext
    ): DataNFT {
        let sender = tx_context::sender(ctx);
        let nft_id = object::id(&nft);

        assert!(listing.seller == sender, ENotListingOwner);
        assert!(listing.nft_id == nft_id, EListingNotFound);

        // Remove from marketplace
        table::remove(&mut marketplace.listings, nft_id);

        event::emit(Delisted {
            listing_id: object::id(&listing),
            nft_id,
            seller: sender,
        });

        // Delete listing
        let Listing { id, nft_id: _, seller: _, price: _, listed_at: _ } = listing;
        object::delete(id);

        nft
    }

    /// Update listing price
    public entry fun update_price(
        listing: &mut Listing,
        new_price: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == listing.seller, ENotListingOwner);

        let old_price = listing.price;
        listing.price = new_price;

        event::emit(PriceUpdated {
            listing_id: object::id(listing),
            nft_id: listing.nft_id,
            old_price,
            new_price,
        });
    }

    /// Withdraw platform fees (admin only)
    public entry fun withdraw_fees(
        marketplace: &mut Marketplace,
        recipient: address,
        amount: u64,
        ctx: &mut TxContext
    ) {
        // In production, add admin capability check
        let withdrawn = balance::split(&mut marketplace.platform_balance, amount);
        let coin = coin::from_balance(withdrawn, ctx);
        transfer::public_transfer(coin, recipient);
    }

    // ===== View Functions =====

    public fun get_listing_price(listing: &Listing): u64 {
        listing.price
    }

    public fun get_listing_seller(listing: &Listing): address {
        listing.seller
    }

    public fun get_listing_nft_id(listing: &Listing): ID {
        listing.nft_id
    }

    public fun is_listed(marketplace: &Marketplace, nft_id: ID): bool {
        table::contains(&marketplace.listings, nft_id)
    }

    public fun get_platform_fee_bps(marketplace: &Marketplace): u64 {
        marketplace.platform_fee_bps
    }
}
