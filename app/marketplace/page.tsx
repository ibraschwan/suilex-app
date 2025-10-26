'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DatasetCard } from '@/components/ui/DatasetCard';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/components/ui/Toast';
import { useMarketplaceListings } from '@/lib/hooks/useMarketplace';
import { formatFileSize } from '@/lib/utils/upload';
import { formatSUI } from '@/lib/sui/client';
import { Dataset } from '@/types';
import { mockDatasets } from '@/lib/mock-data';

export default function MarketplacePage() {
  const { addToast } = useToast();
  const { data: marketplaceData, isLoading, error } = useMarketplaceListings();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    medical: false,
    finance: false,
    legal: false,
    code: false,
    literature: false,
  });
  const [aiVerifiedOnly, setAiVerifiedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Transform blockchain data to Dataset format OR use mock data in development
  const datasets: Dataset[] = useMemo(() => {
    // Use mock data if no blockchain data is available (development mode)
    if (!marketplaceData || marketplaceData.length === 0) {
      return mockDatasets.map((mock) => ({
        id: mock.id,
        title: mock.title,
        description: mock.description,
        price: mock.price,
        size: `${(mock.fileSize / 1024 / 1024).toFixed(2)} MB`,
        category: mock.category,
        fileType: mock.fileType,
        seller: mock.creator,
        verified: mock.verified,
      }));
    }

    return marketplaceData.map((item) => ({
      id: item.nft.id,
      title: item.nft.title,
      description: item.nft.description,
      price: parseInt(formatSUI(item.listing.price)),
      size: formatFileSize(item.nft.fileSize),
      category: item.nft.category,
      fileType: item.nft.fileType,
      seller: item.nft.creator,
      verified: item.nft.verified,
    }));
  }, [marketplaceData]);

  // Filter datasets based on search and filters
  const filteredDatasets = datasets.filter((dataset) => {
    // Search filter
    const matchesSearch = dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter (if any category is selected)
    const selectedCategories = Object.entries(filters)
      .filter(([_, isSelected]) => isSelected)
      .map(([category]) => category);
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.some(cat => dataset.category.toLowerCase() === cat.toLowerCase());

    // AI verified filter
    const matchesVerified = !aiVerifiedOnly || dataset.verified;

    // Price range filter
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPrice = dataset.price >= minPrice && dataset.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesVerified && matchesPrice;
  });

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev]
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      medical: false,
      finance: false,
      legal: false,
      code: false,
      literature: false,
    });
    setAiVerifiedOnly(false);
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDatasets = filteredDatasets.slice(startIndex, endIndex);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Filter Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-[84px] space-y-6 glass-card rounded-2xl p-8 border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Filters</h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-primary hover:text-primary-hover transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Category Filter */}
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-text-secondary-dark uppercase tracking-wide">Category</label>
                  <div className="space-y-2">
                    {Object.keys(filters).map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters[category as keyof typeof filters]}
                          onChange={() => handleCategoryToggle(category)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          filters[category as keyof typeof filters]
                            ? 'bg-primary border-primary'
                            : 'border-white/20 group-hover:border-white/30'
                        }`}>
                          {filters[category as keyof typeof filters] && (
                            <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                          )}
                        </div>
                        <span className={`capitalize text-sm transition-colors ${
                          filters[category as keyof typeof filters]
                            ? 'text-white font-medium'
                            : 'text-text-secondary-dark group-hover:text-white'
                        }`}>
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Verification Toggle */}
                <div className="space-y-4 border-t border-white/[0.06] pt-6">
                  <label className="text-xs font-semibold text-text-secondary-dark uppercase tracking-wide">Quality</label>
                  <label className="flex items-center justify-between cursor-pointer group py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-success text-[20px]">verified</span>
                      <span className="text-sm text-white font-medium">AI-Verified Only</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiVerifiedOnly}
                      onChange={(e) => setAiVerifiedOnly(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${
                      aiVerifiedOnly ? 'bg-primary' : 'bg-white/10'
                    }`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        aiVerifiedOnly ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                </div>

                {/* Price Range */}
                <div className="space-y-4 border-t border-white/[0.06] pt-6">
                  <label className="text-xs font-semibold text-text-secondary-dark uppercase tracking-wide">Price Range (SUI)</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full h-11 rounded-xl glass-card border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <span className="text-text-secondary-dark text-sm">→</span>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full h-11 rounded-xl glass-card border border-white/10 px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-12 flex flex-wrap justify-between gap-4 items-center">
                <h1 className="text-white text-4xl md:text-5xl font-black">
                  Explore Datasets
                </h1>
              </div>

              {/* Search Bar */}
              <div className="mb-10">
                <div className="glass-card rounded-full flex items-center gap-3 px-6 py-4">
                  <span className="material-symbols-outlined text-white/40">search</span>
                  <input
                    className="flex-1 bg-transparent border-none text-white placeholder:text-white/40 focus:outline-none focus:ring-0 text-base"
                    placeholder="Search datasets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-text-secondary-dark/80 text-sm">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredDatasets.length)} of {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Dataset Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  <LoadingSkeleton variant="card" count={6} />
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-16">
                  <span className="material-symbols-outlined text-white/20 text-7xl mb-4 block">
                    error
                  </span>
                  <p className="text-white/60 text-lg mb-4">Failed to load marketplace</p>
                  <p className="text-text-secondary-dark text-sm mb-6">{error.message}</p>
                  <Button variant="pill" size="md" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredDatasets.length > 0 ? (
                    paginatedDatasets.map((dataset) => (
                      <DatasetCard key={dataset.id} dataset={dataset} />
                    ))
                  ) : datasets.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <span className="material-symbols-outlined text-white/20 text-7xl mb-4 block">
                        inventory_2
                      </span>
                      <p className="text-white/60 text-lg">No datasets listed yet</p>
                      <p className="text-text-secondary-dark text-sm mt-2">Be the first to list a dataset!</p>
                    </div>
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <span className="material-symbols-outlined text-white/20 text-7xl mb-4 block">
                        search_off
                      </span>
                      <p className="text-white/60 text-lg">No datasets found matching your criteria</p>
                      <Button variant="ghost" size="md" className="mt-6" onClick={handleResetFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-3 flex-wrap">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-lg glass-card hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <span className="material-symbols-outlined text-white/60">chevron_left</span>
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                      <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg font-semibold transition ${
                          currentPage === page
                            ? 'bg-primary text-white hover:bg-primary-hover'
                            : 'glass-card text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={index} className="text-white/40 px-2">
                        {page}
                      </span>
                    )
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-lg glass-card hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <span className="material-symbols-outlined text-white/60">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
