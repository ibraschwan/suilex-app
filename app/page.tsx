import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { DatasetCard } from '@/components/ui/DatasetCard';
import { Logo } from '@/components/ui/Logo';
import { Dataset } from '@/types';
import { getFeaturedDatasets } from '@/lib/mock-data';

const featuredDatasets: Dataset[] = getFeaturedDatasets(6).map(mock => ({
  id: mock.id,
  title: mock.title,
  description: mock.description,
  price: mock.price,
  size: `${(mock.fileSize / 1024 / 1024 / 1024).toFixed(1)} GB`,
  category: mock.category.charAt(0).toUpperCase() + mock.category.slice(1),
  fileType: mock.fileType.toUpperCase(),
  seller: mock.creator.slice(0, 8) + '...' + mock.creator.slice(-4),
  verified: mock.verified,
}));

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 pt-[60px]">
        {/* Hero Section */}
        <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
          {/* Radial gradient background */}
          <div className="absolute inset-0 radial-gradient-hero"></div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 md:px-10 lg:px-20 py-20">
            <div className="flex flex-col gap-12 text-center items-center">
              {/* Logo */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
                <Logo size="xl" clickable={false} showTagline className="opacity-90" />
              </div>

              {/* Main headline */}
              <div className="flex flex-col gap-6 items-center animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-[-0.02em] max-w-5xl">
                  Monetize Your Data.<br />
                  <span className="text-primary">Fuel the AI Revolution.</span>
                </h1>
                <p className="text-text-secondary-dark text-lg md:text-xl font-light leading-relaxed max-w-4xl px-6 sm:px-8">
                  A decentralized marketplace on Sui where you can sell your valuable, verified data directly to AI companies.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                <Link href="/marketplace">
                  <Button variant="pill" size="lg">
                    Explore Datasets
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button variant="ghost" size="lg">
                    Start Creating
                  </Button>
                </Link>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mt-8">
                <div className="glass-card glass-card-hover rounded-xl p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                  <div className="text-4xl font-black text-white mb-2">$2.4M</div>
                  <div className="text-sm text-text-secondary-dark font-medium">Total Volume</div>
                </div>
                <div className="glass-card glass-card-hover rounded-xl p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
                  <div className="text-4xl font-black text-white mb-2">1,247</div>
                  <div className="text-sm text-text-secondary-dark font-medium">Datasets Listed</div>
                </div>
                <div className="glass-card glass-card-hover rounded-xl p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
                  <div className="text-4xl font-black text-white mb-2">98.2%</div>
                  <div className="text-sm text-text-secondary-dark font-medium">AI-Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 lg:px-20 py-24">
          <h2 className="text-white text-4xl md:text-5xl font-black text-center mb-16">
            How Suilex Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: 'upload',
                title: 'Upload',
                number: '01',
                description: 'Securely upload your dataset to our decentralized network.',
              },
              {
                icon: 'verified',
                title: 'Verify',
                number: '02',
                description: 'Our system verifies the integrity and quality of your data.',
              },
              {
                icon: 'token',
                title: 'List',
                number: '03',
                description: 'Mint your dataset as a DataNFT and list it on the marketplace.',
              },
              {
                icon: 'paid',
                title: 'Earn',
                number: '04',
                description: 'Get paid directly when AI companies buy your data.',
              },
            ].map((step, index) => (
              <div
                key={index}
                className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
              >
                {/* Step number background */}
                <div className="absolute top-4 right-4 text-6xl font-black text-white/5">
                  {step.number}
                </div>

                {/* Icon with glow */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center blue-glow-soft">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>
                    {step.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 relative z-10">
                  <h3 className="text-white text-xl font-bold">{step.title}</h3>
                  <p className="text-text-secondary-dark text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Datasets */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10 lg:px-20 py-24 pb-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-white text-4xl md:text-5xl font-black">
              Featured Datasets
            </h2>
            <Link href="/marketplace">
              <Button variant="ghost" size="md">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDatasets.slice(0, 3).map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
