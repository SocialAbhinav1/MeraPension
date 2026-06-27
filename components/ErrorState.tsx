'use client';

import { AlertCircle, RefreshCw, Search } from 'lucide-react';

interface Props {
  message: string;
  onRetry: () => void;
  onNewSearch: () => void;
}

export default function ErrorState({ message, onRetry, onNewSearch }: Props) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-16 gap-6 text-center">
      {/* Icon */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}
        >
          <AlertCircle className="w-9 h-9" style={{ color: '#ef4444' }} />
        </div>
        <div
          className="absolute inset-0 rounded-full border animate-ping opacity-25"
          style={{ borderColor: '#fca5a5' }}
        />
      </div>

      {/* Title */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold devanagari" style={{ color: 'var(--color-ink)' }}>
          कोई जानकारी नहीं मिली
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{message}</p>
      </div>

      {/* Suggestions */}
      <div
        className="rounded-xl p-4 max-w-sm w-full text-left space-y-2"
        style={{
          background: 'var(--color-canvas)',
          border: '1px solid var(--color-hairline)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted)' }}>
          सुझाव / Suggestions
        </p>
        {[
          { hi: 'आधार नंबर सही है?', en: 'Verify your 12-digit Aadhaar number' },
          { hi: 'वित्तीय वर्ष सही चुना?', en: 'Try a different financial year' },
          { hi: 'लाभार्थी संख्या से खोजें', en: 'Try searching by Beneficiary ID instead' },
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
              style={{ background: 'var(--color-surface-card)', color: 'var(--color-body)' }}
            >
              {i + 1}
            </span>
            <div>
              <span className="devanagari" style={{ color: 'var(--color-body)' }}>{s.hi}</span>
              <span className="ml-1 text-xs" style={{ color: 'var(--color-muted)' }}>— {s.en}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 font-semibold rounded-xl px-5 py-2.5 text-sm transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            boxShadow: 'var(--shadow-primary)',
          }}
        >
          <RefreshCw className="w-4 h-4" />
          <span className="devanagari">पुनः प्रयास</span>
          <span className="opacity-70">/ Retry</span>
        </button>
        <button
          onClick={onNewSearch}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200"
          style={{
            background: 'var(--color-canvas)',
            border: '1px solid var(--color-hairline)',
            color: 'var(--color-body)',
          }}
        >
          <Search className="w-4 h-4" />
          <span className="devanagari">नई खोज</span>
          <span className="opacity-60">/ New Search</span>
        </button>
      </div>
    </div>
  );
}
