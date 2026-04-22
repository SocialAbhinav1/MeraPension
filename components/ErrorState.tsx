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
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-9 h-9 text-red-400" />
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full border border-red-500/20 animate-ping opacity-30" />
      </div>

      {/* Title */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold text-slate-900 devanagari">
          कोई जानकारी नहीं मिली
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
      </div>

      {/* Suggestions */}
      <div className="glass rounded-xl p-4 max-w-sm w-full text-left space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">सुझाव / Suggestions</p>
        {[
          { hi: 'आधार नंबर सही है?', en: 'Verify your 12-digit Aadhaar number' },
          { hi: 'वित्तीय वर्ष सही चुना?', en: 'Try a different financial year' },
          { hi: 'लाभार्थी संख्या से खोजें', en: 'Try searching by Beneficiary ID instead' },
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-700 font-bold flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div>
              <span className="text-slate-700 devanagari">{s.hi}</span>
              <span className="text-slate-500 ml-1 text-xs">— {s.en}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-slate-900 font-semibold rounded-xl px-5 py-2.5 text-sm transition-all duration-200 shadow-lg shadow-orange-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          पुनः प्रयास / Retry
        </button>
        <button
          onClick={onNewSearch}
          className="flex items-center gap-2 border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-500 rounded-xl px-5 py-2.5 text-sm transition-all"
        >
          <Search className="w-4 h-4" />
          नई खोज / New Search
        </button>
      </div>
    </div>
  );
}
