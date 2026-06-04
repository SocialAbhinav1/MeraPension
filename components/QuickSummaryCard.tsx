'use client';

import { ShieldCheck, Fingerprint, IndianRupee, Calendar, CheckCircle2, Clock, XCircle, Lock, HelpCircle } from 'lucide-react';
import type { BadgeType, PensionData } from '@/lib/types';

interface Props { data: PensionData }

const STATUS_STYLE: Record<BadgeType, { pill: string; dot: string }> = {
  success: { pill: 'bg-emerald-50 border-emerald-200 text-emerald-800', dot: 'bg-emerald-400' },
  warning: { pill: 'bg-amber-50  border-amber-200  text-amber-800',   dot: 'bg-amber-400'  },
  danger:  { pill: 'bg-red-50    border-red-200    text-red-800',     dot: 'bg-red-400'    },
  locked:  { pill: 'bg-violet-50 border-violet-200 text-violet-800',  dot: 'bg-violet-400' },
  info:    { pill: 'bg-sky-50    border-sky-200    text-sky-800',     dot: 'bg-sky-400'    },
  neutral: { pill: 'bg-slate-50  border-slate-200  text-slate-600',   dot: 'bg-slate-400'  },
};

function StatusIcon({ type, size = 14 }: { type: BadgeType; size?: number }) {
  const cls = `flex-shrink-0 text-current`;
  const s = { width: size, height: size };
  if (type === 'success') return <CheckCircle2 className={cls} style={s} />;
  if (type === 'warning') return <Clock        className={cls} style={s} />;
  if (type === 'danger')  return <XCircle      className={cls} style={s} />;
  if (type === 'locked')  return <Lock         className={cls} style={s} />;
  return <HelpCircle className={cls} style={s} />;
}

function Pill({ badge, label, sub }: { badge: BadgeType; label: string; sub: string }) {
  const s = STATUS_STYLE[badge];
  return (
    <div className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium ${s.pill} min-w-[130px]`}>
      <div className={`w-2 h-2 rounded-full ${s.dot} mt-0.5 flex-shrink-0 animate-pulse`} />
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-[10px] uppercase tracking-wider opacity-60 font-semibold">{sub}</p>
        <p className="devanagari font-semibold leading-snug line-clamp-2">{label || '—'}</p>
        <StatusIcon type={badge} size={12} />
      </div>
    </div>
  );
}

export default function QuickSummaryCard({ data }: Props) {
  const recentPayments = data.paymentMonths.slice(0, 2);

  return (
    <div className="quick-summary-glow animate-fade-in-up mb-5">
      <div className="bg-white/95 backdrop-blur rounded-2xl px-5 py-4">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Quick Status
            </p>
          </div>
          {data.currentStatusLastUpdate && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>अपडेट: {data.currentStatusLastUpdate}</span>
            </div>
          )}
        </div>

        {/* Name */}
        <p className="text-sm font-bold text-slate-900 devanagari mb-3 truncate">{data.name}</p>

        {/* Status pills — scrollable row on mobile */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {/* Pension Status */}
          <Pill
            badge={data.currentStatusBadge}
            label={data.currentStatusClean}
            sub="पेंशन स्थिति"
          />

          {/* eKYC */}
          <Pill
            badge={data.jpStatusBadge}
            label={data.jpStatusClean}
            sub="jeevan praman"
          />

          {/* Recent payment months — latest first (already sorted) */}
          {recentPayments.length > 0 ? recentPayments.map((pm, i) => (
            <Pill
              key={i}
              badge={pm.badgeType}
              label={pm.status}
              sub={pm.month}
            />
          )) : (
            <Pill badge="neutral" label="उपलब्ध नहीं" sub="भुगतान" />
          )}

          {/* Aadhaar Seeding */}
          <Pill
            badge={data.aadhaarSeedingBadge}
            label={data.aadhaarSeedingStatus}
            sub="aadhaar seeding"
          />
        </div>
      </div>
    </div>
  );
}
