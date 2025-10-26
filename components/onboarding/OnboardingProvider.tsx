'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useHasProfile } from '@/lib/hooks/useProfile';
import { hasRecentlySkipped } from '@/lib/hooks/useOnboarding';
import { OnboardingModal } from './OnboardingModal';

interface OnboardingContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  skip: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const currentAccount = useCurrentAccount();
  const { hasProfile, isLoading } = useHasProfile();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open modal when wallet connects without profile
  useEffect(() => {
    // Don't show if:
    // - Still loading profile data
    // - No wallet connected
    // - User already has profile
    // - User recently skipped onboarding
    if (isLoading) return;
    if (!currentAccount) return;
    if (hasProfile) return;
    if (hasRecentlySkipped()) return;

    // Show onboarding modal
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Small delay for better UX

    return () => clearTimeout(timer);
  }, [currentAccount, hasProfile, isLoading]);

  const value: OnboardingContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    skip: () => setIsOpen(false),
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      <OnboardingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSkip={() => setIsOpen(false)}
      />
    </OnboardingContext.Provider>
  );
}
