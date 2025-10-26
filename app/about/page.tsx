import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">About Suilex</h1>
          <p className="text-xl text-text-secondary-dark/80 mb-12 leading-relaxed">
            The world's first decentralized AI data marketplace on the Sui blockchain
          </p>

          <div className="space-y-12">
            <section className="glass-card rounded-3xl p-8 md:p-12 border border-white/10">
              <h2 className="text-3xl font-black text-white mb-4">Our Mission</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed mb-4">
                Suilex is revolutionizing how data is bought, sold, and shared in the AI era. We empower data creators to monetize their datasets while providing AI researchers and companies with access to high-quality, verified data.
              </p>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                Built on the Sui blockchain, we ensure true ownership, transparent transactions, and AI-powered verification for every dataset.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 md:p-12 border border-white/10">
              <h2 className="text-3xl font-black text-white mb-6">How It Works</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-4xl mb-3 block">upload</span>
                  <h3 className="text-xl font-bold text-white mb-2">1. Upload</h3>
                  <p className="text-text-secondary-dark/70 text-sm">Upload your dataset securely to decentralized storage</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-4xl mb-3 block">verified</span>
                  <h3 className="text-xl font-bold text-white mb-2">2. Verify</h3>
                  <p className="text-text-secondary-dark/70 text-sm">AI-powered verification ensures quality and authenticity</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-4xl mb-3 block">storefront</span>
                  <h3 className="text-xl font-bold text-white mb-2">3. List</h3>
                  <p className="text-text-secondary-dark/70 text-sm">Mint as DataNFT and list on the marketplace</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-4xl mb-3 block">payments</span>
                  <h3 className="text-xl font-bold text-white mb-2">4. Earn</h3>
                  <p className="text-text-secondary-dark/70 text-sm">Receive instant SUI payments for every sale</p>
                </div>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-8 md:p-12 border border-white/10">
              <h2 className="text-3xl font-black text-white mb-6">Why Sui Blockchain?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-success text-2xl mt-0.5">check_circle</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Lightning Fast</h4>
                    <p className="text-text-secondary-dark/70 text-sm">Sub-second transaction finality</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-success text-2xl mt-0.5">check_circle</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Low Cost</h4>
                    <p className="text-text-secondary-dark/70 text-sm">Minimal transaction fees</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-success text-2xl mt-0.5">check_circle</span>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Scalable</h4>
                    <p className="text-text-secondary-dark/70 text-sm">Built to handle millions of datasets</p>
                  </div>
                </li>
              </ul>
            </section>

            <div className="text-center py-8">
              <h2 className="text-3xl font-black text-white mb-6">Ready to get started?</h2>
              <div className="flex gap-4 justify-center">
                <Link href="/sell">
                  <Button variant="pill" size="lg">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    Sell Your Data
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="outline" size="lg">
                    <span className="material-symbols-outlined text-[18px]">explore</span>
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
