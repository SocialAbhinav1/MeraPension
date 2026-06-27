'use client';

import { ShieldCheck, IndianRupee, Calendar, CheckCircle2, Clock, XCircle, Lock, HelpCircle, Activity } from 'lucide-react';
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

  const splitStatus = (status: string) => {
    const parts = status.split(' — ');
    return { title: parts[0], desc: parts[1] || '' };
  };

  const curr = splitStatus(data.currentStatusClean || '—');

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* ── Section 1: Overall Status Card ─────────────────── */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300"
        style={{
          background: t.bg,
          border: `1px solid ${t.border}`,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Decorative left accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: t.borderL }} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm" style={{ background: '#fff', border: `1px solid ${t.border}` }}>
              <ShieldCheck className="w-5 h-5" style={{ color: t.borderL }} />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
                वर्तमान स्थिति / Current Status
              </h2>
              {data.currentStatusLastUpdate && (
                <div className="flex items-center gap-1.5 text-[10px] mt-1 font-medium" style={{ color: 'var(--color-muted-soft)' }}>
                  <Calendar className="w-3 h-3" />
                  <span>अपडेट: {data.currentStatusLastUpdate}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 shadow-sm w-fit" style={{ background: '#fff', borderColor: t.border, color: t.label }}>
             <span className="relative flex w-1.5 h-1.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: t.dot }} />
               <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{ background: t.dot }} />
             </span>
             {curr.title}
          </div>
        </div>

        {curr.desc && (
          <div className="bg-white/60 p-4 rounded-xl mt-2 ml-0 sm:ml-12" style={{ border: `1px solid ${t.border}` }}>
            <p className="text-sm devanagari leading-relaxed" style={{ color: 'var(--color-ink)' }}>
              {curr.desc}
            </p>
          </div>
        )}
      </div>

      {/* ── Section 2: Recent Payment Activity ────────────────── */}
      {recent.length > 0 && (
        <div className="rounded-2xl p-5 transition-all duration-300" style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-surface-soft)', border: '1px solid var(--color-hairline)' }}>
              <IndianRupee className="w-4 h-4" style={{ color: 'var(--color-muted)' }} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
              हाल के भुगतान / Recent Payments
            </h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {recent.map((pm, i) => {
              const pm_t = THEME[pm.badgeType];
              const pm_curr = splitStatus(pm.status);
              return (
                <div key={i} className="flex gap-4 p-4 rounded-xl border transition-colors hover:shadow-sm" style={{ borderColor: pm_t.border, background: pm_t.bg }}>
                  <div className="mt-0.5 bg-white rounded-full p-1.5 shadow-sm border h-fit" style={{ borderColor: pm_t.border }}>
                    {PAY_ICON[pm.badgeType]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-sm devanagari" style={{ color: pm_t.label }}>
                        {pm_curr.title}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--color-ink)' }}>
                        {pm.month}
                      </span>
                    </div>
                    {pm_curr.desc && (
                      <p className="text-xs leading-relaxed devanagari mt-1.5" style={{ color: 'var(--color-body)' }}>
                        {pm_curr.desc}
                      </p>
                    )}
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
