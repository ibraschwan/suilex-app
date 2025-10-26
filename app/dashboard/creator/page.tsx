'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { StatCard } from '@/components/ui/StatCard';
import { ListingCard } from '@/components/ui/ListingCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Listing, Sale } from '@/types';

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
];

const recentSales: Sale[] = [
  { datasetTitle: 'E-commerce Transactions', amount: 250, timeAgo: '2 days ago' },
  { datasetTitle: 'Social Media Sentiment', amount: 300, timeAgo: '4 days ago' },
  { datasetTitle: 'Customer Churn Data', amount: 150, timeAgo: '1 week ago' },
  { datasetTitle: 'Genomic Sequencing', amount: 2500, timeAgo: '2 weeks ago' },
];

export default function CreatorDashboardPage() {
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
            <header className="flex flex-col gap-3">
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Creator Dashboard
              </h1>
              <p className="text-text-secondary-dark/80 text-lg">
                Manage your listings, track earnings, and grow your data business
              </p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Earnings"
                value="5,200 SUI"
                trend="+12.5% this month"
                trendPositive
              />
              <StatCard
                title="Active Listings"
                value="8"
                subtitle="2 pending review"
              />
              <StatCard
                title="Total Sales"
                value="24"
                subtitle="+2 this week"
              />
              <StatCard
                title="This Month"
                value="1,850 SUI"
                trend="+215 SUI"
                trendPositive
              />
            </div>

            {/* Quick Actions */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/creator/upload">
                  <Button variant="pill" size="lg" className="w-full flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">upload</span>
                    <span>Upload New Dataset</span>
                  </Button>
                </Link>
                <Link href="/dashboard/creator/listings">
                  <Button variant="ghost" size="lg" className="w-full flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">list_alt</span>
                    <span>Manage Listings</span>
                  </Button>
                </Link>
                <Link href="/dashboard/creator/integrations">
                  <Button variant="ghost" size="lg" className="w-full flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">extension</span>
                    <span>Connect Data Sources</span>
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Listings */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Recent Listings</h2>
                <Link href="/dashboard/creator/listings">
                  <Button variant="ghost" size="md">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>

            {/* Earnings Chart & Recent Sales */}
            <div className="flex flex-col gap-8">
              <h2 className="text-3xl font-bold text-white">Earnings Overview</h2>
              <div className="flex flex-col gap-8 glass-card rounded-2xl p-8 lg:flex-row">
                <div className="flex w-full flex-col gap-2 lg:w-2/3">
                  <p className="text-base font-medium leading-normal text-text-secondary-dark">
                    Total SUI Earnings
                  </p>
                  <p className="tracking-light text-[32px] font-bold leading-tight truncate text-text-primary-dark">
                    5,200 SUI
                  </p>
                  <div className="flex gap-2">
                    <p className="text-base font-normal leading-normal text-text-secondary-dark">
                      Last 30 Days
                    </p>
                    <p className="text-base font-medium leading-normal text-success">
                      +1,850 SUI
                    </p>
                  </div>
                  <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                    <svg
                      fill="none"
                      height="100%"
                      preserveAspectRatio="none"
                      viewBox="0 0 475 150"
                      width="100%"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
                        fill="url(#paint0_linear_chart)"
                      />
                      <path
                        d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                        stroke="#3A82F6"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <defs>
                        <linearGradient
                          gradientUnits="userSpaceOnUse"
                          id="paint0_linear_chart"
                          x1="236"
                          x2="236"
                          y1="1"
                          y2="149"
                        >
                          <stop stopColor="#3A82F6" stopOpacity="0.3" />
                          <stop offset="1" stopColor="#3A82F6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Recent Sales List */}
                <div className="w-full lg:w-1/3 lg:border-l lg:pl-8 border-white/[0.06] flex flex-col gap-6">
                  <h3 className="text-lg font-bold text-white">Recent Sales</h3>
                  <ul className="flex flex-col gap-5">
                    {recentSales.map((sale, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-text-primary-dark">
                            {sale.datasetTitle}
                          </p>
                          <p className="text-xs text-text-secondary-dark">{sale.timeAgo}</p>
                        </div>
                        <p className="text-sm font-medium text-success">+{sale.amount} SUI</p>
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard/creator/earnings">
                    <Button variant="ghost" size="sm" className="w-full mt-4">
                      View Detailed Analytics
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
