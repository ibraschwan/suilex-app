import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

// Singleton SuiClient instance
let suiClient: SuiClient | null = null;

export function getSuiClient(): SuiClient {
  if (!suiClient) {
    const network = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'devnet';
    const rpcUrl = process.env.NEXT_PUBLIC_SUI_RPC_URL || getFullnodeUrl(network);

    suiClient = new SuiClient({ url: rpcUrl });
  }

  return suiClient;
}

// Helper to get current network
export function getCurrentNetwork(): 'testnet' | 'mainnet' | 'devnet' {
  return (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'devnet';
}

// Helper to get explorer URL
export function getExplorerUrl(type: 'txblock' | 'object' | 'address', id: string): string {
  const network = getCurrentNetwork();
  const baseUrl = network === 'mainnet'
    ? 'https://suiexplorer.com'
    : `https://suiexplorer.com/?network=${network}`;

  return `${baseUrl}/${type}/${id}`;
}

// Format SUI amount (MIST to SUI)
export function formatSUI(mist: number | bigint): string {
  const sui = Number(mist) / 1_000_000_000;
  return sui.toFixed(2);
}

// Parse SUI amount (SUI to MIST)
export function parseSUI(sui: number | string): number {
  return Math.floor(Number(sui) * 1_000_000_000);
}

// Truncate address for display
export function truncateAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
