'use client';

import { ShieldCheck, Calendar, IndianRupee } from 'lucide-react';
import type { BadgeType, PensionData } from '@/lib/types';

interface Props { data: PensionData }

const ACCENT: Record<BadgeType, { border: string; bg: string; dot: string; text: string }> = {
  success: { border: 'border-emerald-400', bg: 'bg-emerald-50',  dot: 'bg-emerald-400', text: 'text-emerald-800' },
  warning: { border: 'border-amber-400',   bg: 'bg-amber-50',    dot: 'bg-amber-400',   text: 'text-amber-800'  },
  danger:  { border: 'border-red-400',     bg: 'bg-red-50',      dot: 'bg-red-400',     text: 'text-red-800'    },
  locked:  { border: 'border-violet-400',  bg: 'bg-violet-50',   dot: 'bg-violet-400',  text: 'text-violet-800' },
  info:    { border: 'border-sky-400',     bg: 'bg-sky-50',      dot: 'bg-sky-400',     text: 'text-sky-800'    },
  neutral: { border: 'border-slate-300',   bg: 'bg-slate-50',    dot: 'bg-slate-400',   text: 'text-slate-700'  },
};

export default function InfoBanner({ data }: Props) {
  const cfg    = ACCENT[data.currentStatusBadge];
  const latest = data.paymentMonths[0];
  const second = data.paymentMonths[1];

  // Single readable Hindi sentence
  const parts: string[] = [];
  if (data.currentStatusClean) parts.push(data.currentStatusClean);
  if (latest)  parts.push(`अंतिम भुगतान — ${latest.month}: ${latest.status}`);
  if (second && second.month !== latest?.month)
    parts.push(`${second.month}: ${second.status}`);
  const sentence = parts.join('  •  ');

  return (
    <div
      className={`
        rounded-2xl border-l-[5px] ${cfg.border} ${cfg.bg}
        border border-black/5
        shadow-sm
        px-5 py-4
        flex items-start gap-4
        animate-fade-in-up mb-4
      `}
    >
      {/* Pulsing dot */}
      <span className="relative flex w-3 h-3 flex-shrink-0 mt-1">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-40`} />
        <span className={`relative inline-flex rounded-full w-3 h-3 ${cfg.dot}`} />
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            पेंशन स्थिति &amp; भुगतान सारांश
          </p>
        </div>
        <p className={`font-semibold text-sm devanagari leading-relaxed break-words ${cfg.text}`}>
          {sentence || '—'}
        </p>
      </div>

      {/* Right meta */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {latest && (
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <IndianRupee className="w-3 h-3" />
            <span className="devanagari">{latest.month}</span>
          </div>
        )}
        {data.currentStatusLastUpdate && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>{data.currentStatusLastUpdate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
