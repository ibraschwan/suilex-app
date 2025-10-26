/**
 * Mock Data Module
 * Provides realistic placeholder data for development and testing
 */

export * from './datasets';
export * from './sample-files';
export * from './profiles';

// Re-export commonly used items
import { mockDatasets, getFeaturedDatasets, searchDatasets, getDatasetsByCategory, getVerifiedDatasets } from './datasets';
import { initializeMockFiles } from './sample-files';
import { mockProfiles, getProfileByUsername, getProfileByAddress, isUsernameTaken } from './profiles';

export {
  mockDatasets,
  getFeaturedDatasets,
  searchDatasets,
  getDatasetsByCategory,
  getVerifiedDatasets,
  initializeMockFiles,
  mockProfiles,
  getProfileByUsername,
  getProfileByAddress,
  isUsernameTaken,
};

// Auto-initialize on import (client-side only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Check if already initialized
  const isInitialized = localStorage.getItem('mock_data_initialized');

  if (!isInitialized) {
    console.log('🎭 Initializing mock data for development...');
    setTimeout(() => {
      initializeMockFiles();
      localStorage.setItem('mock_data_initialized', 'true');
    }, 1000); // Delay to avoid blocking initial load
  }
}
