'use client';

import { ShieldCheck, IndianRupee, Calendar, CheckCircle2, Clock, XCircle, Lock, HelpCircle } from 'lucide-react';
import type { BadgeType, PensionData } from '@/lib/types';

interface Props { data: PensionData }

const THEME: Record<BadgeType, {
  wrap: string; border: string; headerBg: string;
  dot: string; label: string; payBg: string;
}> = {
  success: {
    wrap:      'bg-emerald-50  border-emerald-200',
    border:    'border-l-emerald-400',
    headerBg:  'bg-emerald-50',
    dot:       'bg-emerald-400',
    label:     'text-emerald-800',
    payBg:     'bg-white border-emerald-100',
  },
  warning: {
    wrap:      'bg-amber-50    border-amber-200',
    border:    'border-l-amber-400',
    headerBg:  'bg-amber-50',
    dot:       'bg-amber-400',
    label:     'text-amber-800',
    payBg:     'bg-white border-amber-100',
  },
  danger: {
    wrap:      'bg-red-50      border-red-200',
    border:    'border-l-red-400',
    headerBg:  'bg-red-50',
    dot:       'bg-red-400',
    label:     'text-red-800',
    payBg:     'bg-white border-red-100',
  },
  locked: {
    wrap:      'bg-violet-50   border-violet-200',
    border:    'border-l-violet-400',
    headerBg:  'bg-violet-50',
    dot:       'bg-violet-400',
    label:     'text-violet-800',
    payBg:     'bg-white border-violet-100',
  },
  info: {
    wrap:      'bg-sky-50      border-sky-200',
    border:    'border-l-sky-400',
    headerBg:  'bg-sky-50',
    dot:       'bg-sky-400',
    label:     'text-sky-800',
    payBg:     'bg-white border-sky-100',
  },
  neutral: {
    wrap:      'bg-slate-50    border-slate-200',
    border:    'border-l-slate-400',
    headerBg:  'bg-slate-50',
    dot:       'bg-slate-400',
    label:     'text-slate-700',
    payBg:     'bg-white border-slate-100',
  },
};

const PAY_ICON: Record<BadgeType, React.ReactNode> = {
  success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />,
  warning: <Clock        className="w-3.5 h-3.5 text-amber-500  flex-shrink-0" />,
  danger:  <XCircle      className="w-3.5 h-3.5 text-red-500    flex-shrink-0" />,
  locked:  <Lock         className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />,
  info:    <HelpCircle   className="w-3.5 h-3.5 text-sky-500    flex-shrink-0" />,
  neutral: <HelpCircle   className="w-3.5 h-3.5 text-slate-400  flex-shrink-0" />,
};

const PAY_TEXT: Record<BadgeType, string> = {
  success: 'text-emerald-700',
  warning: 'text-amber-700',
  danger:  'text-red-700',
  locked:  'text-violet-700',
  info:    'text-sky-700',
  neutral: 'text-slate-600',
};

export default function InfoBanner({ data }: Props) {
  const t = THEME[data.currentStatusBadge];
  // Latest 2 payments — already sorted latest-first
  const recent = data.paymentMonths.slice(0, 2);

  return (
    <div className={`rounded-2xl border border-l-[5px] ${t.wrap} ${t.border} shadow-sm animate-fade-in-up mb-4 overflow-hidden`}>

      {/* ── Section 1: Pension Status ─────────────────── */}
      <div className="px-4 pt-4 pb-3">
        {/* Label row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            {/* Pulsing status dot */}
            <span className="relative flex w-2 h-2 flex-shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${t.dot} opacity-50`} />
              <span className={`relative inline-flex rounded-full w-2 h-2 ${t.dot}`} />
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              पेंशन स्थिति / Pension Status
            </span>
          </div>
          {data.currentStatusLastUpdate && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0">
              <Calendar className="w-3 h-3" />
              <span>{data.currentStatusLastUpdate}</span>
            </div>
          )}
        </div>

        {/* Status text — full portal text, clear */}
        <p className={`font-semibold text-sm devanagari leading-snug ${t.label}`}>
          {data.currentStatusClean || '—'}
        </p>
      </div>

      {/* ── Section 2: Recent Payments ────────────────── */}
      {recent.length > 0 && (
        <div className="border-t border-black/5 px-4 pt-3 pb-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              हाल के भुगतान / Recent Payments
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {recent.map((pm, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${t.payBg}`}
              >
                {PAY_ICON[pm.badgeType]}
                <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
                  {/* Month pill */}
                  <span className="text-xs font-bold text-slate-700 devanagari whitespace-nowrap">
                    {pm.month}
                  </span>
                  {/* Status text */}
                  <span className={`text-xs font-medium devanagari leading-snug ${PAY_TEXT[pm.badgeType]}`}>
                    {pm.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
