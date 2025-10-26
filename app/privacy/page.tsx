import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Privacy Policy</h1>
          <p className="text-text-secondary-dark/60 text-sm mb-12">
            Last updated: March 15, 2024
          </p>

          <div className="space-y-8">
            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">Introduction</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                Suilex (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our decentralized marketplace.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">Information We Collect</h2>
              <div className="space-y-4 text-text-secondary-dark/80 leading-relaxed">
                <div>
                  <h3 className="text-white font-semibold mb-2">Blockchain Data</h3>
                  <p>We collect public blockchain data including wallet addresses, transaction histories, and smart contract interactions. This data is inherently public on the Sui blockchain.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Profile Information</h3>
                  <p>When you create a trader card, you may provide username, bio, avatar, and social media links. This information is stored on-chain and is publicly accessible.</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Usage Data</h3>
                  <p>We collect information about how you interact with our platform, including pages visited, features used, and timestamps. This helps us improve our services.</p>
                </div>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">How We Use Your Information</h2>
              <ul className="space-y-3 text-text-secondary-dark/80">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                  <span>To provide and maintain our marketplace services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                  <span>To process transactions and verify dataset ownership</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                  <span>To improve and personalize your experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                  <span>To communicate with you about updates and support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                  <span>To ensure compliance with our Terms of Service</span>
                </li>
              </ul>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">Data Storage and Security</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed mb-4">
                Dataset files are stored on Walrus, a decentralized storage network. Metadata and ownership records are stored on the Sui blockchain. We implement industry-standard security measures to protect your information.
              </p>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">Your Rights</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed mb-4">
                You have the right to access, update, or delete your personal information. Since profile data is stored on-chain, some information may be immutable. You can update your trader card profile at any time through your account settings.
              </p>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                For data deletion requests or privacy inquiries, please contact us at privacy@suilex.io
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">Contact Us</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 text-primary font-semibold">
                privacy@suilex.io
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
