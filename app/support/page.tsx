'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement support ticket submission
    alert('Support ticket submitted! We will get back to you soon.');
    setFormData({ name: '', email: '', category: 'general', subject: '', message: '' });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Support Center</h1>
          <p className="text-xl text-text-secondary-dark/80 mb-12">
            Get help with your Suilex experience
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <a href="/faq" className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors group">
              <span className="material-symbols-outlined text-primary text-4xl mb-3 block group-hover:scale-110 transition-transform">help</span>
              <h3 className="text-xl font-bold text-white mb-2">FAQ</h3>
              <p className="text-text-secondary-dark/70 text-sm">Find answers to common questions</p>
            </a>
            <a href="/docs" className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors group">
              <span className="material-symbols-outlined text-primary text-4xl mb-3 block group-hover:scale-110 transition-transform">description</span>
              <h3 className="text-xl font-bold text-white mb-2">Documentation</h3>
              <p className="text-text-secondary-dark/70 text-sm">Learn how to use Suilex</p>
            </a>
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <span className="material-symbols-outlined text-primary text-4xl mb-3 block">schedule</span>
              <h3 className="text-xl font-bold text-white mb-2">Response Time</h3>
              <p className="text-text-secondary-dark/70 text-sm">Usually within 24 hours</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-3xl font-black text-white mb-6">Contact Support</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="report">Report Content</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="Please provide as much detail as possible..."
                />
              </div>

              <Button type="submit" variant="pill" size="lg" className="w-full md:w-auto">
                <span className="material-symbols-outlined text-[18px]">send</span>
                Submit Ticket
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
