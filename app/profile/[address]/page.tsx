'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { DatasetCard } from '@/components/ui/DatasetCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ProfileContract, DataNFTContract } from '@/lib/sui/contracts';
import { walrusClient } from '@/lib/walrus/client';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { formatSUI } from '@/lib/sui/client';

interface ProfilePageProps {
  params: Promise<{ address: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const isOwnProfile = currentAccount?.address === resolvedParams.address;

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', resolvedParams.address],
    queryFn: () => ProfileContract.getProfileByOwner(suiClient, resolvedParams.address),
  });

  const { data: datasets, isLoading: datasetsLoading } = useQuery({
    queryKey: ['datasets', resolvedParams.address],
    queryFn: () => DataNFTContract.getNFTsByOwner(suiClient, resolvedParams.address),
  });

  const isLoading = profileLoading || datasetsLoading;
  const avgRating = profile?.ratingCount ? (profile.ratingSum / profile.ratingCount).toFixed(1) : '0.0';

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <LoadingSkeleton variant="detail" />
          ) : !profile ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-white/20 text-8xl mb-6 block">person_off</span>
              <h2 className="text-3xl font-black text-white mb-4">Profile Not Found</h2>
              <p className="text-text-secondary-dark/80 mb-8">This user hasn't created a trader card yet.</p>
              <Button variant="pill" size="lg" onClick={() => router.push('/marketplace')}>Browse Marketplace</Button>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-primary/30 bg-gradient-to-br from-primary/20 to-secondary/20">
                      {profile.avatarBlobId ? (
                        <img src={walrusClient.getPublicUrl(profile.avatarBlobId)} alt={profile.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-6xl font-black">{profile.username.substring(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{profile.username}</h1>
                        <p className="text-text-secondary-dark/60 font-mono text-sm">{resolvedParams.address.slice(0, 8)}...{resolvedParams.address.slice(-6)}</p>
                      </div>
                      {isOwnProfile && <Button variant="outline" size="md" onClick={() => router.push('/settings')}><span className="material-symbols-outlined text-[18px]">edit</span>Edit Profile</Button>}
                    </div>
                    {profile.bio && <p className="text-white/80 text-base leading-relaxed mb-6 max-w-2xl">{profile.bio}</p>}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="glass-card rounded-xl p-4 border border-white/5">
                        <div className="text-3xl font-black text-primary mb-1">{profile.totalDatasets}</div>
                        <div className="text-text-secondary-dark/60 text-sm font-semibold">Datasets</div>
                      </div>
                      <div className="glass-card rounded-xl p-4 border border-white/5">
                        <div className="text-3xl font-black text-success mb-1">{profile.totalSales}</div>
                        <div className="text-text-secondary-dark/60 text-sm font-semibold">Sales</div>
                      </div>
                      <div className="glass-card rounded-xl p-4 border border-white/5">
                        <div className="text-3xl font-black text-warning mb-1">{formatSUI(profile.totalRevenue)}</div>
                        <div className="text-text-secondary-dark/60 text-sm font-semibold">SUI Earned</div>
                      </div>
                      <div className="glass-card rounded-xl p-4 border border-white/5">
                        <div className="text-3xl font-black text-white mb-1 flex items-center gap-1">{avgRating}<span className="material-symbols-outlined text-yellow-500 text-2xl">star</span></div>
                        <div className="text-text-secondary-dark/60 text-sm font-semibold">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-6">Datasets ({datasets?.length || 0})</h2>
                {datasets && datasets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {datasets.map((dataset) => (
                      <DatasetCard key={dataset.id} dataset={{ id: dataset.id, title: dataset.title, description: dataset.description, price: 0, size: `${(dataset.fileSize / 1024 / 1024).toFixed(2)} MB`, category: dataset.category, fileType: dataset.fileType, seller: dataset.creator, verified: dataset.verified }} />
                    ))}
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-12 border border-white/5 text-center">
                    <span className="material-symbols-outlined text-white/20 text-7xl mb-4 block">inventory_2</span>
                    <p className="text-white/60 text-lg">No datasets yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}