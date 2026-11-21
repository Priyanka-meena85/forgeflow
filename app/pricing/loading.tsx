export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-slate-950 font-humanist animate-pulse">
      <div className="h-14 bg-slate-900 border-b border-slate-800" />

      <div className="max-w-5xl mx-auto px-4 pt-20 pb-14 space-y-6">
        <div className="mx-auto w-36 h-6 bg-slate-800 rounded-full" />
        <div className="mx-auto w-96 h-10 bg-slate-800 rounded-xl" />
        <div className="mx-auto w-64 h-8 bg-slate-800 rounded-full mt-4" />
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/5 border border-slate-800 rounded-2xl p-8 space-y-6">
            <div className="space-y-2">
              <div className="w-28 h-6 bg-slate-800 rounded" />
              <div className="w-20 h-4 bg-slate-800/60 rounded" />
            </div>
            <div className="w-32 h-10 bg-slate-800 rounded-lg" />
            <div className="space-y-3 pt-4 border-t border-slate-800">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="w-full h-3 bg-slate-800/60 rounded" />
              ))}
            </div>
            <div className="w-full h-11 bg-slate-800 rounded-xl mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
