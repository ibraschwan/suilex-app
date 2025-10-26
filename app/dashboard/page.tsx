'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { StatCard } from '@/components/ui/StatCard';
import { DatasetCard } from '@/components/ui/DatasetCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dataset, PurchaseHistoryItem } from '@/types';

const mockOwnedDatasets: Dataset[] = [
  {
    id: '1',
    title: 'E-commerce Transactions',
    description: '1M+ records of customer purchase data',
    price: 250,
    size: '500 MB',
    category: 'Finance',
    fileType: 'CSV',
    seller: '0x4e5f...a6b7',
    verified: true,
  },
  {
    id: '2',
    title: 'Social Media Sentiment',
    description: 'Labeled sentiment analysis dataset',
    price: 300,
    size: '1.2 GB',
    category: 'Marketing',
    fileType: 'JSON',
    seller: '0x8c9d...e0f1',
    verified: true,
  },
];

const recentPurchases: PurchaseHistoryItem[] = [
  {
    id: '1',
    datasetId: '1',
    datasetTitle: 'E-commerce Transactions',
    price: 250,
    purchaseDate: '2024-10-23',
    seller: '0x4e5f...a6b7',
    transactionHash: '0xabc123...',
  },
  {
    id: '2',
    datasetId: '2',
    datasetTitle: 'Social Media Sentiment',
    price: 300,
    purchaseDate: '2024-10-20',
    seller: '0x8c9d...e0f1',
    transactionHash: '0xdef456...',
  },
];

export default function DashboardPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <Header />

      <div className="flex h-full min-h-screen pt-[60px]">
        {/* Sidebar */}
        <DashboardSidebar mode="buyer" />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 p-8 lg:p-12">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
            {/* Header */}
            <header className="flex flex-col gap-3">
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Buyer Dashboard
              </h1>
              <p className="text-text-secondary-dark/80 text-lg">
                Overview of your purchased datasets and activity
              </p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total Spent"
                value="550 SUI"
                subtitle="Across 2 datasets"
              />
              <StatCard
                title="Datasets Owned"
                value="2"
                subtitle="Ready to access"
              />
              <StatCard
                title="Wishlist"
                value="5"
                subtitle="Datasets saved"
              />
            </div>

            {/* Quick Actions */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/marketplace">
                  <Button variant="pill" size="lg" className="w-full flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">explore</span>
                    <span>Explore Marketplace</span>
                  </Button>
                </Link>
                <Link href="/dashboard/creator">
                  <Button variant="ghost" size="lg" className="w-full flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    <span>Become a Creator</span>
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recently Purchased Datasets */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">My Datasets</h2>
                <Link href="/dashboard/datasets">
                  <Button variant="ghost" size="md">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockOwnedDatasets.map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} />
                ))}
              </div>
            </div>

            {/* Recent Purchase History */}
            <div className="flex flex-col gap-8">
              <h2 className="text-3xl font-bold text-white">Recent Purchases</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-white">{purchase.datasetTitle}</p>
                        <p className="text-xs text-text-secondary-dark">
                          {purchase.purchaseDate} • From {purchase.seller}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-white">{purchase.price} SUI</p>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/purchases">
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    View Full History
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
