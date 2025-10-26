import { useCurrentAccount, useAccounts } from '@mysten/dapp-kit';
import { truncateAddress } from '@/lib/sui/client';

/**
 * Hook for wallet utilities
 */
export function useWallet() {
  const currentAccount = useCurrentAccount();
  const accounts = useAccounts();

  const isConnected = !!currentAccount;
  const address = currentAccount?.address;
  const displayAddress = address ? truncateAddress(address) : '';

  return {
    isConnected,
    address,
    displayAddress,
    account: currentAccount,
    accounts,
    hasMultipleAccounts: accounts.length > 1,
  };
}

/**
 * Hook to check if user is viewing their own content
 */
export function useIsOwner(ownerAddress?: string) {
  const currentAccount = useCurrentAccount();

  if (!currentAccount || !ownerAddress) {
    return false;
  }

  return currentAccount.address === ownerAddress;
}
