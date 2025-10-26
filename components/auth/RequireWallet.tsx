'use client';

import React, { useEffect } from 'react';
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import { Card } from '../ui/Card';
import { useHasProfile } from '@/lib/hooks/useProfile';
import { useOnboarding } from '../onboarding/OnboardingProvider';
import { hasRecentlySkipped } from '@/lib/hooks/useOnboarding';

interface RequireWalletProps {
  children: React.ReactNode;
  message?: string;
  requireProfile?: boolean; // New prop to also require profile
}

export const RequireWallet: React.FC<RequireWalletProps> = ({
  children,
  message = 'Please connect your Sui wallet to continue',
  requireProfile = false,
}) => {
  const account = useCurrentAccount();
  const { hasProfile, isLoading } = useHasProfile();
  const { open } = useOnboarding();

  // If wallet is connected but no profile, open onboarding modal
  useEffect(() => {
    if (requireProfile && account && !hasProfile && !isLoading && !hasRecentlySkipped()) {
      open();
    }
  }, [requireProfile, account, hasProfile, isLoading, open]);

  // Show connect wallet UI
  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <Card className="p-8 md:p-12 max-w-md w-full text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-6 block">
            account_balance_wallet
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
            Wallet Required
          </h2>
          <p className="text-text-secondary-dark/80 mb-8">
            {message}
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </Card>
      </div>
    );
  }

  // Show profile required UI (if profile requirement is enforced and user skipped)
  if (requireProfile && account && !hasProfile && !isLoading && hasRecentlySkipped()) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <Card className="p-8 md:p-12 max-w-md w-full text-center">
          <span className="material-symbols-outlined text-6xl text-warning mb-6 block">
            badge
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
            Profile Required
          </h2>
          <p className="text-text-secondary-dark/80 mb-8">
            Create your Trader Card to access this feature
          </p>
          <div className="flex justify-center">
            <button
              onClick={open}
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors"
            >
              Create Trader Card
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
