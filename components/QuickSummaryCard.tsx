'use client';

import { CheckCircle2, XCircle, Clock, HelpCircle, IndianRupee, ShieldCheck, Fingerprint, Link2, Sparkles } from 'lucide-react';
import type { PensionData } from '@/lib/types';

interface Props {
  data: PensionData;
}

function StatusPill({ badge, label }: { badge: string; label: string }) {
  if (badge === 'success')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold">
        <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> {label}
      </span>
    );
  if (badge === 'warning')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-semibold">
        <Clock className="w-3 h-3 flex-shrink-0" /> {label}
      </span>
    );
  if (badge === 'danger')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-[11px] font-semibold">
        <XCircle className="w-3 h-3 flex-shrink-0" /> {label}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/20 border border-slate-400/30 text-slate-400 text-[11px] font-semibold">
      <HelpCircle className="w-3 h-3 flex-shrink-0" /> {label}
    </span>
  );
}

export default function QuickSummaryCard({ data }: Props) {
  const recentPayments = data.paymentMonths.slice(0, 2);
  const hasPayments = recentPayments.length > 0;

  return (
    <div className="relative rounded-2xl overflow-hidden animate-fade-in-up">
      {/* Glowing border — animated gradient */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #f97316, #a855f7, #38bdf8, #f97316)',
          backgroundSize: '300% 300%',
          animation: 'gradient-shift 5s ease infinite',
          padding: '1.5px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Card body */}
      <div className="relative bg-slate-900/95 backdrop-blur-sm rounded-2xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">{data.name || '—'}</p>
              <p className="text-slate-400 text-[11px] mt-0.5 devanagari">{data.schemeName}</p>
            </div>
          </div>
          {/* Labharthi ID chip */}
          <span className="font-mono text-[11px] text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg tracking-wide">
            #{data.beneficiaryId || '—'}
          </span>
        </div>

        {/* Status row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Pension */}
          <div className="flex flex-col gap-1.5 bg-white/5 rounded-xl p-3 border border-white/8">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3 h-3 text-orange-400 flex-shrink-0" />
              पेंशन
            </div>
            <StatusPill badge={data.currentStatusBadge} label={data.currentStatusClean || 'N/A'} />
            {data.currentStatusLastUpdate && (
              <p className="text-[10px] text-slate-500 leading-tight">{data.currentStatusLastUpdate}</p>
            )}
          </div>

          {/* eKYC */}
          <div className="flex flex-col gap-1.5 bg-white/5 rounded-xl p-3 border border-white/8">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
              <Fingerprint className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              eKYC
            </div>
            <StatusPill badge={data.jpStatusBadge} label={data.jpStatusClean || 'N/A'} />
            {data.jpLastDate && (
              <p className="text-[10px] text-slate-500 leading-tight font-mono">{data.jpLastDate}</p>
            )}
          </div>

          {/* Seeding */}
          <div className="flex flex-col gap-1.5 bg-white/5 rounded-xl p-3 border border-white/8">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
              <Link2 className="w-3 h-3 text-sky-400 flex-shrink-0" />
              आधार
            </div>
            <StatusPill badge={data.aadhaarSeedingBadge} label={data.aadhaarSeedingStatus || 'N/A'} />
          </div>
        </div>

        {/* Recent payments */}
        <div className="border-t border-white/8 pt-3.5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <IndianRupee className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">हाल के भुगतान / Recent Payments</p>
          </div>

          {hasPayments ? (
            <div className="flex flex-wrap gap-2">
              {recentPayments.map((pm, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${
                    pm.badgeType === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                      : pm.badgeType === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/25 text-amber-300'
                      : pm.badgeType === 'danger'
                      ? 'bg-red-500/10 border-red-500/25 text-red-300'
                      : 'bg-slate-500/10 border-slate-500/25 text-slate-400'
                  }`}
                >
                  {pm.badgeType === 'success' ? (
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                  ) : pm.badgeType === 'warning' ? (
                    <Clock className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3 h-3 flex-shrink-0" />
                  )}
                  <span className="devanagari">{pm.month}</span>
                  <span className="opacity-70 devanagari">{pm.status}</span>
                </div>
              ))}
              {data.paymentMonths.length > 2 && (
                <span className="px-3 py-1.5 rounded-lg text-[11px] text-slate-500 bg-white/5 border border-white/8">
                  +{data.paymentMonths.length - 2} और
                </span>
              )}
            </div>
          ) : data.paymentHistory.length > 0 ? (
            // Fallback: show last 2 from full history table
            <div className="flex flex-wrap gap-2">
              {data.paymentHistory.slice(0, 2).map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${
                    r.statusBadge === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                      : 'bg-slate-500/10 border-slate-500/25 text-slate-400'
                  }`}
                >
                  <IndianRupee className="w-3 h-3 flex-shrink-0" />
                  <span className="devanagari">{r.fromMonth}</span>
                  {r.amount && <span className="opacity-70">₹{r.amount}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-[11px] devanagari">इस वित्त वर्ष में कोई भुगतान डेटा नहीं मिला</p>
          )}
        </div>
      </div>
    </div>
  );
}
