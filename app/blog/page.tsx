import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const blogPosts = [
  {
    title: 'Introducing Suilex: The Future of AI Data Trading',
    date: 'March 15, 2024',
    category: 'Announcement',
    excerpt: 'Today we are excited to launch Suilex, the world\'s first decentralized marketplace for AI datasets on the Sui blockchain.',
    image: 'announcement',
  },
  {
    title: 'How AI Verification Works',
    date: 'March 10, 2024',
    category: 'Technical',
    excerpt: 'A deep dive into our AI-powered verification system that ensures dataset quality and authenticity.',
    image: 'technical',
  },
  {
    title: 'Understanding DataNFTs',
    date: 'March 5, 2024',
    category: 'Education',
    excerpt: 'Learn what DataNFTs are and why they represent the future of data ownership and trading.',
    image: 'education',
  },
  {
    title: 'Why We Built on Sui',
    date: 'February 28, 2024',
    category: 'Technical',
    excerpt: 'Exploring the technical advantages of the Sui blockchain for our data marketplace.',
    image: 'technical',
  },
];

export default function BlogPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Blog</h1>
          <p className="text-xl text-text-secondary-dark/80 mb-12">
            News, updates, and insights from the Suilex team
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post, idx) => (
              <article key={idx} className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all group cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/40 text-7xl">
                    {post.image === 'announcement' ? 'campaign' : post.image === 'technical' ? 'code' : 'school'}
                  </span>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                    <span className="text-text-secondary-dark/60 text-sm">{post.date}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-text-secondary-dark/80 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Read more</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-text-secondary-dark/60 text-sm">More blog posts coming soon!</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
