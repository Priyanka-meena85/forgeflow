export default function IndustriesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 font-humanist animate-pulse">
      <div className="h-14 bg-slate-900 border-b border-slate-800" />

      <div className="max-w-5xl mx-auto px-4 pt-20 pb-14 space-y-6">
        <div className="mx-auto w-44 h-6 bg-slate-800 rounded-full" />
        <div className="mx-auto w-80 h-10 bg-slate-800 rounded-xl" />
        <div className="mx-auto w-72 h-5 bg-slate-800/60 rounded-lg" />
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="w-20 h-5 bg-slate-800 rounded" />
            <div className="w-full h-6 bg-slate-800 rounded" />
            <div className="space-y-2">
              <div className="w-full h-3 bg-slate-800/60 rounded" />
              <div className="w-3/4 h-3 bg-slate-800/60 rounded" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="w-16 h-5 bg-slate-800 rounded-full" />
              <div className="w-20 h-5 bg-slate-800 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
