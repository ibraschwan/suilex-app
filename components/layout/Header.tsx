'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { SearchModal } from '../search/SearchModal';
import { MobileMenu } from './MobileMenu';
import { AccountDropdown } from './AccountDropdown';

export const Header: React.FC = () => {
  const account = useCurrentAccount();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap bg-black/60 px-6 py-3 backdrop-blur-2xl border-b border-white/[0.08] sm:px-8 md:px-12 lg:px-16">
        {/* Logo */}
        <Logo size="sm" className="md:hidden opacity-90" />
        <Logo size="md" className="hidden md:block opacity-90" />

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-10 md:flex">
          <Link
            href="/"
            className="text-white text-[13px] font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/marketplace"
            className="text-white/70 text-[13px] font-medium hover:text-white transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/sell"
            className="text-white/70 text-[13px] font-medium hover:text-white transition-colors"
          >
            Create
          </Link>
          <Link
            href="/about"
            className="text-white/70 text-[13px] font-medium hover:text-white transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Open search"
          >
            <span className="material-symbols-outlined text-white text-[20px]">search</span>
          </button>
          <div className="hidden md:flex items-center gap-2">
            <ConnectButton />
            <AccountDropdown />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-white flex items-center justify-center w-9 h-9"
            aria-label="Open mobile menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};
