# Mock Data for Suilex

This directory contains mock datasets and sample files for development and testing.

## Contents

### `datasets.ts`
Contains 12 realistic mock datasets across all categories:
- **Medical**: Cancer detection, clinical trials, genomic data
- **Finance**: Market data, crypto transactions, real estate
- **Legal**: Supreme Court cases, contract templates
- **Code**: GitHub repositories, Stack Overflow archive
- **Literature**: Classic books, contemporary poetry

Each dataset includes:
- Unique ID and Walrus blob ID
- Title, description, category
- File type, size, price
- Creator address
- Verification status
- Sales, ratings, and metadata

### `sample-files.ts`
Generators for realistic file content:
- **CSV**: Medical patient data
- **JSON**: Financial market ticks, code repositories
- **TXT**: Legal documents, literature

Also includes `initializeMockFiles()` which stores sample files in localStorage using the Walrus fallback mechanism.

## Usage

### In Components

```typescript
import { mockDatasets, getFeaturedDatasets, searchDatasets } from '@/lib/mock-data';

// Get all datasets
const allDatasets = mockDatasets;

// Get featured (top rated)
const featured = getFeaturedDatasets(6);

// Search
const results = searchDatasets('medical');

// Filter by category
import { getDatasetsByCategory } from '@/lib/mock-data';
const medicalDatasets = getDatasetsByCategory('medical');
```

### Manual Initialization

```typescript
import { initializeMockFiles } from '@/lib/mock-data';

// Call this in useEffect or on button click
initializeMockFiles();
```

### Auto-Initialization

Mock files are automatically initialized on first page load in development mode. Check localStorage for keys like `walrus_fallback_*`.

## Walrus Blob IDs

Each dataset has a deterministic blob ID generated from its title using base64 encoding. These IDs work with the Walrus client's local fallback mechanism.

## Cleanup

To reset mock data:
```javascript
localStorage.removeItem('mock_data_initialized');
// Clear all walrus fallback files
Object.keys(localStorage)
  .filter(key => key.startsWith('walrus_fallback_'))
  .forEach(key => localStorage.removeItem(key));
```

## Sample Sizes

- Medical CSV: ~2.4GB (100 sample rows shown)
- Financial JSON: ~5GB (50 tick samples shown)
- Legal TXT: ~1.2GB (case document excerpt)
- Code JSON: ~3GB (repository structure + code)
- Literature TXT: ~500MB (book excerpt + poetry)

## Notes

- Mock data is only initialized in development mode
- Files are stored as data URLs in localStorage
- Large files may fail to store (localStorage limit ~5-10MB)
- Real blockchain integration should replace these mocks in production
