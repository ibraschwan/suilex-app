/**
 * Mock Datasets with Walrus Blob IDs
 * These are placeholder datasets for development and testing
 */

export interface MockDataset {
  id: string;
  title: string;
  description: string;
  category: 'medical' | 'finance' | 'legal' | 'code' | 'literature';
  fileType: 'csv' | 'json' | 'txt' | 'pdf';
  price: number;
  creator: string;
  verified: boolean;
  blobId: string; // Walrus blob ID (for data)
  metadataBlobId: string; // Walrus blob ID (for metadata)
  fileSize: number; // in bytes
  fileName: string;
  license: string;
  created: number; // timestamp in seconds
  sales: number;
  rating: number;
  ratingCount: number;
  viewCount: number;
  downloadCount: number;
  verificationHash: string;
  version: string;
}

// Generate deterministic blob IDs from titles
const generateBlobId = (title: string): string => {
  return btoa(title).substring(0, 32).replace(/[+/=]/g, 'x');
};

// Generate deterministic verification hash
const generateVerificationHash = (id: string): string => {
  return `0x${btoa(id).split('').map(c => c.charCodeAt(0).toString(16)).join('').substring(0, 64)}`;
};

export const mockDatasets: MockDataset[] = [
  {
    id: 'mock-dataset-1',
    title: 'Medical Imaging Dataset for Cancer Detection',
    description: 'Comprehensive collection of 10,000+ annotated CT scans and X-rays for training AI models to detect various types of cancer. Includes labels for malignant and benign tumors across multiple organ systems.',
    category: 'medical',
    fileType: 'csv',
    price: 850,
    creator: '0x742d35Cc6634C0532925a3b8D5F1A3...abc123',
    verified: true,
    blobId: generateBlobId('Medical Imaging Dataset for Cancer Detection'),
    metadataBlobId: generateBlobId('Medical Imaging Dataset for Cancer Detection - metadata'),
    fileSize: 2457600000, // ~2.4GB
    fileName: 'cancer_detection_dataset.csv',
    license: 'Research Only',
    created: Math.floor((Date.now() - 45 * 24 * 60 * 60 * 1000) / 1000), // 45 days ago in seconds
    sales: 127,
    rating: 4.8,
    ratingCount: 89,
    viewCount: 1843,
    downloadCount: 127,
    verificationHash: generateVerificationHash('mock-dataset-1'),
    version: '1.0.0',
  },
  {
    id: 'mock-dataset-2',
    title: 'Financial Market Time Series 2020-2024',
    description: 'High-frequency trading data covering major stock exchanges including NASDAQ, NYSE, and LSE. Contains tick-by-tick price data, order book snapshots, and volume metrics for 500+ stocks.',
    category: 'finance',
    fileType: 'json',
    price: 1200,
    creator: '0x8f92a1D4f8e2C9b3A6d5E3F1234...def456',
    verified: true,
    blobId: generateBlobId('Financial Market Time Series 2020-2024'),
    metadataBlobId: generateBlobId('Financial Market Time Series 2020-2024 - metadata'),
    fileSize: 5368709120, // ~5GB
    fileName: 'market_data_2020_2024.json',
    license: 'Commercial Use Allowed',
    created: Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000),
    sales: 203,
    rating: 4.9,
    ratingCount: 156,
    viewCount: 2491,
    downloadCount: 203,
    verificationHash: generateVerificationHash('mock-dataset-2'),
    version: '2.1.0',
  },
  {
    id: 'mock-dataset-3',
    title: 'Legal Case Documents - US Supreme Court',
    description: 'Complete archive of US Supreme Court case documents from 1900-2023. Includes case briefs, oral arguments, and judicial opinions. Perfect for legal AI and NLP research.',
    category: 'legal',
    fileType: 'txt',
    price: 450,
    creator: '0x1234567890abcdef1234567890...ghi789',
    verified: true,
    blobId: generateBlobId('Legal Case Documents - US Supreme Court'),
    metadataBlobId: generateBlobId('Legal Case Documents - US Supreme Court - metadata'),
    fileSize: 1258291200, // ~1.2GB
    fileName: 'supreme_court_cases.txt',
    license: 'Attribution Required',
    created: Math.floor((Date.now() - 60 * 24 * 60 * 60 * 1000) / 1000),
    sales: 78,
    rating: 4.6,
    ratingCount: 52,
    viewCount: 934,
    downloadCount: 78,
    verificationHash: generateVerificationHash('mock-dataset-3'),
    version: '1.0.0',
  },
  {
    id: 'mock-dataset-4',
    title: 'GitHub Code Repository - Python ML Projects',
    description: '50,000+ Python machine learning projects scraped from GitHub. Includes complete repositories with code, documentation, and metadata. Great for training code generation models.',
    category: 'code',
    fileType: 'json',
    price: 680,
    creator: '0xabcdef1234567890abcdef1234...jkl012',
    verified: true,
    blobId: generateBlobId('GitHub Code Repository - Python ML Projects'),
    metadataBlobId: generateBlobId('GitHub Code Repository - Python ML Projects - metadata'),
    fileSize: 3221225472, // ~3GB
    fileName: 'python_ml_repos.json',
    license: 'MIT License',
    created: Math.floor((Date.now() - 20 * 24 * 60 * 60 * 1000) / 1000),
    sales: 345,
    rating: 4.7,
    ratingCount: 234,
    viewCount: 4127,
    downloadCount: 345,
    verificationHash: generateVerificationHash('mock-dataset-4'),
    version: '1.2.0',
  },
  {
    id: 'mock-dataset-5',
    title: 'Classic Literature Collection',
    description: 'Comprehensive collection of 5,000+ public domain books from Project Gutenberg. Includes works from Shakespeare, Dickens, Austen, and more. Perfect for language model training.',
    category: 'literature',
    fileType: 'txt',
    price: 120,
    creator: '0x9876543210fedcba9876543210...mno345',
    verified: false,
    blobId: generateBlobId('Classic Literature Collection'),
    metadataBlobId: generateBlobId('Classic Literature Collection - metadata'),
    fileSize: 524288000, // ~500MB
    fileName: 'classic_literature.txt',
    license: 'Public Domain',
    created: Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000),
    sales: 421,
    rating: 4.5,
    ratingCount: 312,
    viewCount: 5234,
    downloadCount: 421,
    verificationHash: generateVerificationHash('mock-dataset-5'),
    version: '1.0.0',
  },
  {
    id: 'mock-dataset-6',
    title: 'Clinical Trial Results Database',
    description: 'Anonymized data from 10,000+ clinical trials across various medical conditions. Includes patient demographics, treatment protocols, outcomes, and adverse events. HIPAA compliant.',
    category: 'medical',
    fileType: 'csv',
    price: 1500,
    creator: '0x456789abcdef0123456789abcd...pqr678',
    verified: true,
    blobId: generateBlobId('Clinical Trial Results Database'),
    metadataBlobId: generateBlobId('Clinical Trial Results Database - metadata'),
    fileSize: 4194304000, // ~4GB
    fileName: 'clinical_trials.csv',
    license: 'Research Only',
    created: Math.floor((Date.now() - 15 * 24 * 60 * 60 * 1000) / 1000),
    sales: 89,
    rating: 4.9,
    ratingCount: 67,
    viewCount: 1156,
    downloadCount: 89,
    verificationHash: generateVerificationHash('mock-dataset-6'),
    version: '1.1.0',
  },
  {
    id: 'mock-dataset-7',
    title: 'Cryptocurrency Transaction History',
    description: 'Complete blockchain transaction history for Bitcoin, Ethereum, and Solana from 2020-2024. Includes wallet addresses, transaction amounts, gas fees, and timestamps.',
    category: 'finance',
    fileType: 'json',
    price: 950,
    creator: '0xfedcba9876543210fedcba9876...stu901',
    verified: true,
    blobId: generateBlobId('Cryptocurrency Transaction History'),
    metadataBlobId: generateBlobId('Cryptocurrency Transaction History - metadata'),
    fileSize: 6442450944, // ~6GB
    fileName: 'crypto_transactions.json',
    license: 'Commercial Use Allowed',
    created: Math.floor((Date.now() - 10 * 24 * 60 * 60 * 1000) / 1000),
    sales: 156,
    rating: 4.7,
    ratingCount: 98,
    viewCount: 1892,
    downloadCount: 156,
    verificationHash: generateVerificationHash('mock-dataset-7'),
    version: '3.0.1',
  },
  {
    id: 'mock-dataset-8',
    title: 'Contract Law Templates & Precedents',
    description: 'Over 1,000 contract templates and legal precedents covering employment, real estate, IP, and corporate law. Sourced from public court filings and legal databases.',
    category: 'legal',
    fileType: 'txt',
    price: 380,
    creator: '0x13579bdf2468ace13579bdf24...vwx234',
    verified: false,
    blobId: generateBlobId('Contract Law Templates & Precedents'),
    metadataBlobId: generateBlobId('Contract Law Templates & Precedents - metadata'),
    fileSize: 157286400, // ~150MB
    fileName: 'contract_templates.txt',
    license: 'Attribution Required',
    created: Math.floor((Date.now() - 50 * 24 * 60 * 60 * 1000) / 1000),
    sales: 234,
    rating: 4.4,
    ratingCount: 167,
    viewCount: 2876,
    downloadCount: 234,
    verificationHash: generateVerificationHash('mock-dataset-8'),
    version: '1.0.0',
  },
  {
    id: 'mock-dataset-9',
    title: 'Stack Overflow Q&A Archive',
    description: 'Complete archive of Stack Overflow questions and answers from 2008-2024. Includes code snippets, tags, voting scores, and accepted answers. 50M+ Q&A pairs.',
    category: 'code',
    fileType: 'json',
    price: 800,
    creator: '0x2468ace13579bdf2468ace135...yza567',
    verified: true,
    blobId: generateBlobId('Stack Overflow Q&A Archive'),
    metadataBlobId: generateBlobId('Stack Overflow Q&A Archive - metadata'),
    fileSize: 10737418240, // ~10GB
    fileName: 'stackoverflow_archive.json',
    license: 'CC BY-SA 4.0',
    created: Math.floor((Date.now() - 5 * 24 * 60 * 60 * 1000) / 1000),
    sales: 567,
    rating: 4.9,
    ratingCount: 423,
    viewCount: 6834,
    downloadCount: 567,
    verificationHash: generateVerificationHash('mock-dataset-9'),
    version: '2024.1',
  },
  {
    id: 'mock-dataset-10',
    title: 'Contemporary Poetry & Prose Collection',
    description: 'Curated collection of modern poetry and short stories from emerging writers (2010-2024). Includes diverse voices across cultures, genres, and styles. 10,000+ works.',
    category: 'literature',
    fileType: 'txt',
    price: 250,
    creator: '0xace13579bdf2468ace13579bd...bcd890',
    verified: false,
    blobId: generateBlobId('Contemporary Poetry & Prose Collection'),
    metadataBlobId: generateBlobId('Contemporary Poetry & Prose Collection - metadata'),
    fileSize: 314572800, // ~300MB
    fileName: 'contemporary_literature.txt',
    license: 'Creative Commons',
    created: Math.floor((Date.now() - 35 * 24 * 60 * 60 * 1000) / 1000),
    sales: 145,
    rating: 4.3,
    ratingCount: 89,
    viewCount: 1756,
    downloadCount: 145,
    verificationHash: generateVerificationHash('mock-dataset-10'),
    version: '1.0.0',
  },
  {
    id: 'mock-dataset-11',
    title: 'Genomic Sequences - Human Genome Variants',
    description: 'Annotated human genomic sequences with known variants associated with diseases. Includes SNPs, indels, and structural variants. 100,000+ sequences with clinical annotations.',
    category: 'medical',
    fileType: 'csv',
    price: 2000,
    creator: '0xbdf2468ace13579bdf2468ace...efg123',
    verified: true,
    blobId: generateBlobId('Genomic Sequences - Human Genome Variants'),
    metadataBlobId: generateBlobId('Genomic Sequences - Human Genome Variants - metadata'),
    fileSize: 8589934592, // ~8GB
    fileName: 'genomic_variants.csv',
    license: 'Research Only',
    created: Math.floor((Date.now() - 25 * 24 * 60 * 60 * 1000) / 1000),
    sales: 45,
    rating: 5.0,
    ratingCount: 34,
    viewCount: 567,
    downloadCount: 45,
    verificationHash: generateVerificationHash('mock-dataset-11'),
    version: '1.3.2',
  },
  {
    id: 'mock-dataset-12',
    title: 'Real Estate Transaction Records',
    description: 'Property sales data from major US cities (2015-2024). Includes sale prices, property details, location data, and market trends. 5M+ transactions.',
    category: 'finance',
    fileType: 'csv',
    price: 720,
    creator: '0x68ace13579bdf2468ace13579...hij456',
    verified: true,
    blobId: generateBlobId('Real Estate Transaction Records'),
    metadataBlobId: generateBlobId('Real Estate Transaction Records - metadata'),
    fileSize: 2147483648, // ~2GB
    fileName: 'real_estate_sales.csv',
    license: 'Commercial Use Allowed',
    created: Math.floor((Date.now() - 12 * 24 * 60 * 60 * 1000) / 1000),
    sales: 178,
    rating: 4.6,
    ratingCount: 123,
    viewCount: 2134,
    downloadCount: 178,
    verificationHash: generateVerificationHash('mock-dataset-12'),
    version: '9.0.0',
  },
];

// Helper function to get datasets by category
export const getDatasetsByCategory = (category: string): MockDataset[] => {
  return mockDatasets.filter(d => d.category === category);
};

// Helper function to get verified datasets
export const getVerifiedDatasets = (): MockDataset[] => {
  return mockDatasets.filter(d => d.verified);
};

// Helper function to get featured datasets (top rated)
export const getFeaturedDatasets = (limit: number = 6): MockDataset[] => {
  return [...mockDatasets]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

// Helper function to search datasets
export const searchDatasets = (query: string): MockDataset[] => {
  const lowerQuery = query.toLowerCase();
  return mockDatasets.filter(d =>
    d.title.toLowerCase().includes(lowerQuery) ||
    d.description.toLowerCase().includes(lowerQuery) ||
    d.category.toLowerCase().includes(lowerQuery)
  );
};

// Helper function to get a single dataset by ID
export const getDatasetById = (id: string): MockDataset | undefined => {
  return mockDatasets.find(d => d.id === id);
};
