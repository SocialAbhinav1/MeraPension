'use client';

import { ShieldCheck, IndianRupee, Calendar, CheckCircle2, Clock, XCircle, Lock, HelpCircle } from 'lucide-react';
import type { BadgeType, PensionData } from '@/lib/types';

interface Props { data: PensionData }

const THEME: Record<BadgeType, {
  bg: string; border: string; borderL: string;
  dot: string; label: string; payBg: string; payBorder: string;
}> = {
  success: {
    bg: '#f0fdf4', border: '#bbf7d0', borderL: '#22c55e',
    dot: '#22c55e', label: '#15803d', payBg: 'var(--color-canvas)', payBorder: '#bbf7d0',
  },
  warning: {
    bg: '#fffbeb', border: '#fde68a', borderL: '#f59e0b',
    dot: '#f59e0b', label: '#92400e', payBg: 'var(--color-canvas)', payBorder: '#fde68a',
  },
  danger: {
    bg: '#fef2f2', border: '#fca5a5', borderL: '#ef4444',
    dot: '#ef4444', label: '#991b1b', payBg: 'var(--color-canvas)', payBorder: '#fca5a5',
  },
  locked: {
    bg: '#faf5ff', border: '#d8b4fe', borderL: '#8b5cf6',
    dot: '#8b5cf6', label: '#5b21b6', payBg: 'var(--color-canvas)', payBorder: '#d8b4fe',
  },
  info: {
    bg: '#f0f9ff', border: '#bae6fd', borderL: '#0ea5e9',
    dot: '#0ea5e9', label: '#0369a1', payBg: 'var(--color-canvas)', payBorder: '#bae6fd',
  },
  neutral: {
    bg: 'var(--color-surface-soft)', border: 'var(--color-hairline)', borderL: 'var(--color-muted)',
    dot: 'var(--color-muted)', label: 'var(--color-body)', payBg: 'var(--color-canvas)', payBorder: 'var(--color-hairline)',
  },
};

const PAY_ICON: Record<BadgeType, React.ReactNode> = {
  success: <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#22c55e' }} />,
  warning: <Clock        className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#f59e0b' }} />,
  danger:  <XCircle      className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#ef4444' }} />,
  locked:  <Lock         className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#8b5cf6' }} />,
  info:    <HelpCircle   className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#0ea5e9' }} />,
  neutral: <HelpCircle   className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-muted-soft)' }} />,
};

export default function QuickSummaryCard({ data }: Props) {
  const t = THEME[data.currentStatusBadge];
  const recent = data.paymentMonths.slice(0, 2);

  return (
    <div
      className="rounded-2xl overflow-hidden animate-fade-in-up mb-2"
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderLeft: `4px solid ${t.borderL}`,
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* ── Section 1: Pension Status ─────────────────── */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            {/* Pulsing dot */}
            <span className="relative flex w-2 h-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: t.dot }} />
              <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: t.dot }} />
            </span>
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
              पेंशन स्थिति / Pension Status
            </span>
          </div>
          {data.currentStatusLastUpdate && (
            <div className="flex items-center gap-1 text-[10px] flex-shrink-0" style={{ color: 'var(--color-muted-soft)' }}>
              <Calendar className="w-3 h-3" />
              <span>{data.currentStatusLastUpdate}</span>
            </div>
          )}
        </div>

        <p className="font-semibold text-lg md:text-xl devanagari leading-snug mt-1" style={{ color: t.label }}>
          {data.currentStatusClean || '—'}
        </p>
      </div>

      {/* ── Section 2: Recent Payments ────────────────── */}
      {recent.length > 0 && (
        <div className="border-t px-5 pt-3 pb-4" style={{ borderColor: `${t.border}` }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <IndianRupee className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-muted)' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
              हाल के भुगतान / Recent Payments
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {recent.map((pm, i) => {
              const pm_t = THEME[pm.badgeType];
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                  style={{ background: pm_t.payBg, border: `1px solid ${pm_t.payBorder}` }}
                >
                  {PAY_ICON[pm.badgeType]}
                  <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
                    <span className="text-xs font-bold devanagari whitespace-nowrap" style={{ color: 'var(--color-ink)' }}>
                      {pm.month}
                    </span>
                    <span className="text-xs font-medium devanagari leading-snug" style={{ color: pm_t.label }}>
                      {pm.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
