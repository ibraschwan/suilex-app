import React from 'react';
import Link from 'next/link';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Dataset } from '@/types';

interface DatasetCardProps {
  dataset: Dataset;
  onClick?: () => void;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset, onClick }) => {
  // Category badge styling with Material icons
  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      Medical: { icon: 'biotech', class: 'badge-medical', label: 'Medical' },
      Finance: { icon: 'payments', class: 'badge-finance', label: 'Finance' },
      Code: { icon: 'code', class: 'badge-code', label: 'Code' },
      Legal: { icon: 'gavel', class: 'badge-legal', label: 'Legal' },
      Literature: { icon: 'menu_book', class: 'badge-literature', label: 'Literature' },
    };
    return categoryMap[category as keyof typeof categoryMap] || { icon: 'dataset', class: 'badge-code', label: category };
  };

  const categoryInfo = getCategoryInfo(dataset.category);

  return (
    <Card hover className="flex flex-col gap-5 h-full min-h-[340px] card-lift relative overflow-hidden group">
      {/* AI Verified Badge - Top Right Corner */}
      {dataset.verified && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="success" icon="verified" className="shrink-0 shadow-lg">
            AI
          </Badge>
        </div>
      )}

      {/* Category Icon Badge - Top Left */}
      <div className="mb-2">
        <span className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold ${categoryInfo.class}`}>
          <span className="material-symbols-outlined text-[18px]">{categoryInfo.icon}</span>
          {categoryInfo.label}
        </span>
      </div>

      {/* Title & Description */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white text-lg font-bold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {dataset.title}
        </h3>
        <p className="text-text-secondary-dark/80 text-sm leading-relaxed line-clamp-2 mb-4">
          {dataset.description}
        </p>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/[0.06]">
        <div>
          <p className="text-text-secondary-dark/50 text-xs mb-1">Format</p>
          <p className="text-white font-semibold text-sm">{dataset.fileType}</p>
        </div>
        <div>
          <p className="text-text-secondary-dark/50 text-xs mb-1">Size</p>
          <p className="text-white font-semibold text-sm">{dataset.size}</p>
        </div>
      </div>

      {/* Seller */}
      <div className="text-xs font-mono text-text-secondary-dark/50">
        Seller: {dataset.seller}
      </div>

      {/* Price and CTA */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-text-secondary-dark/50 text-xs mb-1">Price</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">
              {dataset.price.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-primary">SUI</span>
          </div>
        </div>
        <Link href={`/dataset/${dataset.id}`}>
          <Button
            variant="primary"
            size="md"
            onClick={onClick}
            className="shadow-lg"
          >
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};
