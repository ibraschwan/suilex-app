import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
  onEditPrice?: () => void;
  onDelist?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onEditPrice,
  onDelist,
}) => {
  return (
    <Card className="flex flex-col gap-5 h-full" hover>
      {listing.imageUrl && (
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
          style={{ backgroundImage: `url(${listing.imageUrl})` }}
        />
      )}
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold text-white">
          {listing.title}
        </p>
        <p className="text-sm text-text-secondary-dark/70">
          {listing.size} • {listing.records}
        </p>
        <p className="text-xl font-black text-primary mt-1">{listing.price} SUI</p>
      </div>
      <div className="mt-auto flex gap-3">
        <Button
          variant="primary"
          size="sm"
          onClick={onEditPrice}
          className="flex-1"
        >
          Edit Price
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelist} className="flex-1">
          Delist
        </Button>
      </div>
    </Card>
  );
};
