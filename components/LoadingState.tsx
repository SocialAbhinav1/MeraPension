'use client';

export default function LoadingState() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-20 gap-8">
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid var(--color-hairline)' }}
        />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-500 animate-spin"
          style={{ borderTopColor: 'var(--color-primary)' }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#fbbf24', opacity: 0.6, animationDuration: '1.5s' }}
        />
        <div
          className="absolute inset-4 rounded-full flex items-center justify-center"
          style={{ background: '#fff7ed' }}
        >
          <div
            className="w-4 h-4 rounded-full animate-pulse"
            style={{ background: 'var(--color-primary)', opacity: 0.5 }}
          />
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <p className="font-semibold devanagari text-lg" style={{ color: 'var(--color-ink)' }}>
          जानकारी प्राप्त हो रही है…
        </p>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Fetching data from eLabharthi Bihar portal
        </p>
      </div>

      {/* Skeleton preview — warm tones */}
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
