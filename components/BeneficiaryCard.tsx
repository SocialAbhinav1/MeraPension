'use client';

import { User, MapPin, CreditCard, Hash, Calendar, Fingerprint, BadgeInfo } from 'lucide-react';
import type { PensionData } from '@/lib/types';

interface Props { data: PensionData }

const SCHEME_COLORS: Record<PensionData['schemeType'], {
  gradientFrom: string; gradientTo: string;
  badge: { bg: string; text: string; border: string };
  label: string;
  accentBar: string;
}> = {
  'old-age':  {
    gradientFrom: '#f59e0b', gradientTo: '#ea580c',
    badge: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
    label: 'वृद्धा पेंशन',
    accentBar: 'linear-gradient(90deg, #f59e0b, #ea580c)',
  },
  'widow':    {
    gradientFrom: '#ec4899', gradientTo: '#f43f5e',
    badge: { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
    label: 'विधवा पेंशन',
    accentBar: 'linear-gradient(90deg, #ec4899, #f43f5e)',
  },
  'disabled': {
    gradientFrom: '#3b82f6', gradientTo: '#6366f1',
    badge: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
    label: 'दिव्यांग पेंशन',
    accentBar: 'linear-gradient(90deg, #3b82f6, #6366f1)',
  },
  'other':    {
    gradientFrom: '#8b5cf6', gradientTo: '#7c3aed',
    badge: { bg: '#faf5ff', text: '#5b21b6', border: '#ddd6fe' },
    label: 'पेंशन',
    accentBar: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
  },
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
    <div className="passbook-cover animate-fade-in-up mt-8">
      {/* Scheme accent bar */}
      <div style={{ height: '6px', background: s.accentBar }} />

      <div className="p-6 md:p-8">
        {/* Top row — avatar + name */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-white font-bold text-2xl md:text-3xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${s.gradientFrom}, ${s.gradientTo})`,
                boxShadow: `0 8px 24px ${s.gradientFrom}40`,
              }}
            >
              {getInitials(data.name)}
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <h2
                className="text-3xl md:text-4xl font-display text-ink"
                style={{ color: 'var(--color-ink)' }}
              >
                {data.name || '—'}
              </h2>
              <p className="text-sm md:text-base mt-1 flex items-center gap-1.5" style={{ color: 'var(--color-muted)' }}>
                <User className="w-4 h-4 flex-shrink-0" />
                {data.fatherName ? `पिता/पति: ${data.fatherName}` : '—'}
              </p>

              {/* Scheme badge */}
              <div className="mt-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{ background: s.badge.bg, color: s.badge.text, borderColor: s.badge.border }}
                >
                  {s.label} · {data.schemeName}
                </span>
              </div>
            </div>
          </div>

          {/* Beneficiary ID — Passbook style stamp */}
          <div className="flex flex-col md:items-end gap-1 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l w-full md:w-auto md:pl-6" style={{ borderColor: 'var(--color-hairline-soft)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>लाभार्थी संख्या</p>
            <p
              className="text-lg md:text-xl font-mono font-bold tracking-widest mt-1"
              style={{ color: 'var(--color-ink)' }}
            >
              {data.beneficiaryId || '—'}
            </p>
          </div>
        </div>

        <div className="my-6" style={{ borderTop: '2px dashed var(--color-hairline-soft)' }} />

        {/* Detail grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
          {[
            { icon: <Calendar className="w-4 h-4" />,   label: 'जन्म तिथि / DOB',      value: data.dob || '—' },
            { icon: <CreditCard className="w-4 h-4" />, label: 'खाता नंबर / Account',  value: data.accountNo || '—' },
            { icon: <Hash className="w-4 h-4" />,       label: 'SSPMIS ID',             value: data.sspmisId || '—' },
            { icon: <Fingerprint className="w-4 h-4" />,label: 'आधार DOB',              value: data.dobAadhaar || '—' },
          ].map((row, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                {row.icon}
                {row.label}
              </div>
              <p className="text-sm font-mono font-medium truncate" style={{ color: 'var(--color-ink)' }} title={row.value}>{row.value}</p>
            </div>
          ))}
        </div>

        {/* Aadhaar no if available */}
        {data.aadhaarNo && (
          <div
            className="mt-6 flex items-center justify-between p-4 rounded-xl border border-dashed"
            style={{ background: 'var(--color-canvas)', borderColor: 'var(--color-hairline)' }}
          >
            <div className="flex items-center gap-2">
              <BadgeInfo className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-muted)' }} />
              <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>आधार नंबर (Aadhaar):</p>
            </div>
            <p className="text-base font-mono font-bold tracking-widest" style={{ color: 'var(--color-ink)' }}>{data.aadhaarNo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
