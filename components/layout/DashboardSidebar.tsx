'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

interface DashboardSidebarProps {
  mode: 'buyer' | 'creator';
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ mode }) => {
  const pathname = usePathname();
  const account = useCurrentAccount();

  const buyerNavItems: NavItem[] = [
    { href: '/dashboard', icon: 'dashboard', label: 'Overview' },
    { href: '/dashboard/datasets', icon: 'folder', label: 'My Datasets' },
    { href: '/dashboard/wishlist', icon: 'favorite', label: 'Wishlist' },
    { href: '/dashboard/purchases', icon: 'receipt_long', label: 'Purchase History' },
  ];

  const creatorNavItems: NavItem[] = [
    { href: '/dashboard/creator', icon: 'dashboard', label: 'Overview' },
    { href: '/dashboard/creator/listings', icon: 'list_alt', label: 'My Listings' },
    { href: '/dashboard/creator/earnings', icon: 'monitoring', label: 'Earnings & Analytics' },
    { href: '/dashboard/creator/upload', icon: 'upload', label: 'Upload Dataset' },
    { href: '/dashboard/creator/integrations', icon: 'extension', label: 'Integrations' },
  ];

  const navItems = mode === 'buyer' ? buyerNavItems : creatorNavItems;
  const switchHref = mode === 'buyer' ? '/dashboard/creator' : '/dashboard';
  const switchLabel = mode === 'buyer' ? 'Switch to Creator Dashboard' : 'Switch to Buyer Dashboard';

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/dashboard/creator') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <aside className="fixed left-0 top-[60px] h-[calc(100vh-60px)] flex w-64 flex-col border-r border-white/[0.06] glass-card p-6 overflow-y-auto">
      <div className="flex flex-col gap-6">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                `url(https://api.dicebear.com/7.x/shapes/svg?seed=${account?.address || 'user123'})`,
            }}
          />
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-mono text-sm font-semibold leading-normal text-white truncate">
              {account?.address ? truncateAddress(account.address) : '0x123...abcd'}
            </h1>
            <p className="text-text-secondary-dark text-xs leading-normal">
              Sui Wallet
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive(item.href)
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <p className="text-sm font-semibold">{item.label}</p>
            </Link>
          ))}
        </nav>

        {/* Switch Dashboard Mode */}
        <div className="border-t border-white/[0.06] pt-4 mt-auto">
          <Link
            href={switchHref}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            <p className="text-sm font-semibold">{switchLabel}</p>
          </Link>
        </div>
      </div>
    </aside>
  );
};
