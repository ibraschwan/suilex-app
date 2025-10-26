import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 md:px-12 lg:px-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2 min-w-[280px] sm:min-w-[400px]">
            <Logo size="md" clickable={false} className="mb-4" />
            <p className="text-text-secondary-dark text-sm leading-relaxed mb-6">
              The decentralized AI data marketplace on Sui. Monetize your data, fuel innovation.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com/suilex"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://discord.gg/suilex"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a
                href="https://github.com/suilex"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
              <a
                href="https://t.me/suilex"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product column */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/marketplace" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  Sell Data
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  Upload Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary-dark text-sm hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary-dark text-xs">
            © {new Date().getFullYear()} Suilex. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-text-secondary-dark text-xs hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-text-secondary-dark text-xs hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-text-secondary-dark text-xs hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
