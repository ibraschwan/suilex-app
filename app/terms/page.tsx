import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Terms of Service</h1>
          <p className="text-text-secondary-dark/60 text-sm mb-12">
            Last updated: March 15, 2024
          </p>

          <div className="space-y-8">
            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                By accessing or using Suilex, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">2. Platform Description</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                Suilex is a decentralized marketplace for AI datasets built on the Sui blockchain. We facilitate the creation, buying, and selling of DataNFTs, which represent ownership and access rights to datasets.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">3. User Responsibilities</h2>
              <div className="space-y-3 text-text-secondary-dark/80 leading-relaxed">
                <p><strong className="text-white">Data Sellers:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must have the legal right to sell the datasets you upload</li>
                  <li>You must not upload illegal, harmful, or infringing content</li>
                  <li>You are responsible for the accuracy of dataset metadata</li>
                  <li>You must comply with all applicable data protection laws</li>
                </ul>
                <p className="mt-4"><strong className="text-white">Data Buyers:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must use purchased datasets in compliance with applicable laws</li>
                  <li>You must respect any usage restrictions specified by sellers</li>
                  <li>You are responsible for securing your wallet and private keys</li>
                </ul>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">4. Transactions and Fees</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                All transactions are conducted in SUI tokens. Blockchain transaction fees (gas) are paid by users. Suilex may charge platform fees on sales. All transactions are final and non-refundable once confirmed on the blockchain.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">5. Intellectual Property</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                Dataset sellers retain ownership of their data. By minting a DataNFT, sellers grant buyers access rights as specified in the listing. The Suilex platform, brand, and interface are the intellectual property of Suilex.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">6. Disclaimers</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                Suilex is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the quality, accuracy, or legality of datasets. We are not responsible for disputes between buyers and sellers. Use of blockchain technology carries inherent risks.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">7. Limitation of Liability</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                Suilex shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including loss of data, loss of profits, or loss of tokens.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">8. Termination</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms. Users may stop using the platform at any time. On-chain data and NFTs will remain on the blockchain.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">9. Changes to Terms</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">10. Contact</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                For questions about these Terms of Service, contact us at:
              </p>
              <div className="mt-4 text-primary font-semibold">
                legal@suilex.io
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
