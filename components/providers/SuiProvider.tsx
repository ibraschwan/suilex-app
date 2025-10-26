'use client';

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

// Import Sui wallet CSS
import '@mysten/dapp-kit/dist/index.css';

interface SuiProviderProps {
  children: ReactNode;
}

export function SuiProvider({ children }: SuiProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  const networks = {
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
