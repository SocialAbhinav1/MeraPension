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
    <div
      className="rounded-2xl overflow-hidden animate-fade-in-up"
      style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Scheme accent bar */}
      <div style={{ height: '3px', background: s.accentBar }} />

      <div className="p-6 md:p-8">
        {/* Top row — avatar + name + IDs */}
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${s.gradientFrom}, ${s.gradientTo})`,
              boxShadow: `0 4px 16px ${s.gradientFrom}40`,
            }}
          >
            {getInitials(data.name)}
          </div>

          <div className="flex-1 min-w-0">
            <h2
              className="text-xl md:text-2xl font-bold tracking-wide"
              style={{ color: 'var(--color-ink)', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {data.name || '—'}
            </h2>
            <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: 'var(--color-muted)' }}>
              <User className="w-3.5 h-3.5 flex-shrink-0" />
              {data.fatherName ? `पिता/पति: ${data.fatherName}` : '—'}
            </p>

            {/* Scheme + district badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ background: s.badge.bg, color: s.badge.text, borderColor: s.badge.border }}
              >
                {s.label} · {data.schemeName}
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'var(--color-surface-soft)', color: 'var(--color-body)', border: '1px solid var(--color-hairline)' }}
              >
                <MapPin className="w-3 h-3" />
                {data.district}
              </span>
            </div>
          </div>

          {/* Labharthi ID — desktop */}
          <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0">
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-muted-soft)' }}>लाभार्थी संख्या</p>
            <p
              className="text-sm font-mono font-semibold px-3 py-1.5 rounded-lg tracking-wider"
              style={{ background: '#fff7ed', color: 'var(--color-primary)', border: '1px solid #fed7aa' }}
            >
              {data.beneficiaryId || '—'}
            </p>
          </div>
        </div>

        {/* Labharthi ID — mobile */}
        <div className="md:hidden mt-4 flex items-center gap-2 p-3 rounded-xl"
          style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>लाभार्थी संख्या:</p>
          <p className="text-sm font-mono font-semibold tracking-wider" style={{ color: 'var(--color-primary)' }}>{data.beneficiaryId || '—'}</p>
        </div>

        <div className="my-5" style={{ borderTop: '1px solid var(--color-hairline-soft)' }} />

        {/* Detail grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
          {[
            { icon: <Calendar className="w-3.5 h-3.5" />,   label: 'जन्म तिथि / DOB',      value: data.dob || '—' },
            { icon: <CreditCard className="w-3.5 h-3.5" />, label: 'खाता नंबर / Account',  value: data.accountNo || '—' },
            { icon: <Hash className="w-3.5 h-3.5" />,       label: 'SSPMIS ID',             value: data.sspmisId || '—' },
            { icon: <Fingerprint className="w-3.5 h-3.5" />,label: 'आधार DOB',              value: data.dobAadhaar || '—' },
          ].map((row, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
                {row.icon}
                {row.label}
              </div>
              <p className="text-sm font-mono truncate" style={{ color: 'var(--color-body)' }} title={row.value}>{row.value}</p>
            </div>
          ))}
        </div>

        {/* Aadhaar no if available */}
        {data.aadhaarNo && (
          <div
            className="mt-4 flex items-center gap-2 p-3 rounded-xl"
            style={{ background: 'var(--color-surface-soft)', border: '1px solid var(--color-hairline)' }}
          >
            <BadgeInfo className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-muted)' }} />
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>आधार नंबर:</p>
            <p className="text-sm font-mono tracking-widest" style={{ color: 'var(--color-body)' }}>{data.aadhaarNo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
