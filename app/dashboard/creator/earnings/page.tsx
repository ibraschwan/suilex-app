'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Sale } from '@/types';

const recentSales: Sale[] = [
  { datasetTitle: 'E-commerce Transactions', amount: 250, timeAgo: '2 days ago' },
  { datasetTitle: 'Social Media Sentiment', amount: 300, timeAgo: '4 days ago' },
  { datasetTitle: 'Customer Churn Data', amount: 150, timeAgo: '1 week ago' },
  { datasetTitle: 'Genomic Sequencing', amount: 2500, timeAgo: '2 weeks ago' },
  { datasetTitle: 'Autonomous Vehicle Logs', amount: 1200, timeAgo: '3 weeks ago' },
  { datasetTitle: 'Financial Market Data', amount: 8500, timeAgo: '1 month ago' },
];

const topDatasets = [
  { title: 'Financial Market Data', sales: 12, revenue: 102000 },
  { title: 'Autonomous Vehicle Logs', sales: 8, revenue: 9600 },
  { title: 'Medical Imaging Dataset', sales: 6, revenue: 4800 },
  { title: 'E-commerce Transactions', sales: 4, revenue: 1000 },
];

export default function CreatorEarningsPage() {
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
                Earnings & Analytics
              </h1>
              <p className="text-text-secondary-dark/80 text-lg">
                Track your revenue, sales, and performance metrics
              </p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Earnings"
                value="5,200 SUI"
                trend="+12.5% from last month"
                trendPositive
              />
              <StatCard
                title="This Month"
                value="1,850 SUI"
                trend="+215 SUI"
                trendPositive
              />
              <StatCard
                title="Total Sales"
                value="24"
                subtitle="Across 8 datasets"
              />
              <StatCard
                title="Avg. Sale Price"
                value="216 SUI"
                trend="+8.3%"
                trendPositive
              />
            </div>

            {/* Earnings Chart */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Revenue Trend</h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-medium text-text-secondary-dark">
                      Last 6 Months
                    </p>
                    <p className="text-4xl font-black text-white mt-1">5,200 SUI</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                      6M
                    </button>
                    <button className="px-4 py-2 rounded-lg glass-card text-white/60 text-sm font-semibold hover:text-white">
                      1Y
                    </button>
                    <button className="px-4 py-2 rounded-lg glass-card text-white/60 text-sm font-semibold hover:text-white">
                      All
                    </button>
                  </div>
                </div>
                <div className="flex min-h-[250px] flex-1 flex-col gap-8 py-4">
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
            </Card>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performing Datasets */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Top Performing Datasets</h2>
                <div className="space-y-4">
                  {topDatasets.map((dataset, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-white">{dataset.title}</p>
                          <p className="text-xs text-text-secondary-dark">{dataset.sales} sales</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-success">{dataset.revenue.toLocaleString()} SUI</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Sales */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Recent Sales</h2>
                <div className="space-y-4">
                  {recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-text-primary-dark">
                          {sale.datasetTitle}
                        </p>
                        <p className="text-xs text-text-secondary-dark">{sale.timeAgo}</p>
                      </div>
                      <p className="text-sm font-medium text-success">+{sale.amount} SUI</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Monthly Breakdown */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Monthly Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary-dark">Month</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary-dark">Sales</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary-dark">Revenue (SUI)</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary-dark">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { month: 'October 2024', sales: 5, revenue: 1850, growth: '+12.5%' },
                      { month: 'September 2024', sales: 4, revenue: 1645, growth: '+8.2%' },
                      { month: 'August 2024', sales: 3, revenue: 1520, growth: '+5.1%' },
                      { month: 'July 2024', sales: 2, revenue: 1447, growth: '+2.3%' },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-white/[0.06] last:border-0">
                        <td className="py-3 px-4 text-sm text-white">{row.month}</td>
                        <td className="py-3 px-4 text-sm text-white text-right">{row.sales}</td>
                        <td className="py-3 px-4 text-sm text-white text-right font-semibold">{row.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-success text-right">{row.growth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
