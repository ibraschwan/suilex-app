'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { DatasetCard } from '@/components/ui/DatasetCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { DataNFTContract } from '@/lib/sui/contracts';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';

type TabType = 'all' | 'created' | 'purchased';

export default function DatasetsPage() {
  const router = useRouter();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect if not logged in
  if (!currentAccount) {
    router.push('/');
    return null;
  }

  // Fetch all NFTs owned by user
  const { data: ownedNFTs, isLoading: nftsLoading } = useQuery({
    queryKey: ['owned-nfts', currentAccount.address],
    queryFn: () => DataNFTContract.getNFTsByOwner(suiClient, currentAccount.address),
    enabled: !!currentAccount,
  });

  // Fetch all DataAccessCaps owned by user (purchased datasets)
  const { data: accessCaps, isLoading: capsLoading } = useQuery({
    queryKey: ['access-caps', currentAccount.address],
    queryFn: async () => {
      const objects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${process.env.NEXT_PUBLIC_PROFILE_PACKAGE_ID}::data_nft::DataAccessCap`,
        },
        options: { showContent: true },
      });

      const nftIds = objects.data
        .filter(obj => obj.data && obj.data.content?.dataType === 'moveObject')
        .map(obj => (obj.data!.content as any).fields.nft_id);

      // Fetch full NFT details for each purchased dataset
      const nftDetails = await Promise.all(
        nftIds.map(id => DataNFTContract.getNFTById(suiClient, id))
      );

      return nftDetails.filter(nft => nft !== null);
    },
    enabled: !!currentAccount,
  });

  const isLoading = nftsLoading || capsLoading;

  // Separate created vs purchased datasets
  const { createdDatasets, purchasedDatasets } = useMemo(() => {
    const created = ownedNFTs || [];
    const purchased = (accessCaps || []).filter(
      nft => nft.creator !== currentAccount.address
    );
    return { createdDatasets: created, purchasedDatasets: purchased };
  }, [ownedNFTs, accessCaps, currentAccount.address]);

  // Filter datasets based on active tab
  const filteredByTab = useMemo(() => {
    if (activeTab === 'created') return createdDatasets;
    if (activeTab === 'purchased') return purchasedDatasets;
    // 'all' - combine both, removing duplicates
    const allDatasets = [...createdDatasets];
    purchasedDatasets.forEach(purchased => {
      if (!allDatasets.find(d => d.id === purchased.id)) {
        allDatasets.push(purchased);
      }
    });
    return allDatasets;
  }, [activeTab, createdDatasets, purchasedDatasets]);

  // Filter by search query
  const filteredDatasets = useMemo(() => {
    if (!searchQuery.trim()) return filteredByTab;
    const query = searchQuery.toLowerCase();
    return filteredByTab.filter(
      dataset =>
        dataset.title.toLowerCase().includes(query) ||
        dataset.description.toLowerCase().includes(query) ||
        dataset.category.toLowerCase().includes(query)
    );
  }, [filteredByTab, searchQuery]);

  const tabs = [
    { id: 'all' as TabType, label: 'All Datasets', count: createdDatasets.length + purchasedDatasets.length },
    { id: 'created' as TabType, label: 'Created', count: createdDatasets.length },
    { id: 'purchased' as TabType, label: 'Purchased', count: purchasedDatasets.length },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">My Datasets</h1>
            <p className="text-text-secondary-dark/80 text-base">
              Manage your created datasets and view your purchased data
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
                <span className="ml-2 opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search datasets..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Datasets Grid */}
          {isLoading ? (
            <LoadingSkeleton variant="grid" />
          ) : filteredDatasets.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 border border-white/5 text-center">
              <span className="material-symbols-outlined text-white/20 text-8xl mb-6 block">
                {searchQuery ? 'search_off' : activeTab === 'created' ? 'add_circle' : 'shopping_bag'}
              </span>
              <h2 className="text-2xl font-black text-white mb-4">
                {searchQuery
                  ? 'No datasets found'
                  : activeTab === 'created'
                  ? 'No created datasets yet'
                  : activeTab === 'purchased'
                  ? 'No purchased datasets yet'
                  : 'No datasets yet'}
              </h2>
              <p className="text-text-secondary-dark/80 mb-8">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : activeTab === 'created'
                  ? 'Start by uploading your first dataset to the marketplace'
                  : activeTab === 'purchased'
                  ? 'Browse the marketplace to purchase datasets'
                  : 'Create or purchase datasets to get started'}
              </p>
              <div className="flex gap-4 justify-center">
                {activeTab !== 'purchased' && (
                  <Button variant="pill" size="lg" onClick={() => router.push('/sell')}>
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    Upload Dataset
                  </Button>
                )}
                {activeTab !== 'created' && (
                  <Button variant="outline" size="lg" onClick={() => router.push('/marketplace')}>
                    <span className="material-symbols-outlined text-[18px]">explore</span>
                    Browse Marketplace
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDatasets.map(dataset => (
                  <DatasetCard
                    key={dataset.id}
                    dataset={{
                      id: dataset.id,
                      title: dataset.title,
                      description: dataset.description,
                      price: 0,
                      size: `${(dataset.fileSize / 1024 / 1024).toFixed(2)} MB`,
                      category: dataset.category,
                      fileType: dataset.fileType,
                      seller: dataset.creator,
                      verified: dataset.verified,
                    }}
                  />
                ))}
              </div>

              {/* Results Summary */}
              <div className="mt-8 text-center text-text-secondary-dark/60 text-sm">
                Showing {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? 's' : ''}
                {searchQuery && ` matching ${searchQuery}`}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
