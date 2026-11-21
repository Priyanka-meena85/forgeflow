export default function IntegrationsLoading() {
  return (
    <div className="min-h-screen bg-slate-950 font-humanist animate-pulse">
      <div className="h-14 bg-slate-900 border-b border-slate-800" />

      <div className="max-w-5xl mx-auto px-4 pt-20 pb-14 space-y-6">
        <div className="mx-auto w-40 h-6 bg-slate-800 rounded-full" />
        <div className="mx-auto w-96 h-10 bg-slate-800 rounded-xl" />
        <div className="mx-auto w-72 h-5 bg-slate-800/60 rounded-lg" />
      </div>

      {/* Category filter skeleton */}
      <div className="max-w-6xl mx-auto px-4 flex gap-3 pb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-24 h-8 bg-slate-800 rounded-full" />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg" />
              <div className="w-28 h-5 bg-slate-800 rounded" />
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-slate-800/60 rounded" />
              <div className="w-4/5 h-3 bg-slate-800/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
