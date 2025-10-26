'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { ListingCard } from '@/components/ui/ListingCard';
import { Button } from '@/components/ui/Button';
import { Listing } from '@/types';
import Link from 'next/link';

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Customer Churn Prediction Data',
    size: '15.2 GB',
    records: '1M Records',
    price: 150,
  },
  {
    id: '2',
    title: 'Autonomous Vehicle Sensor Logs',
    size: '105 GB',
    records: '500K Files',
    price: 1200,
  },
  {
    id: '3',
    title: 'Medical Imaging Dataset (MRI)',
    size: '45 GB',
    records: '10K Images',
    price: 800,
  },
  {
    id: '4',
    title: 'Financial Market Data',
    size: '780 GB',
    records: '5M Ticks',
    price: 8500,
  },
  {
    id: '5',
    title: 'Social Media Sentiment Dataset',
    size: '1.2 GB',
    records: '500K Posts',
    price: 300,
  },
  {
    id: '6',
    title: 'E-commerce Transaction Logs',
    size: '3.5 GB',
    records: '2M Transactions',
    price: 450,
  },
];

export default function CreatorListingsPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <Header />

      <div className="flex h-full min-h-screen pt-[60px]">
        {/* Sidebar */}
        <DashboardSidebar mode="creator" />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 p-8 lg:p-12">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white">
                  My Listings
                </h1>
                <p className="text-text-secondary-dark/80 text-lg mt-2">
                  Manage all your listed datasets on the marketplace
                </p>
              </div>
              <Link href="/dashboard/creator/upload">
                <Button variant="pill" size="lg" className="flex items-center gap-2 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  <span>Upload New Dataset</span>
                </Button>
              </Link>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card rounded-xl p-6">
                <p className="text-text-secondary-dark text-sm mb-1">Total Listings</p>
                <p className="text-3xl font-black text-white">{mockListings.length}</p>
              </div>
              <div className="glass-card rounded-xl p-6">
                <p className="text-text-secondary-dark text-sm mb-1">Active</p>
                <p className="text-3xl font-black text-success">6</p>
              </div>
              <div className="glass-card rounded-xl p-6">
                <p className="text-text-secondary-dark text-sm mb-1">Pending</p>
                <p className="text-3xl font-black text-warning">0</p>
              </div>
              <div className="glass-card rounded-xl p-6">
                <p className="text-text-secondary-dark text-sm mb-1">Total Value</p>
                <p className="text-3xl font-black text-white">11,400</p>
                <p className="text-xs text-text-secondary-dark">SUI</p>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">All Listings</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <span className="material-symbols-outlined text-[18px] mr-1">filter_list</span>
                    Filter
                  </Button>
                  <Button variant="ghost" size="sm">
                    <span className="material-symbols-outlined text-[18px] mr-1">sort</span>
                    Sort
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
