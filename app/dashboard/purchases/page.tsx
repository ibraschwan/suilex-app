'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { DataNFTContract } from '@/lib/sui/contracts';
import { formatSUI } from '@/lib/sui/client';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';

type SortOption = 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc';

export default function PurchasesPage() {
  const router = useRouter();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Redirect if not logged in
  if (!currentAccount) {
    router.push('/');
    return null;
  }

  // Fetch all DataAccessCaps (purchased datasets)
  const { data: purchases, isLoading } = useQuery({
    queryKey: ['purchases', currentAccount.address],
    queryFn: async () => {
      const objects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${process.env.NEXT_PUBLIC_PROFILE_PACKAGE_ID}::data_nft::DataAccessCap`,
        },
        options: { showContent: true },
      });

      const purchaseDetails = await Promise.all(
        objects.data.map(async obj => {
          if (!obj.data || obj.data.content?.dataType !== 'moveObject') return null;
          
          const fields = (obj.data.content as any).fields;
          const nftId = fields.nft_id;
          
          // Fetch NFT details
          const nft = await DataNFTContract.getNFTById(suiClient, nftId);
          if (!nft) return null;

          return {
            id: obj.data.objectId,
            nftId: nftId,
            dataset: nft,
            purchaseDate: new Date(parseInt(fields.purchased_at || '0')),
            pricePaid: parseInt(fields.price_paid || '0'),
            txHash: fields.tx_hash || '',
          };
        })
      );

      return purchaseDetails.filter(p => p !== null);
    },
    enabled: !!currentAccount,
  });

  // Get unique categories
  const categories = useMemo(() => {
    if (!purchases) return [];
    const cats = new Set(purchases.map(p => p.dataset.category));
    return Array.from(cats);
  }, [purchases]);

  // Filter and sort purchases
  const filteredPurchases = useMemo(() => {
    if (!purchases) return [];

    let filtered = purchases;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.dataset.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.dataset.title.toLowerCase().includes(query) ||
          p.dataset.description.toLowerCase().includes(query) ||
          p.dataset.category.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime());
        break;
      case 'date-asc':
        sorted.sort((a, b) => a.purchaseDate.getTime() - b.purchaseDate.getTime());
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.pricePaid - a.pricePaid);
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.pricePaid - b.pricePaid);
        break;
    }

    return sorted;
  }, [purchases, selectedCategory, searchQuery, sortBy]);

  const totalSpent = useMemo(() => {
    if (!purchases) return 0;
    return purchases.reduce((sum, p) => sum + p.pricePaid, 0);
  }, [purchases]);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Purchase History</h1>
            <p className="text-text-secondary-dark/80 text-base">
              View and manage all your dataset purchases
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary text-[28px]">shopping_bag</span>
                <span className="text-text-secondary-dark/60 text-sm font-semibold">Total Purchases</span>
              </div>
              <div className="text-3xl font-black text-white">{purchases?.length || 0}</div>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-warning text-[28px]">payments</span>
                <span className="text-text-secondary-dark/60 text-sm font-semibold">Total Spent</span>
              </div>
              <div className="text-3xl font-black text-warning">{formatSUI(totalSpent)}</div>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-success text-[28px]">verified</span>
                <span className="text-text-secondary-dark/60 text-sm font-semibold">AI-Verified</span>
              </div>
              <div className="text-3xl font-black text-success">
                {purchases?.filter(p => p.dataset.verified).length || 0}
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search purchases..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-desc">Highest Price</option>
                <option value="price-asc">Lowest Price</option>
              </select>
            </div>
          </div>

          {/* Purchases List */}
          {isLoading ? (
            <LoadingSkeleton variant="list" />
          ) : filteredPurchases.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 border border-white/5 text-center">
              <span className="material-symbols-outlined text-white/20 text-8xl mb-6 block">
                {searchQuery || selectedCategory !== 'all' ? 'search_off' : 'shopping_cart'}
              </span>
              <h2 className="text-2xl font-black text-white mb-4">
                {searchQuery || selectedCategory !== 'all' ? 'No purchases found' : 'No purchases yet'}
              </h2>
              <p className="text-text-secondary-dark/80 mb-8">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Browse the marketplace to purchase your first dataset'}
              </p>
              <Button variant="pill" size="lg" onClick={() => router.push('/marketplace')}>
                <span className="material-symbols-outlined text-[18px]">explore</span>
                Browse Marketplace
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {filteredPurchases.map(purchase => (
                  <div
                    key={purchase.id}
                    className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Dataset Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{purchase.dataset.title}</h3>
                            <p className="text-text-secondary-dark/70 text-sm line-clamp-2">
                              {purchase.dataset.description}
                            </p>
                          </div>
                          {purchase.dataset.verified && (
                            <Badge variant="success" icon="verified">AI-Verified</Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary-dark/60">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">category</span>
                            <span>{purchase.dataset.category}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">description</span>
                            <span>{purchase.dataset.fileType}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">storage</span>
                            <span>{(purchase.dataset.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                      </div>

                      {/* Purchase Details */}
                      <div className="flex flex-col justify-between items-end gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-black text-warning mb-1">
                            {formatSUI(purchase.pricePaid)}
                          </div>
                          <div className="text-xs text-text-secondary-dark/60">
                            {purchase.purchaseDate.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dataset/${purchase.nftId}`)}
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            View
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              // Download functionality handled by DownloadButton component
                              router.push(`/dataset/${purchase.nftId}`);
                            }}
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Results Summary */}
              <div className="mt-8 text-center text-text-secondary-dark/60 text-sm">
                Showing {filteredPurchases.length} purchase{filteredPurchases.length !== 1 ? 's' : ''}
                {searchQuery && ` matching ${searchQuery}`}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
