export default function IndustryDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 font-humanist animate-pulse">
      <div className="h-14 bg-slate-900 border-b border-slate-800" />

      {/* Breadcrumb skeleton */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex gap-2">
          <div className="w-12 h-4 bg-slate-800 rounded" />
          <div className="w-4 h-4 bg-slate-800/40 rounded" />
          <div className="w-20 h-4 bg-slate-800 rounded" />
          <div className="w-4 h-4 bg-slate-800/40 rounded" />
          <div className="w-32 h-4 bg-slate-800 rounded" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-10 space-y-6">
        <div className="w-28 h-6 bg-slate-800 rounded-full" />
        <div className="w-96 h-10 bg-slate-800 rounded-xl" />
        <div className="w-80 h-5 bg-slate-800/60 rounded-lg" />
      </div>

      {/* Tabs skeleton */}
      <div className="max-w-6xl mx-auto px-4 flex gap-3 pb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-28 h-9 bg-slate-800 rounded-xl" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="w-48 h-6 bg-slate-800 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="w-full h-4 bg-slate-800/60 rounded" />
                <div className="w-5/6 h-4 bg-slate-800/60 rounded" />
                <div className="w-3/4 h-4 bg-slate-800/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
