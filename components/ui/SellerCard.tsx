import React from 'react';
import Link from 'next/link';
import { SellerProfile } from '@/types';
import { VerificationBadge } from './VerificationBadge';
import { Card } from './Card';

interface SellerCardProps {
  seller: SellerProfile;
  showStats?: boolean;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller, showStats = true }) => {
  const displayName = seller.displayName || `${seller.walletAddress.slice(0, 6)}...${seller.walletAddress.slice(-4)}`;

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {seller.avatar ? (
            <img src={seller.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-primary text-3xl">account_circle</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/seller/${seller.walletAddress}`} className="hover:underline">
              <h3 className="text-white font-bold text-lg truncate">{displayName}</h3>
            </Link>
            {seller.verificationLevel !== 'unverified' && (
              <VerificationBadge level={seller.verificationLevel} displayName={displayName} size="sm" />
            )}
          </div>
          <p className="text-text-secondary-dark/60 text-xs font-mono mb-2">{seller.walletAddress}</p>
          {seller.bio && (
            <p className="text-text-secondary-dark/80 text-sm line-clamp-2">{seller.bio}</p>
          )}
        </div>
      </div>

      {showStats && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
          <div>
            <p className="text-text-secondary-dark/50 text-xs mb-1">Datasets</p>
            <p className="text-white font-bold text-sm">{seller.stats.datasetsListed}</p>
          </div>
          <div>
            <p className="text-text-secondary-dark/50 text-xs mb-1">Sales</p>
            <p className="text-white font-bold text-sm">{seller.stats.totalSales}</p>
          </div>
          <div>
            <p className="text-text-secondary-dark/50 text-xs mb-1">Rating</p>
            <p className="text-white font-bold text-sm flex items-center gap-1">
              {seller.stats.rating.toFixed(1)}
              <span className="material-symbols-outlined text-warning text-[14px]">star</span>
            </p>
          </div>
        </div>
      )}

      {seller.socialLinks && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.06]">
          {seller.socialLinks.twitter && (
            <a
              href={`https://twitter.com/${seller.socialLinks.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary-dark/60 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </a>
          )}
          {seller.socialLinks.github && (
            <a
              href={`https://github.com/${seller.socialLinks.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary-dark/60 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">code</span>
            </a>
          )}
          {seller.socialLinks.website && (
            <a
              href={seller.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary-dark/60 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">language</span>
            </a>
          )}
        </div>
      )}
    </Card>
  );
};
