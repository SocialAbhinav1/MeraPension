'use client';

import { User, MapPin, CreditCard, Hash, Calendar, Fingerprint, BadgeInfo } from 'lucide-react';
import type { PensionData } from '@/lib/types';

interface Props { data: PensionData }

const SCHEME_COLORS: Record<PensionData['schemeType'], {
  accent: string; badge: string; border: string; avatar: string; label: string;
}> = {
  'old-age':  { accent: 'from-amber-500 to-orange-500',  badge: 'bg-amber-100 text-amber-700 border-amber-200',   border: 'border-t-amber-500',  avatar: 'from-amber-500 to-orange-600',  label: 'वृद्धा पेंशन'  },
  'widow':    { accent: 'from-pink-500 to-rose-500',     badge: 'bg-pink-100 text-pink-700 border-pink-200',       border: 'border-t-pink-500',   avatar: 'from-pink-500 to-rose-600',    label: 'विधवा पेंशन'  },
  'disabled': { accent: 'from-blue-500 to-indigo-500',   badge: 'bg-blue-100 text-blue-700 border-blue-200',       border: 'border-t-blue-500',   avatar: 'from-blue-500 to-indigo-600',  label: 'दिव्यांग पेंशन'},
  'other':    { accent: 'from-violet-500 to-purple-500', badge: 'bg-violet-100 text-violet-700 border-violet-200', border: 'border-t-violet-500', avatar: 'from-violet-500 to-purple-600',label: 'पेंशन'         },
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function BeneficiaryCard({ data }: Props) {
  const s = SCHEME_COLORS[data.schemeType];

  return (
    <div className="glass rounded-2xl overflow-hidden animate-fade-in-up">
      {/* Accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${s.accent}`} />

      <div className="p-6 md:p-8">
        {/* Top row — avatar + name + IDs */}
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${s.avatar} flex items-center justify-center text-white font-bold text-xl md:text-2xl flex-shrink-0 shadow-lg shadow-orange-500/20`}>
            {getInitials(data.name)}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-wide">
              {data.name || '—'}
            </h2>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 flex-shrink-0" />
              {data.fatherName ? `पिता/पति: ${data.fatherName}` : '—'}
            </p>

            {/* Scheme + district tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${s.badge}`}>
                {s.label} · {data.schemeName}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700 border border-slate-300/60">
                <MapPin className="w-3 h-3" />
                {data.district}
              </span>
            </div>
          </div>

          {/* Labharthi ID box */}
          <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0">
            <p className="text-xs text-slate-500 uppercase tracking-wider">लाभार्थी संख्या</p>
            <p className="text-sm font-mono font-semibold text-orange-600 bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg tracking-wider">
              {data.beneficiaryId || '—'}
            </p>
          </div>
        </div>

        {/* Labharthi ID — mobile */}
        <div className="md:hidden mt-4 flex items-center gap-2 p-3 rounded-xl bg-orange-100 border border-orange-200">
          <p className="text-xs text-slate-500">लाभार्थी संख्या:</p>
          <p className="text-sm font-mono font-semibold text-orange-600 tracking-wider">{data.beneficiaryId || '—'}</p>
        </div>

        <div className="border-t border-slate-200 mt-5 mb-5" />

        {/* Detail grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
          {[
            { icon: <Calendar className="w-3.5 h-3.5" />, label: 'जन्म तिथि / DOB',        value: data.dob || '—' },
            { icon: <CreditCard className="w-3.5 h-3.5" />, label: 'खाता नंबर / Account',   value: data.accountNo || '—' },
            { icon: <Hash className="w-3.5 h-3.5" />,       label: 'SSPMIS ID',              value: data.sspmisId || '—' },
            { icon: <Fingerprint className="w-3.5 h-3.5" />,label: 'आधार DOB',               value: data.dobAadhaar || '—' },
          ].map((row, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                {row.icon}
                {row.label}
              </div>
              <p className="text-sm font-mono text-slate-800 truncate" title={row.value}>{row.value}</p>
            </div>
          ))}
        </div>

        {/* Aadhaar no if available */}
        {data.aadhaarNo && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-white/80 border border-slate-300/60">
            <BadgeInfo className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <p className="text-xs text-slate-500">आधार नंबर:</p>
            <p className="text-sm font-mono text-slate-700 tracking-widest">{data.aadhaarNo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
