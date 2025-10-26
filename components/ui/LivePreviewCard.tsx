import React from 'react';
import { Badge } from './Badge';

interface LivePreviewCardProps {
  title: string;
  description: string;
  category: string;
  fileType: string;
  price: string;
  file: File | null;
  source: 'manual' | 'kaggle' | 'huggingface';
}

export const LivePreviewCard: React.FC<LivePreviewCardProps> = ({
  title,
  description,
  category,
  fileType,
  price,
  file,
  source,
}) => {
  const getCategoryInfo = (cat: string) => {
    const categoryMap: Record<string, { icon: string; class: string; label: string }> = {
      medical: { icon: 'biotech', class: 'badge-medical', label: 'Medical' },
      finance: { icon: 'payments', class: 'badge-finance', label: 'Finance' },
      code: { icon: 'code', class: 'badge-code', label: 'Code' },
      legal: { icon: 'gavel', class: 'badge-legal', label: 'Legal' },
      literature: { icon: 'menu_book', class: 'badge-literature', label: 'Literature' },
    };
    return categoryMap[cat] || { icon: 'dataset', class: 'badge-code', label: cat };
  };

  const categoryInfo = getCategoryInfo(category);
  const hasContent = title || description || price;

  return (
    <div className="sticky top-24">
      <div className="mb-4">
        <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">visibility</span>
          Live Preview
        </h3>
        <p className="text-text-secondary-dark/60 text-xs">
          This is how your listing will appear in the marketplace
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-white/[0.08] glass-card-hover flex flex-col gap-6">
        {!hasContent ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <span className="material-symbols-outlined text-white/10 text-7xl mb-4">
              preview
            </span>
            <p className="text-white/30 text-lg font-semibold">Your Dataset Preview</p>
            <p className="text-white/20 text-sm mt-2">
              Fill in the form to see a live preview
            </p>
          </div>
        ) : (
          <>
            {/* Category Badge */}
            <div className="mb-2">
              <span className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold ${categoryInfo.class}`}>
                <span className="material-symbols-outlined text-[18px]">{categoryInfo.icon}</span>
                {categoryInfo.label}
              </span>
            </div>

            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-xl font-bold leading-tight mb-3 line-clamp-2 break-words">
                {title || (
                  <span className="text-white/20 italic">Your dataset title...</span>
                )}
              </h3>
              <p className="text-text-secondary-dark/80 text-sm leading-relaxed line-clamp-3 mb-4 break-words">
                {description || (
                  <span className="text-white/20 italic">Your dataset description will appear here...</span>
                )}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-y border-white/[0.06]">
              <div>
                <p className="text-text-secondary-dark/50 text-xs mb-1.5">Format</p>
                <p className="text-white font-semibold text-sm uppercase">
                  {fileType || '-'}
                </p>
              </div>
              <div>
                <p className="text-text-secondary-dark/50 text-xs mb-1.5">Size</p>
                <p className="text-white font-semibold text-sm">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '-'}
                </p>
              </div>
            </div>

            {/* Source Badge */}
            {source !== 'manual' && (
              <div className="text-xs font-medium text-white/40 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">link</span>
                Imported from {source === 'kaggle' ? 'Kaggle' : 'HuggingFace'}
              </div>
            )}

            {/* Price */}
            <div className="pt-2">
              <p className="text-text-secondary-dark/50 text-xs mb-2">Price</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black text-white">
                  {price || '0'}
                </span>
                <span className="text-base font-semibold text-primary">SUI</span>
              </div>

              {/* CTA Button */}
              <div className="w-full px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold text-center">
                View Details
              </div>
            </div>

            {/* Preview Note */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
              <p className="text-primary text-[11px] leading-tight font-medium flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[14px] flex-shrink-0 mt-0.5">info</span>
                <span>Preview only. Published after minting.</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};