import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  clickable?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  clickable = true,
  showTagline = false,
  className = '',
}) => {
  const sizes = {
    sm: {
      text: 'text-xl',
      icon: 'text-2xl',
      tagline: 'text-xs',
    },
    md: {
      text: 'text-2xl',
      icon: 'text-3xl',
      tagline: 'text-sm',
    },
    lg: {
      text: 'text-3xl',
      icon: 'text-4xl',
      tagline: 'text-base',
    },
    xl: {
      text: 'text-5xl md:text-6xl',
      icon: 'text-6xl md:text-7xl',
      tagline: 'text-lg md:text-xl',
    },
  };

  const sizeClasses = sizes[size];

  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Text Only - Clean & Minimal */}
      <div className="flex flex-col">
        <span className={`${sizeClasses.text} font-black text-white tracking-tight`}>
          Suil<span className="text-primary">ex</span>
        </span>
        {showTagline && (
          <span className={`${sizeClasses.tagline} text-text-secondary-dark/70 font-medium -mt-1`}>
            Decentralized Data Marketplace
          </span>
        )}
      </div>
    </div>
  );

  if (!clickable) {
    return logoContent;
  }

  return (
    <Link href="/" className="hover:opacity-90 transition-opacity">
      {logoContent}
    </Link>
  );
};
