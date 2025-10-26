'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));

    // Navigate to marketplace with search query
    router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  const popularSearches = [
    'Medical datasets',
    'Financial data',
    'Code repositories',
    'AI training data',
    'Legal documents',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-24 animate-fade-in-up">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-2xl glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search datasets..."
              className="flex-1 bg-transparent text-white text-lg placeholder:text-white/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
            <Button type="submit" variant="pill" size="sm" disabled={!query.trim()}>
              Search
            </Button>
          </div>
        </form>

        {/* Search Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Recent Searches</h3>
                <button
                  onClick={clearRecent}
                  className="text-text-secondary-dark/60 hover:text-white text-xs transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group text-left"
                  >
                    <span className="material-symbols-outlined text-text-secondary-dark/60 group-hover:text-primary text-[20px]">
                      history
                    </span>
                    <span className="text-white/80 group-hover:text-white text-sm">
                      {search}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-6">
            <h3 className="text-white font-semibold text-sm mb-4">Popular Searches</h3>
            <div className="space-y-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group text-left"
                >
                  <span className="material-symbols-outlined text-text-secondary-dark/60 group-hover:text-primary text-[20px]">
                    trending_up
                  </span>
                  <span className="text-white/80 group-hover:text-white text-sm">
                    {search}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-text-secondary-dark/60">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px]">↵</kbd>
              <span>Search</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px]">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}