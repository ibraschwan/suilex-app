/**
 * Mock Trader Profiles
 * Sample profiles for development and testing
 */

export interface MockProfile {
  id: string;
  username: string;
  bio: string;
  avatarBlobId: string;
  walletAddress: string;
  createdAt: number;
  stats: {
    datasetsListed: number;
    totalSales: number;
    totalEarnings: number;
  };
}

export const mockProfiles: MockProfile[] = [
  {
    id: 'profile-trespass',
    username: 'Trespass',
    bio: 'Data scientist specializing in medical AI datasets. Building the future of healthcare analytics.',
    avatarBlobId: btoa('trespass-avatar').substring(0, 32).replace(/[+/=]/g, 'x'),
    walletAddress: '0x742d35Cc6634C0532925a3b8D5F1A3...abc123',
    createdAt: Math.floor((Date.now() - 120 * 24 * 60 * 60 * 1000) / 1000), // 120 days ago
    stats: {
      datasetsListed: 3,
      totalSales: 294,
      totalEarnings: 4250,
    },
  },
  {
    id: 'profile-datawizard',
    username: 'DataWizard',
    bio: 'Blockchain enthusiast and data curator. Focused on financial datasets and market analytics.',
    avatarBlobId: btoa('datawizard-avatar').substring(0, 32).replace(/[+/=]/g, 'x'),
    walletAddress: '0x8f92a1D4f8e2C9b3A6d5E3F1234...def456',
    createdAt: Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000),
    stats: {
      datasetsListed: 5,
      totalSales: 562,
      totalEarnings: 8950,
    },
  },
  {
    id: 'profile-legalscribe',
    username: 'LegalScribe',
    bio: 'Legal researcher providing high-quality legal document datasets for NLP and AI training.',
    avatarBlobId: btoa('legalscribe-avatar').substring(0, 32).replace(/[+/=]/g, 'x'),
    walletAddress: '0x1234567890abcdef1234567890...ghi789',
    createdAt: Math.floor((Date.now() - 75 * 24 * 60 * 60 * 1000) / 1000),
    stats: {
      datasetsListed: 2,
      totalSales: 312,
      totalEarnings: 2460,
    },
  },
  {
    id: 'profile-codeninja',
    username: 'CodeNinja',
    bio: 'Open source contributor curating massive code repositories for ML training.',
    avatarBlobId: btoa('codeninja-avatar').substring(0, 32).replace(/[+/=]/g, 'x'),
    walletAddress: '0xabcdef1234567890abcdef1234...jkl012',
    createdAt: Math.floor((Date.now() - 60 * 24 * 60 * 60 * 1000) / 1000),
    stats: {
      datasetsListed: 4,
      totalSales: 1123,
      totalEarnings: 12340,
    },
  },
  {
    id: 'profile-litlover',
    username: 'LitLover',
    bio: 'Literature enthusiast sharing classic and contemporary text collections.',
    avatarBlobId: btoa('litlover-avatar').substring(0, 32).replace(/[+/=]/g, 'x'),
    walletAddress: '0x9876543210fedcba9876543210...mno345',
    createdAt: Math.floor((Date.now() - 100 * 24 * 60 * 60 * 1000) / 1000),
    stats: {
      datasetsListed: 6,
      totalSales: 987,
      totalEarnings: 5640,
    },
  },
];

// Helper to get profile by username
export const getProfileByUsername = (username: string): MockProfile | undefined => {
  return mockProfiles.find(p => p.username.toLowerCase() === username.toLowerCase());
};

// Helper to get profile by wallet address
export const getProfileByAddress = (address: string): MockProfile | undefined => {
  return mockProfiles.find(p => p.walletAddress === address);
};

// Helper to check if username is taken
export const isUsernameTaken = (username: string): boolean => {
  return mockProfiles.some(p => p.username.toLowerCase() === username.toLowerCase());
};
