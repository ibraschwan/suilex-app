'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { truncateAddress } from '@/lib/sui/client';

export function AccountDropdown() {
  const account = useCurrentAccount();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  if (!account) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 transition-colors"
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-white text-[22px]">
          account_circle
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-surface-dark border border-white/10 shadow-2xl shadow-black/40 overflow-hidden animate-fade-in-up z-50">
          {/* Wallet Info */}
          <div className="p-4 border-b border-white/10 bg-white/5">
            <p className="text-xs text-text-secondary-dark/60 mb-1">Connected Wallet</p>
            <p className="text-white font-mono text-sm font-semibold">
              {truncateAddress(account.address)}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">
                dashboard
              </span>
              <span className="text-sm font-medium">Account Dashboard</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-white/70">
                settings
              </span>
              <span className="text-sm font-medium">Settings</span>
            </Link>

            <div className="border-t border-white/10 my-2" />

            <button
              onClick={() => {
                // Note: Disconnect is handled by the ConnectButton component
                // This is just a visual element
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                logout
              </span>
              <span className="text-sm font-medium">Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
