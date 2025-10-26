'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { PurchaseModal } from '@/components/purchase/PurchaseModal';
import { DownloadButton } from '@/components/dataset/DownloadButton';
import { useDatasetDetail } from '@/lib/hooks/useMarketplace';
import { useCurrentProfile } from '@/lib/hooks/useProfile';
import { formatSUI, truncateAddress } from '@/lib/sui/client';
import { formatFileSize } from '@/lib/utils/upload';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface DatasetDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DatasetDetailPage({ params }: DatasetDetailPageProps) {
  const unwrappedParams = use(params);
  const nftId = unwrappedParams.id;

  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const { data: currentProfile } = useCurrentProfile();
  const { data, isLoading, error } = useDatasetDetail(nftId);

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 pt-[60px] px-4 py-12 sm:px-6 md:px-10 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <LoadingSkeleton variant="detail" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 pt-[60px] px-4 py-12 sm:px-6 md:px-10 lg:px-20">
          <div className="mx-auto max-w-6xl text-center py-16">
            <span className="material-symbols-outlined text-white/20 text-8xl mb-4 block">
              error
            </span>
            <h1 className="text-white text-3xl font-bold mb-4">Dataset Not Found</h1>
            <p className="text-text-secondary-dark mb-6">
              This dataset may have been removed or doesn't exist.
            </p>
            <Button variant="pill" size="lg" onClick={() => router.push('/marketplace')}>
              Back to Marketplace
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { nft, listing, metadata } = data;
  const isOwner = currentAccount?.address === nft.creator;
  const isListed = !!listing;

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 pt-[60px] px-4 py-12 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-8"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-medium">Back to Marketplace</span>
          </button>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col gap-6 mb-12">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                    {nft.title}
                  </h1>
                  {nft.verified && (
                    <Badge variant="success" icon="verified">
                      AI-Verified
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-text-secondary-dark/80 leading-relaxed">
                  {nft.description}
                </p>
              </div>

              {/* Dataset Details */}
              <Card className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Dataset Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-text-secondary-dark/60 mb-2">Category</p>
                    <span className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold bg-purple-500/10 text-purple-300 capitalize">
                      {nft.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-dark/60 mb-2">File Type</p>
                    <p className="text-base font-semibold text-white uppercase">{nft.fileType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-dark/60 mb-2">Size</p>
                    <p className="text-base font-semibold text-white">{formatFileSize(nft.fileSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-dark/60 mb-2">Format</p>
                    <p className="text-base font-semibold text-white">{metadata?.fileName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-dark/60 mb-2">Views</p>
                    <p className="text-base font-semibold text-white">{nft.viewCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary-dark/60 mb-2">Downloads</p>
                    <p className="text-base font-semibold text-white">{nft.downloadCount}</p>
                  </div>
                  {metadata?.license && (
                    <div>
                      <p className="text-sm text-text-secondary-dark/60 mb-2">License</p>
                      <p className="text-base font-semibold text-white capitalize">{metadata.license}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-text-secondary-dark/60 mb-2">Verification Hash</p>
                    <p className="text-xs font-mono text-white/60 break-all">
                      {nft.verificationHash.slice(0, 16)}...
                    </p>
                  </div>
                </div>
              </Card>

              {/* Metadata from Walrus */}
              {metadata && (
                <Card className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Additional Information</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-text-secondary-dark/60 mb-2">Uploaded</p>
                      <p className="text-base text-white">
                        {new Date(metadata.uploadedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary-dark/60 mb-2">Version</p>
                      <p className="text-base text-white">{metadata.version}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Seller Information */}
              <Card>
                <h2 className="text-2xl font-bold text-white mb-6">Creator Information</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[28px]">person</span>
                    </div>
                    <div>
                      <p className="font-mono text-base font-semibold text-white">
                        {truncateAddress(nft.creator)}
                      </p>
                      <p className="text-sm text-text-secondary-dark/60">
                        Created {new Date(nft.createdAt * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link href={`/profile/${nft.creator}`}>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Sidebar - Purchase Card */}
            <div className="lg:w-96">
              <Card className="sticky top-24">
                <div className="flex flex-col gap-6">
                  {/* Price or Status */}
                  {isListed && listing ? (
                    <>
                      <div>
                        <p className="text-sm text-text-secondary-dark/60 mb-2">Price</p>
                        <p className="text-5xl font-black text-white">
                          {formatSUI(listing.price)}{' '}
                          <span className="text-2xl text-text-secondary-dark">SUI</span>
                        </p>
                      </div>

                      {isOwner ? (
                        <div className="space-y-3">
                          <Button variant="outline" size="lg" className="w-full" disabled>
                            <span className="material-symbols-outlined text-[18px] mr-2">
                              shopping_bag
                            </span>
                            This is your dataset
                          </Button>
                          <Button variant="ghost" size="md" className="w-full">
                            <span className="material-symbols-outlined text-[18px] mr-2">edit</span>
                            Manage Listing
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="pill"
                            size="lg"
                            className="w-full"
                            onClick={() => setIsPurchaseModalOpen(true)}
                          >
                            <span className="material-symbols-outlined text-[18px] mr-2">
                              shopping_cart
                            </span>
                            Purchase Dataset
                          </Button>

                          <DownloadButton
                            nftId={nftId}
                            dataBlobId={nft.dataBlobId}
                            fileName={metadata?.fileName || `dataset-${nftId}.zip`}
                            fileSize={nft.fileSize}
                            userAddress={currentAccount?.address}
                            variant="outline"
                            size="lg"
                            className="w-full"
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <div>
                      <p className="text-sm text-text-secondary-dark/60 mb-2">Status</p>
                      <div className="glass-card rounded-xl p-4">
                        <p className="text-white font-semibold mb-2">Not Listed</p>
                        <p className="text-sm text-text-secondary-dark">
                          This dataset is not currently for sale.
                        </p>
                      </div>
                      {isOwner && (
                        <Button variant="pill" size="lg" className="w-full mt-4">
                          <span className="material-symbols-outlined text-[18px] mr-2">sell</span>
                          List for Sale
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="border-t border-white/[0.06] pt-6 space-y-4">
                    <div className="flex items-center gap-3 text-text-secondary-dark/80">
                      <span className="material-symbols-outlined text-[20px]">download</span>
                      <span className="text-sm">Instant download after purchase</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary-dark/80">
                      <span className="material-symbols-outlined text-[20px]">verified_user</span>
                      <span className="text-sm">Blockchain verified ownership</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary-dark/80">
                      <span className="material-symbols-outlined text-[20px]">all_inclusive</span>
                      <span className="text-sm">Unlimited downloads</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary-dark/80">
                      <span className="material-symbols-outlined text-[20px]">gavel</span>
                      <span className="text-sm">Commercial use rights</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-white/[0.06] pt-6 flex gap-3">
                    <Button variant="ghost" size="md" className="flex-1">
                      <span className="material-symbols-outlined mr-2 text-[18px]">favorite_border</span>
                      Save
                    </Button>
                    <Button variant="ghost" size="md" className="flex-1">
                      <span className="material-symbols-outlined mr-2 text-[18px]">share</span>
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Purchase Modal */}
      {isListed && listing && (
        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          dataset={{
            nftId,
            title: nft.title,
            price: listing.price,
            seller: nft.creator,
          }}
          listingId={listing.id}
          sellerProfileId={currentProfile?.id || 'mock-profile-buyer'}
          onSuccess={() => {
            // Refresh data after successful purchase
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
