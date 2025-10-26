'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is Suilex?',
        a: 'Suilex is a decentralized marketplace for AI datasets built on the Sui blockchain. It allows data creators to monetize their datasets as DataNFTs while providing buyers with verified, high-quality data.',
      },
      {
        q: 'How do I get started?',
        a: 'Connect your Sui wallet, browse the marketplace, or upload your first dataset. New users can create a trader card to showcase their profile and start trading immediately.',
      },
      {
        q: 'Do I need a Sui wallet?',
        a: 'Yes, you need a Sui-compatible wallet (like Sui Wallet or Ethos) to buy, sell, or interact with DataNFTs on the marketplace.',
      },
    ],
  },
  {
    category: 'Buying Data',
    questions: [
      {
        q: 'How do I purchase a dataset?',
        a: 'Browse the marketplace, select a dataset, and click "Purchase Access". You will receive a DataAccessCap NFT that grants you download rights.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'All transactions are conducted in SUI, the native token of the Sui blockchain.',
      },
      {
        q: 'Can I resell a dataset I purchased?',
        a: 'You can transfer your DataAccessCap to another wallet, but resale is subject to the original seller\'s terms.',
      },
    ],
  },
  {
    category: 'Selling Data',
    questions: [
      {
        q: 'How do I sell my dataset?',
        a: 'Upload your dataset, set metadata and pricing, then mint it as a DataNFT. It will be listed on the marketplace immediately.',
      },
      {
        q: 'What file types are supported?',
        a: 'We support CSV, JSON, Parquet, TXT, and other common data formats. Files are stored on Walrus decentralized storage.',
      },
      {
        q: 'What is AI verification?',
        a: 'AI verification checks your dataset for quality, completeness, and integrity. Verified datasets receive a green badge and rank higher in search.',
      },
      {
        q: 'How do I set pricing?',
        a: 'You set the price in SUI when creating your listing. You can update pricing later through your dashboard.',
      },
    ],
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'Where is my data stored?',
        a: 'Data files are stored on Walrus, a decentralized storage network. Metadata and ownership are recorded on the Sui blockchain.',
      },
      {
        q: 'Is my data secure?',
        a: 'Yes. Data is encrypted and only accessible to buyers with a valid DataAccessCap. The blockchain ensures immutable ownership records.',
      },
      {
        q: 'What are DataNFTs?',
        a: 'DataNFTs are NFTs representing ownership and access rights to datasets. They can be transferred, sold, or held as assets.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">FAQ</h1>
          <p className="text-xl text-text-secondary-dark/80 mb-12">
            Frequently asked questions about Suilex
          </p>

          <div className="space-y-8">
            {faqs.map((section, sectionIdx) => (
              <div key={sectionIdx} className="glass-card rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-black text-white mb-6">{section.category}</h2>
                <div className="space-y-4">
                  {section.questions.map((faq, faqIdx) => {
                    const key = `${sectionIdx}-${faqIdx}`;
                    const isOpen = openIndex === key;
                    return (
                      <div key={key} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : key)}
                          className="w-full flex items-start justify-between gap-4 text-left py-2 group"
                        >
                          <span className="text-white font-semibold group-hover:text-primary transition-colors">
                            {faq.q}
                          </span>
                          <span className={`material-symbols-outlined text-primary flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </button>
                        {isOpen && (
                          <div className="mt-2 text-text-secondary-dark/80 leading-relaxed animate-fade-in">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 glass-card rounded-3xl p-8 border border-primary/30 text-center">
            <h3 className="text-2xl font-black text-white mb-3">Still have questions?</h3>
            <p className="text-text-secondary-dark/80 mb-6">Our support team is here to help</p>
            <a href="/support" className="inline-flex items-center gap-2 px-6 py-3 bg-primary rounded-full text-white font-semibold hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              Contact Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
