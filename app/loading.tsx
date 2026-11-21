export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 font-humanist" aria-label="Loading content">
      {/* Navbar skeleton */}
      <div className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/90 h-16 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-200 animate-pulse" />
            <div className="w-28 h-5 rounded bg-slate-200 animate-pulse" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[80, 96, 72, 56].map((w, i) => (
              <div
                key={i}
                className="h-4 rounded bg-slate-200 animate-pulse"
                style={{ width: w }}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-20 h-8 rounded-lg bg-slate-200 animate-pulse" />
            <div className="w-28 h-8 rounded-lg bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-32 h-6 rounded-full bg-slate-800 animate-pulse mx-auto mb-6" />
          <div className="w-3/4 h-10 rounded-lg bg-slate-800 animate-pulse mx-auto mb-4" />
          <div className="w-2/3 h-8 rounded-lg bg-slate-800 animate-pulse mx-auto mb-6" />
          <div className="w-full h-5 rounded bg-slate-800 animate-pulse mx-auto mb-2" />
          <div className="w-5/6 h-5 rounded bg-slate-800 animate-pulse mx-auto mb-8" />
          <div className="flex gap-4 justify-center">
            <div className="w-36 h-11 rounded-lg bg-slate-800 animate-pulse" />
            <div className="w-36 h-11 rounded-lg bg-slate-700 animate-pulse" />
          </div>
        </div>

        {/* Feature cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-slate-900 border border-slate-800 p-6 animate-pulse"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800 mb-4" />
              <div className="w-3/4 h-5 rounded bg-slate-800 mb-3" />
              <div className="w-full h-4 rounded bg-slate-800 mb-2" />
              <div className="w-5/6 h-4 rounded bg-slate-800" />
            </div>
          ))}
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-slate-900 border border-slate-800 p-6 text-center animate-pulse"
            >
              <div className="w-16 h-8 rounded bg-slate-800 mx-auto mb-2" />
              <div className="w-24 h-4 rounded bg-slate-800 mx-auto" />
            </div>
          ))}
        </div>

        {/* Wide content block skeleton */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 animate-pulse">
          <div className="w-48 h-6 rounded bg-slate-800 mb-4" />
          <div className="w-full h-4 rounded bg-slate-800 mb-2" />
          <div className="w-5/6 h-4 rounded bg-slate-800 mb-2" />
          <div className="w-4/6 h-4 rounded bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
