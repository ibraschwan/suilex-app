import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

const openings = [
  {
    title: 'Senior Blockchain Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Frontend Developer (React/Next.js)',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'AI/ML Engineer',
    department: 'AI Research',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Community Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
  },
];

export default function CareersPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pt-[84px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Careers at Suilex</h1>
          <p className="text-xl text-text-secondary-dark/80 mb-12">
            Join us in building the future of decentralized AI data trading
          </p>

          <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 mb-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <span className="material-symbols-outlined text-primary text-5xl mb-3 block">diversity_3</span>
                <h3 className="text-2xl font-black text-white mb-2">Remote-First</h3>
                <p className="text-text-secondary-dark/70">Work from anywhere in the world</p>
              </div>
              <div className="text-center">
                <span className="material-symbols-outlined text-primary text-5xl mb-3 block">rocket_launch</span>
                <h3 className="text-2xl font-black text-white mb-2">Cutting Edge</h3>
                <p className="text-text-secondary-dark/70">Build with the latest tech</p>
              </div>
              <div className="text-center">
                <span className="material-symbols-outlined text-primary text-5xl mb-3 block">workspace_premium</span>
                <h3 className="text-2xl font-black text-white mb-2">Competitive</h3>
                <p className="text-text-secondary-dark/70">Great salary and equity</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-black text-white mb-6">Open Positions</h2>
          <div className="space-y-4 mb-12">
            {openings.map((job, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-text-secondary-dark/70">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">business_center</span>
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="pill" size="md">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-8 border border-primary/30 text-center">
            <h3 className="text-2xl font-black text-white mb-3">Don&apos;t see a perfect fit?</h3>
            <p className="text-text-secondary-dark/80 mb-6">
              We&apos;re always looking for talented people. Send us your resume and tell us how you can contribute.
            </p>
            <Button variant="pill" size="lg">
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Send General Application
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
