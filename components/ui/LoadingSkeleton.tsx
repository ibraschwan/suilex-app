export function LoadingSkeleton({ variant = 'card', count = 1 }: { variant?: 'card' | 'list' | 'text' | 'detail'; count?: number }) {
  if (variant === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-white/10 rounded w-full mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-5/6 mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-white/10 rounded-full"></div>
              <div className="h-6 w-16 bg-white/10 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="h-8 w-24 bg-white/10 rounded"></div>
              <div className="h-10 w-32 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'list') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 glass-card rounded-xl animate-pulse">
            <div className="h-12 w-12 bg-white/10 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'detail') {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-white/10 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
          <div className="h-4 bg-white/10 rounded w-4/5"></div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 bg-white/10 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // text variant
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-4 bg-white/10 rounded w-full mb-2 animate-pulse"></div>
      ))}
    </>
  );
}
