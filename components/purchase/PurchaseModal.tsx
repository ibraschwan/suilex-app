'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { usePurchaseNFT } from '@/lib/hooks/useMarketplace';
import { useToast } from '../ui/Toast';
import { formatSUI, getExplorerUrl } from '@/lib/sui/client';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: {
    nftId: string;
    title: string;
    price: number; // in MIST
    seller: string;
  };
  listingId: string;
  sellerProfileId: string;
  onSuccess?: () => void;
}

export function PurchaseModal({
  isOpen,
  onClose,
  dataset,
  listingId,
  sellerProfileId,
  onSuccess,
}: PurchaseModalProps) {
  const { addToast } = useToast();
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const purchaseNFT = usePurchaseNFT();

  const [userBalance, setUserBalance] = useState<number>(0);
  const [paymentCoinId, setPaymentCoinId] = useState<string>('');
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  // Calculate costs
  const platformFeePercent = 2.5;
  const platformFee = Math.floor((dataset.price * platformFeePercent) / 100);
  const estimatedGas = 1000000; // ~0.001 SUI
  const totalCost = dataset.price + estimatedGas;

  useEffect(() => {
    if (isOpen && currentAccount) {
      loadUserBalance();
    }
  }, [isOpen, currentAccount]);

  const loadUserBalance = async () => {
    if (!currentAccount) return;

    try {
      setIsLoadingBalance(true);
      const balance = await suiClient.getBalance({
        owner: currentAccount.address,
        coinType: '0x2::sui::SUI',
      });

      setUserBalance(parseInt(balance.totalBalance));

      // Get a coin object for payment
      const coins = await suiClient.getCoins({
        owner: currentAccount.address,
        coinType: '0x2::sui::SUI',
      });

      if (coins.data.length > 0) {
        // Find a coin with enough balance
        const suitableCoin = coins.data.find(
          (coin) => parseInt(coin.balance) >= totalCost
        );
        if (suitableCoin) {
          setPaymentCoinId(suitableCoin.coinObjectId);
        } else {
          // Use first coin (transaction will merge if needed)
          setPaymentCoinId(coins.data[0].coinObjectId);
        }
      }
    } catch (error) {
      console.error('Error loading balance:', error);
      addToast('Failed to load wallet balance', 'error');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const handlePurchase = async () => {
    // MOCK WORKFLOW for development (no wallet required)
    if (!currentAccount && process.env.NODE_ENV === 'development') {
      addToast('Mock Purchase: Simulating transaction...', 'info');

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store mock purchase in localStorage
      const mockPurchases = JSON.parse(localStorage.getItem('mock_purchases') || '[]');
      mockPurchases.push({
        nftId: dataset.nftId,
        title: dataset.title,
        price: dataset.price,
        purchasedAt: Date.now(),
        seller: dataset.seller,
      });
      localStorage.setItem('mock_purchases', JSON.stringify(mockPurchases));

      addToast('✅ Mock purchase successful! You can now download the dataset.', 'success');
      onSuccess?.();
      onClose();
      return;
    }

    if (!currentAccount || !paymentCoinId) {
      addToast('Wallet not connected', 'error');
      return;
    }

    if (userBalance < totalCost) {
      addToast('Insufficient balance', 'error');
      return;
    }

    try {
      const result: any = await purchaseNFT.mutateAsync({
        listingId,
        nftId: dataset.nftId,
        sellerProfileId,
        paymentCoinId,
      });

      addToast('Purchase successful!', 'success');

      // Show explorer link
      const explorerUrl = getExplorerUrl('txblock', result.digest);
      addToast(`View transaction: ${explorerUrl}`, 'info', 10000);

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Purchase error:', error);
      addToast(error.message || 'Failed to purchase dataset', 'error');
    }
  };

  if (!isOpen) return null;

  const hasEnoughBalance = userBalance >= totalCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-4xl p-8 md:p-12">
        <div className="flex items-start justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white">Purchase Dataset</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>
        </div>

        {/* Dataset Info */}
        <div className="glass-card rounded-xl p-5 md:p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-3">{dataset.title}</h3>
          <p className="text-sm text-text-secondary-dark">
            Seller: <span className="font-mono">{dataset.seller}</span>
          </p>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-white">
            <span>Dataset Price</span>
            <span className="font-semibold">{formatSUI(dataset.price)} SUI</span>
          </div>
          <div className="flex justify-between text-text-secondary-dark text-sm">
            <span>Platform Fee ({platformFeePercent}%)</span>
            <span>{formatSUI(platformFee)} SUI</span>
          </div>
          <div className="flex justify-between text-text-secondary-dark text-sm">
            <span>Estimated Gas</span>
            <span>~{formatSUI(estimatedGas)} SUI</span>
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between text-white text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatSUI(totalCost)} SUI</span>
          </div>
        </div>

        {/* User Balance */}
        {currentAccount ? (
          <div className="glass-card rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary-dark">Your Balance</span>
              {isLoadingBalance ? (
                <span className="text-sm text-white">Loading...</span>
              ) : (
                <span className={`text-sm font-semibold ${hasEnoughBalance ? 'text-success' : 'text-red-500'}`}>
                  {formatSUI(userBalance)} SUI
                </span>
              )}
            </div>
            {!isLoadingBalance && !hasEnoughBalance && (
              <p className="text-xs text-red-500 mt-2">
                Insufficient balance. You need {formatSUI(totalCost - userBalance)} more SUI.
              </p>
            )}
          </div>
        ) : process.env.NODE_ENV === 'development' && (
          <div className="glass-card rounded-xl p-4 mb-6 bg-success/10 border border-success/30">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-success text-[20px] flex-shrink-0 mt-0.5">verified</span>
              <div>
                <p className="text-success text-sm font-bold mb-1">Free Mock Purchase</p>
                <p className="text-success/80 text-xs">
                  Testing mode - click below to simulate purchase and download instantly
                </p>
              </div>
            </div>
          </div>
        )}

        {/* What You Get */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-white">What you'll get:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-text-secondary-dark text-sm">
              <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
              <span>Instant access to download</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary-dark text-sm">
              <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
              <span>DataAccessCap NFT (proof of ownership)</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary-dark text-sm">
              <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
              <span>Unlimited downloads</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary-dark text-sm">
              <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
              <span>Commercial use rights</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            disabled={purchaseNFT.isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="pill"
            size="lg"
            onClick={handlePurchase}
            disabled={
              purchaseNFT.isPending ||
              (currentAccount && (isLoadingBalance || !hasEnoughBalance || !paymentCoinId))
            }
            className="flex-1"
          >
            {purchaseNFT.isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                Processing...
              </>
            ) : !currentAccount && process.env.NODE_ENV === 'development' ? (
              <>
                <span className="material-symbols-outlined mr-2">download</span>
                Get Dataset Free
              </>
            ) : (
              <>
                <span className="material-symbols-outlined mr-2">shopping_cart</span>
                Confirm Purchase
              </>
            )}
          </Button>
        </div>

        {purchaseNFT.isPending && (
          <p className="text-center text-sm text-text-secondary-dark mt-4">
            Waiting for wallet confirmation...
          </p>
        )}
      </Card>
    </div>
  );
}
