'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Logo } from '../ui/Logo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const account = useCurrentAccount();

  if (!isOpen) return null;

  const menuItems = [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Explore Marketplace', href: '/marketplace', icon: 'explore' },
    { label: 'Sell Data', href: '/sell', icon: 'sell' },
    { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { label: 'About', href: '/about', icon: 'info' },
  ];

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-lg animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-in Menu */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#0a0a0a] border-l border-white/10 shadow-2xl animate-slide-in-right flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Logo size="sm" clickable={false} />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-white text-[24px]">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <span className="material-symbols-outlined text-primary text-[24px] group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-white text-base font-medium group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-white/10" />

          {/* Additional Links */}
          <div className="space-y-2">
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-white/70 hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <Link
              href="/docs"
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-white/70 hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">description</span>
              <span className="text-sm font-medium">Documentation</span>
            </Link>
            <Link
              href="/support"
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-white/70 hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
              <span className="text-sm font-medium">Support</span>
            </Link>
          </div>
        </nav>

        {/* Footer - Wallet Connect */}
        <div className="p-6 border-t border-white/10 bg-black/40">
          <div className="mb-4">
            <p className="text-text-secondary-dark/60 text-xs mb-2">
              {account ? 'Connected Wallet' : 'Connect Your Wallet'}
            </p>
            <ConnectButton />
          </div>

          {account && (
            <div className="flex items-center gap-2 text-xs text-text-secondary-dark/60">
              <span className="material-symbols-outlined text-[16px] text-success">
                check_circle
              </span>
              <span>
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};