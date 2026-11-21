export default function FeaturesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 font-humanist animate-pulse">
      {/* Nav skeleton */}
      <div className="h-14 bg-slate-900 border-b border-slate-800" />

      {/* Hero skeleton */}
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-14 space-y-6">
        <div className="mx-auto w-40 h-6 bg-slate-800 rounded-full" />
        <div className="mx-auto w-96 h-10 bg-slate-800 rounded-xl" />
        <div className="mx-auto w-80 h-5 bg-slate-800/60 rounded-lg" />
      </div>

      {/* 3-column feature cards skeleton */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="w-10 h-10 bg-slate-800 rounded-lg" />
            <div className="w-3/4 h-5 bg-slate-800 rounded" />
            <div className="space-y-2">
              <div className="w-full h-3 bg-slate-800/60 rounded" />
              <div className="w-5/6 h-3 bg-slate-800/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
