import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CookiesPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Cookie Policy</h1>
          <p className="text-text-secondary-dark/60 text-sm mb-12">
            Last updated: March 15, 2024
          </p>

          <div className="space-y-8">
            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">What Are Cookies?</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">How We Use Cookies</h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">settings</span>
                    Essential Cookies
                  </h3>
                  <p className="text-text-secondary-dark/80 text-sm leading-relaxed">
                    These cookies are necessary for the website to function properly. They enable core functionality like wallet connections, session management, and security features. These cookies cannot be disabled.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    Analytics Cookies
                  </h3>
                  <p className="text-text-secondary-dark/80 text-sm leading-relaxed">
                    These cookies help us understand how visitors interact with our platform by collecting and reporting information anonymously. This helps us improve our services.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">tune</span>
                    Preference Cookies
                  </h3>
                  <p className="text-text-secondary-dark/80 text-sm leading-relaxed">
                    These cookies allow the website to remember your preferences, such as language selection, recent searches, and display settings.
                  </p>
                </div>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">Local Storage</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed mb-4">
                In addition to cookies, we use browser local storage to save:
              </p>
              <ul className="space-y-2 text-text-secondary-dark/80">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                  <span>Wallet connection preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                  <span>Recent search history</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                  <span>Onboarding completion status</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                  <span>Wishlist and saved datasets</span>
                </li>
              </ul>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">Managing Cookies</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary-dark/80 ml-4">
                <li>View what cookies are stored and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies from specific websites</li>
                <li>Block all cookies entirely</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p className="text-text-secondary-dark/80 leading-relaxed mt-4">
                Please note that blocking or deleting cookies may limit your ability to use certain features of our platform.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">Third-Party Cookies</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                We may use third-party services like analytics providers. These services may set their own cookies. We do not control these cookies and recommend reviewing the privacy policies of these third parties.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">Updates to This Policy</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section className="glass-card rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-4">Contact Us</h2>
              <p className="text-text-secondary-dark/80 leading-relaxed">
                If you have questions about our use of cookies, please contact us at:
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
