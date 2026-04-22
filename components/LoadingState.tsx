'use client';

export default function LoadingState() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-20 gap-8">
      {/* Spinner rings */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-orange-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-orange-400/60" style={{ animationDuration: '1.5s' }} />
        <div className="absolute inset-4 rounded-full bg-orange-500/10 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-orange-500/40 animate-pulse" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <p className="text-slate-800 font-medium devanagari text-lg">
          जानकारी प्राप्त हो रही है…
        </p>
        <p className="text-slate-500 text-sm">
          Fetching data from eLabharthi Bihar portal
        </p>
      </div>

      {/* Skeleton preview */}
      <div className="w-full max-w-2xl space-y-3">
        <div className="skeleton h-24 rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <div className="skeleton h-28 rounded-xl" />
          <div className="skeleton h-28 rounded-xl" />
          <div className="skeleton h-28 rounded-xl" />
        </div>
        <div className="skeleton h-36 rounded-xl" />
      </div>
    </div>
  );
}
