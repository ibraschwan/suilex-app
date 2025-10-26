import React from 'react';
import { VerificationLevel } from '@/types';

interface VerificationBadgeProps {
  level: VerificationLevel;
  displayName?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  level,
  displayName,
  size = 'md',
  showLabel = false,
}) => {
  const getBadgeConfig = () => {
    switch (level) {
      case 'official':
        return {
          icon: 'verified',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30',
          label: 'Official Seller',
          tooltip: `${displayName || 'This seller'} is an officially verified organization`,
        };
      case 'verified':
        return {
          icon: 'verified',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30',
          label: 'Verified',
          tooltip: `${displayName || 'This seller'} has been identity verified`,
        };
      default:
        return null;
    }
  };

  const config = getBadgeConfig();
  if (!config) return null;

  const sizeClasses = {
    sm: 'text-[14px] px-2 py-0.5',
    md: 'text-[16px] px-2.5 py-1',
    lg: 'text-[20px] px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'text-[14px]',
    md: 'text-[16px]',
    lg: 'text-[20px]',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bgColor} ${config.borderColor} ${sizeClasses[size]} group relative`}
      title={config.tooltip}
    >
      <span className={`material-symbols-outlined ${config.color} ${iconSizes[size]}`}>
        {config.icon}
      </span>
      {showLabel && (
        <span className={`font-semibold text-xs ${config.color}`}>
          {config.label}
        </span>
      )}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {config.tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90"></div>
      </div>
    </div>
  );
};
