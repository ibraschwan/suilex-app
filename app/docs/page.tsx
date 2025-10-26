import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

const docSections = [
  {
    title: 'Getting Started',
    icon: 'rocket_launch',
    docs: [
      { title: 'Create Your Wallet', slug: 'create-wallet' },
      { title: 'Connect to Suilex', slug: 'connect' },
      { title: 'Create Your Trader Card', slug: 'trader-card' },
    ],
  },
  {
    title: 'Buying Data',
    icon: 'shopping_cart',
    docs: [
      { title: 'Browse the Marketplace', slug: 'browse' },
      { title: 'Search & Filter Datasets', slug: 'search' },
      { title: 'Purchase a Dataset', slug: 'purchase' },
      { title: 'Download Your Data', slug: 'download' },
    ],
  },
  {
    title: 'Selling Data',
    icon: 'sell',
    docs: [
      { title: 'Upload Your Dataset', slug: 'upload' },
      { title: 'Set Pricing & Metadata', slug: 'pricing' },
      { title: 'AI Verification Process', slug: 'verification' },
      { title: 'Manage Your Listings', slug: 'manage-listings' },
    ],
  },
  {
    title: 'Advanced',
    icon: 'settings',
    docs: [
      { title: 'Understanding DataNFTs', slug: 'datanfts' },
      { title: 'Smart Contracts', slug: 'contracts' },
      { title: 'Walrus Storage', slug: 'walrus' },
      { title: 'API Reference', slug: 'api' },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Documentation</h1>
          <p className="text-xl text-text-secondary-dark/80 mb-12">
            Everything you need to know about using Suilex
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {docSections.map((section, idx) => (
              <div key={idx} className="glass-card rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">{section.icon}</span>
                  <h2 className="text-2xl font-black text-white">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.docs.map((doc, docIdx) => (
                    <li key={docIdx}>
                      <a
                        href={`#${doc.slug}`}
                        className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors group"
                      >
                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                        <span>{doc.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-8 border border-primary/30">
            <div className="flex items-start gap-6">
              <span className="material-symbols-outlined text-primary text-5xl flex-shrink-0">info</span>
              <div>
                <h3 className="text-2xl font-black text-white mb-3">Need more help?</h3>
                <p className="text-text-secondary-dark/80 mb-6">
                  Our documentation is continuously updated. If you can't find what you're looking for, check our FAQ or contact support.
                </p>
                <div className="flex gap-4">
                  <Link href="/faq" className="inline-flex items-center gap-2 px-6 py-3 bg-primary rounded-full text-white font-semibold hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">help</span>
                    View FAQ
                  </Link>
                  <Link href="/support" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white font-semibold hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">support_agent</span>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
