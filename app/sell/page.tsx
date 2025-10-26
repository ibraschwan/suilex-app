'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function SellPage() {
  const router = useRouter();
  const account = useCurrentAccount();
  const [showWalletWarning, setShowWalletWarning] = useState(false);

  const handleStartSelling = () => {
    if (account) {
      router.push('/upload');
    } else {
      setShowWalletWarning(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Hide warning after 5 seconds
      setTimeout(() => setShowWalletWarning(false), 5000);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      {/* Wallet Warning Banner */}
      {showWalletWarning && (
        <div className="fixed top-[60px] left-0 right-0 z-40 bg-warning/90 backdrop-blur-sm border-b border-warning px-6 py-4 animate-fade-in-up">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-white">
                warning
              </span>
              <p className="text-white font-semibold">
                Please connect your Sui wallet to start selling datasets. Click the "Connect Wallet" button in the top right corner.
              </p>
            </div>
            <button
              onClick={() => setShowWalletWarning(false)}
              className="text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 pt-[60px]">
        {/* Hero Section */}
        <div className="px-4 py-20 sm:px-6 md:px-10 lg:px-20 text-center">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
              Turn Your Data Into <span className="text-primary">Revenue</span>
            </h1>
            <p className="text-text-secondary-dark text-base sm:text-lg md:text-xl mb-8 mx-auto px-4 sm:px-8 md:px-16">
              List your datasets on Suilex and earn SUI when AI companies purchase your data. It's secure, instant, and decentralized.
            </p>
            <div className="flex justify-center">
              <Button variant="pill" size="lg" className="text-lg px-8 py-4" onClick={handleStartSelling}>
                Start Selling Now
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="px-4 py-16 sm:px-6 md:px-10 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
              Why Sell on Suilex?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 card-lift">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 block">
                  flash_on
                </span>
                <h3 className="text-xl font-bold text-white mb-3">Instant Payments</h3>
                <p className="text-text-secondary-dark/80">
                  Receive SUI directly to your wallet the moment someone purchases your dataset. No waiting, no delays.
                </p>
              </Card>

              <Card className="p-8 card-lift">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 block">
                  lock
                </span>
                <h3 className="text-xl font-bold text-white mb-3">Secure & Decentralized</h3>
                <p className="text-text-secondary-dark/80">
                  Your data is stored on IPFS and transactions are secured by the Sui blockchain. No central authority.
                </p>
              </Card>

              <Card className="p-8 card-lift">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 block">
                  verified
                </span>
                <h3 className="text-xl font-bold text-white mb-3">AI Verification</h3>
                <p className="text-text-secondary-dark/80">
                  Get your datasets AI-verified to increase buyer trust and command higher prices.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="px-4 py-16 sm:px-6 md:px-10 lg:px-20 bg-black/20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: 'upload', title: 'Upload', desc: 'Upload your dataset (CSV, JSON, TXT, PDF up to 10GB)' },
                { icon: 'edit', title: 'Add Details', desc: 'Set price, add description, and choose category' },
                { icon: 'verified', title: 'Get Verified', desc: 'Our AI verifies data quality and integrity' },
                { icon: 'paid', title: 'Earn SUI', desc: 'Get paid instantly when buyers purchase' },
              ].map((step, i) => (
                <Card key={i} className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-2xl">{step.icon}</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">{step.title}</h3>
                  <p className="text-text-secondary-dark/70 text-sm">{step.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-4 py-20 sm:px-6 md:px-10 lg:px-20 text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-text-secondary-dark/80 text-base sm:text-lg mb-8 px-4 sm:px-8">
              Join thousands of data sellers on Suilex. Only 2.5% platform fee.
            </p>
            <div className="flex justify-center">
              <Button variant="pill" size="lg" className="text-lg px-8 py-4" onClick={handleStartSelling}>
                Start Selling Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
