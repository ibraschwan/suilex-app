'use client';

import { useState } from 'react';
import { Button } from './Button';
import { formatSUI } from '@/lib/sui/client';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dataset: {
    title: string;
    price: number;
    size: string;
    seller: string;
    verified: boolean;
  };
}

export function PurchaseModal({
  isOpen,
  onClose,
  onConfirm,
  dataset,
}: PurchaseModalProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsPurchasing(true);

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsPurchasing(false);
    onConfirm();
  };

  const platformFee = dataset.price * 0.025; // 2.5%
  const total = dataset.price;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">shopping_cart</span>
              </div>
              <div>
                <h2 className="text-white text-2xl font-black">Complete Purchase</h2>
                <p className="text-text-secondary-dark/60 text-sm">Review and confirm your order</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Dataset Info */}
          <div className="glass-card rounded-xl p-5 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">{dataset.title}</h3>
                <p className="text-text-secondary-dark/70 text-sm">
                  Sold by {dataset.seller}
                </p>
              </div>
              {dataset.verified && (
                <div className="flex items-center gap-1 px-2 py-1 bg-success/20 rounded-lg">
                  <span className="material-symbols-outlined text-success text-[16px]">verified</span>
                  <span className="text-success text-xs font-semibold">Verified</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary-dark/60">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">storage</span>
                {dataset.size}
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-white/80">
              <span>Dataset Price</span>
              <span className="font-semibold">{dataset.price.toLocaleString()} SUI</span>
            </div>
            <div className="flex items-center justify-between text-text-secondary-dark/60 text-sm">
              <span>Platform Fee (2.5%)</span>
              <span>{platformFee.toFixed(2)} SUI</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between text-white">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-black text-primary">{total.toLocaleString()} SUI</span>
            </div>
          </div>

          {/* What You Get */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              What you'll receive:
            </h4>
            <ul className="space-y-2 text-text-secondary-dark/80 text-sm">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check</span>
                <span>Instant access to download the dataset</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check</span>
                <span>DataAccessCap NFT proving ownership</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check</span>
                <span>Lifetime access with no recurring fees</span>
              </li>
            </ul>
          </div>

          {/* Warning */}
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
            <p className="text-warning text-xs leading-relaxed">
              <span className="font-semibold">Important:</span> This transaction cannot be reversed.
              Ensure you have reviewed the dataset details carefully before proceeding.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-black/20 border-t border-white/10 flex gap-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            disabled={isPurchasing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="pill"
            size="lg"
            onClick={handleConfirm}
            disabled={isPurchasing}
            className="flex-1"
          >
            {isPurchasing ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                Confirm Purchase
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
