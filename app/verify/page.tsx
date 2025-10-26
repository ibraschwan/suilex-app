'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function VerifyPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 pt-[60px] px-4 py-12 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Seller Verification
          </h1>
          <p className="text-text-secondary-dark/80 text-lg mb-12">
            Get verified to increase trust and boost your sales
          </p>

          {/* Benefits */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Why Get Verified?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Trust Badge</h3>
                  <p className="text-text-secondary-dark/70 text-sm">
                    Display verification badge on your profile and listings
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">trending_up</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Higher Visibility</h3>
                  <p className="text-text-secondary-dark/70 text-sm">
                    Verified sellers appear higher in search results
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">sell</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Increased Sales</h3>
                  <p className="text-text-secondary-dark/70 text-sm">
                    Buyers prefer verified sellers - boost conversion rates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">workspace_premium</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">Official Status</h3>
                  <p className="text-text-secondary-dark/70 text-sm">
                    Organizations can apply for premium official status
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Verification Levels */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Verification Levels</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Verified Seller</h3>
                  <p className="text-text-secondary-dark/70 text-sm mb-3">
                    For individual sellers. Requires email verification and optional identity confirmation.
                  </p>
                  <ul className="text-text-secondary-dark/60 text-sm space-y-1">
                    <li>• Blue verification badge</li>
                    <li>• Email confirmation required</li>
                    <li>• Free verification</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-warning/5 border border-warning/20">
                <span className="material-symbols-outlined text-warning text-3xl">workspace_premium</span>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">Official/Premium Seller</h3>
                  <p className="text-text-secondary-dark/70 text-sm mb-3">
                    For organizations and companies. Requires business verification.
                  </p>
                  <ul className="text-text-secondary-dark/60 text-sm space-y-1">
                    <li>• Gold official badge</li>
                    <li>• Business document verification</li>
                    <li>• Featured in marketplace</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Application Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Apply for Verification</h2>

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Verification Type</label>
                  <select className="w-full rounded-xl glass-card border border-white/10 px-4 py-3 text-white">
                    <option>Verified Seller (Individual)</option>
                    <option>Official Seller (Organization)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full rounded-xl glass-card border border-white/10 px-4 py-3 text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Display Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Your name or company name"
                    className="w-full rounded-xl glass-card border border-white/10 px-4 py-3 text-white placeholder:text-white/30"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="pill" size="lg" onClick={() => setStep(2)}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-success text-6xl mb-4 block">
                  check_circle
                </span>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Application Submitted!
                </h3>
                <p className="text-text-secondary-dark/80 mb-6">
                  We've sent a verification email. Please check your inbox and click the confirmation link.
                </p>
                <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                  Submit Another Application
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
