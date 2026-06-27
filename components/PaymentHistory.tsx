'use client';

import { Banknote, CheckCircle2, Clock, XCircle, HelpCircle, Calendar, CreditCard } from 'lucide-react';
import type { BadgeType, PaymentMonth, PaymentRecord, PensionData } from '@/lib/types';

interface Props {
  data: PensionData;
  financialYear: string;
}

function PayStatusIcon({ type }: { type: BadgeType }) {
  if (type === 'success') return <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#16a34a' }} />;
  if (type === 'warning') return <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#d97706' }} />;
  if (type === 'danger')  return <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#dc2626' }} />;
  return <HelpCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-muted-soft)' }} />;
}

const BADGE_CLASS: Record<BadgeType, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger:  'badge-danger',
  locked:  'badge-locked',
  info:    'badge-info',
  neutral: 'badge-neutral',
};

const PILL_STYLE: Record<BadgeType, { bg: string; border: string; text: string }> = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
  danger:  { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b' },
  locked:  { bg: '#faf5ff', border: '#d8b4fe', text: '#5b21b6' },
  info:    { bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1' },
  neutral: { bg: 'var(--color-surface-soft)', border: 'var(--color-hairline)', text: 'var(--color-muted)' },
};

const HINDI_MONTHS: Record<string, string> = {
  jan: 'जनवरी', january: 'जनवरी', 'जनवरी': 'जनवरी',
  feb: 'फ़रवरी', february: 'फ़रवरी', 'फ़रवरी': 'फ़रवरी', 'फरवरी': 'फ़रवरी',
  mar: 'मार्च', march: 'मार्च', 'मार्च': 'मार्च',
  apr: 'अप्रैल', april: 'अप्रैल', 'अप्रैल': 'अप्रैल',
  may: 'मई', 'मई': 'मई',
  jun: 'जून', june: 'जून', 'जून': 'जून',
  jul: 'जुलाई', july: 'जुलाई', 'जुलाई': 'जुलाई',
  aug: 'अगस्त', august: 'अगस्त', 'अगस्त': 'अगस्त',
  sep: 'सितंबर', september: 'सितंबर', 'सितंबर': 'सितंबर',
  oct: 'अक्टूबर', october: 'अक्टूबर', 'अक्टूबर': 'अक्टूबर',
  nov: 'नवंबर', november: 'नवंबर', 'नवंबर': 'नवंबर',
  dec: 'दिसंबर', december: 'दिसंबर', 'दिसंबर': 'दिसंबर',
};

function formatMonth(val: string): string {
  if (!val) return '';
  const m = val.match(/([A-Za-zऀ-ॿ\u0900-\u097F]+)[-\s]?(\d{4})/);
  if (m) {
    const rawMonth = m[1].toLowerCase();
    const year = m[2];
    const hindiMonth = HINDI_MONTHS[rawMonth] || m[1];
    return `${hindiMonth} ${year}`;
  }
  return val;
}

// ─── Summary strip ──────────────────────────────────────────────────────────
function SummaryStrip({ months, lastUpdate }: { months: PaymentMonth[]; lastUpdate: string }) {
  if (months.length === 0) return null;
  return (
    <div className="flex flex-col gap-3 px-6 py-5" style={{ borderBottom: '1px solid var(--color-hairline-soft)' }}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-ink)' }}>
          अंतिम भुगतान की स्थिति
          <span className="font-normal ml-1 text-xs" style={{ color: 'var(--color-muted)' }}>/ Recent Payment Summary</span>
        </p>
        {lastUpdate && (
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
            <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--color-muted-soft)' }} />
            अंतिम अपडेट: <span className="font-semibold ml-0.5" style={{ color: 'var(--color-body)' }}>{lastUpdate}</span>
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2.5">
        {months.map((pm, i) => {
          const ps = PILL_STYLE[pm.badgeType];
          return (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium"
              style={{ background: ps.bg, borderColor: ps.border, color: ps.text }}
            >
              <PayStatusIcon type={pm.badgeType} />
              <div>
                <span className="font-bold devanagari">{pm.month}</span>
                <span className="text-xs ml-2 devanagari opacity-80">{pm.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HistoryTable({ records }: { records: PaymentRecord[] }) {
  if (records.length === 0) return null;
  
  const hasAnyBank = records.some(r => r.creditBank && r.creditBank !== '—');

  return (
    <div>
      <div className="px-6 py-3" style={{ borderBottom: '1px solid var(--color-hairline-soft)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
          पूर्ण भुगतान इतिहास / Full Payment History
        </p>
      </div>
      
      {/* ─── Mobile Card View (hidden on desktop) ─── */}
      <div className="block md:hidden divide-y" style={{ borderColor: 'var(--color-hairline-soft)' }}>
        {records.map((r, i) => {
          const fromM = formatMonth(r.fromMonth);
          const toM = formatMonth(r.toMonth);
          const isRange = fromM && toM && fromM !== toM;
          
          return (
            <div key={i} className="p-4 flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
              {/* Header: Month & Amount */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-muted-soft)' }}>माह / Month</span>
                  {isRange ? (
                    <span className="text-sm font-bold devanagari" style={{ color: 'var(--color-ink)' }}>{fromM} से {toM} तक</span>
                  ) : (
                    <span className="text-sm font-bold devanagari" style={{ color: 'var(--color-ink)' }}>{fromM || r.fromMonth || '—'}</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest font-bold block" style={{ color: 'var(--color-muted-soft)' }}>राशि / Amount</span>
                  <span className="text-base font-bold font-mono" style={{ color: '#15803d' }}>
                    {r.amount ? `₹${r.amount}` : '—'}
                  </span>
                </div>
              </div>

              {/* Body: Clean Key-Value List */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-dashed" style={{ borderColor: 'var(--color-hairline)' }}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-soft)' }}>UTR No.</span>
                  <span className="font-mono font-bold" style={{ color: 'var(--color-body)' }}>{r.utrNo && r.utrNo !== '—' ? r.utrNo : '—'}</span>
                </div>
                {r.paymentDate && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-soft)' }}>Date</span>
                    <span className="font-mono font-bold" style={{ color: '#059669' }}>{r.paymentDate}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-soft)' }}>A/C No.</span>
                  <span className="font-mono font-bold" style={{ color: 'var(--color-body)' }}>{r.creditAccountNo || '—'}</span>
                </div>
                {hasAnyBank && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-soft)' }}>Bank</span>
                    <span className="font-medium truncate max-w-[150px] text-right" style={{ color: 'var(--color-muted)' }}>{r.creditBank || '—'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Desktop Table View (hidden on mobile) ─── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-hairline)', background: 'var(--color-surface-soft)' }}>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-left whitespace-nowrap" style={{ color: 'var(--color-muted)' }}>माह/Month</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-left whitespace-nowrap" style={{ color: 'var(--color-muted)' }}>राशि/Amount</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-left whitespace-nowrap" style={{ color: 'var(--color-muted)' }}>UTR / भुगतान तिथि</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-left whitespace-nowrap" style={{ color: 'var(--color-muted)' }}>खाता/Account</th>
              {hasAnyBank && (
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-left whitespace-nowrap" style={{ color: 'var(--color-muted)' }}>बैंक/Bank</th>
              )}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr
                key={i}
                className="transition-colors animate-fade-in-up"
                style={{
                  borderBottom: '1px solid var(--color-hairline-soft)',
                  animationDelay: `${i * 40}ms`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-soft)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Month range */}
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-0.5">
                    {(() => {
                      const fromM = formatMonth(r.fromMonth);
                      const toM = formatMonth(r.toMonth);
                      if (fromM && toM && fromM !== toM) {
                        return (
                          <>
                            <span className="text-sm font-semibold devanagari" style={{ color: 'var(--color-ink)' }}>{fromM} से</span>
                            <span className="text-sm font-semibold devanagari" style={{ color: 'var(--color-ink)' }}>{toM} तक</span>
                          </>
                        );
                      } else {
                        return <span className="text-sm font-semibold devanagari" style={{ color: 'var(--color-ink)' }}>{fromM || r.fromMonth || '—'}</span>;
                      }
                    })()}
                  </div>
                </td>
                
                {/* Amount */}
                <td className="py-3 px-4">
                  <span className="text-sm font-bold font-mono" style={{ color: '#15803d' }}>
                    {r.amount ? `₹${r.amount}` : '—'}
                  </span>
                </td>
                
                {/* UTR & Payment Date */}
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono select-all font-semibold" style={{ color: 'var(--color-body)' }}>
                      {r.utrNo && r.utrNo !== '—' ? r.utrNo : '—'}
                    </span>
                    {r.paymentDate && (
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-muted-soft)' }}>भुगतान तिथि / Date</span>
                        <span className="text-xs font-mono font-bold" style={{ color: '#059669' }}>{r.paymentDate}</span>
                      </div>
                    )}
                  </div>
                </td>
                
                {/* Account */}
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-body)' }}>{r.creditAccountNo || '—'}</span>
                    <span className="text-xs truncate max-w-[120px] font-medium" style={{ color: 'var(--color-muted)' }}>{r.accountHolderName || '—'}</span>
                  </div>
                </td>
                
                {/* Bank */}
                {hasAnyBank && (
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{r.creditBank || '—'}</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyHistory({ rawText }: { rawText?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'var(--color-surface-soft)', border: '1px solid var(--color-hairline)' }}
      >
        <Banknote className="w-6 h-6" style={{ color: 'var(--color-muted)' }} />
      </div>
      <p className="text-sm devanagari" style={{ color: 'var(--color-muted)' }}>कोई भुगतान इतिहास उपलब्ध नहीं</p>
      <p className="text-xs" style={{ color: 'var(--color-muted-soft)' }}>No payment history for this period</p>
      {rawText && (
        <p className="text-xs max-w-sm text-center px-4 mt-2 devanagari leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          {rawText}
        </p>
      )}
    </div>
  );
}

export default function PaymentHistory({ data, financialYear }: Props) {
  const hasHistory = data.paymentHistory.length > 0;
  const hasMonths = data.paymentMonths.length > 0;

  return (
    <div
      className="rounded-2xl overflow-hidden animate-fade-in-up"
      style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        boxShadow: 'var(--shadow-card)',
        animationDelay: '200ms',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--color-hairline-soft)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
          >
            <Banknote className="w-4 h-4" style={{ color: '#16a34a' }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>भुगतान इतिहास</h3>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Payment History</p>
          </div>
        </div>
        <span className="badge-info">{financialYear}</span>
      </div>

      {/* Recent summary pills */}
      {hasMonths && (
        <SummaryStrip months={data.paymentMonths} lastUpdate={data.paymentStatusLastUpdate} />
      )}

      {/* Full history table or empty state */}
      {hasHistory ? (
        <HistoryTable records={data.paymentHistory} />
      ) : (
        !hasMonths && <EmptyHistory rawText={data.paymentStatusRaw ?? ''} />
      )}

      {/* If we have summary but no history table, show a note */}
      {hasMonths && !hasHistory && (
        <div className="px-6 py-4" style={{ borderTop: '1px solid var(--color-hairline-soft)' }}>
          <p className="text-xs devanagari leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            <span className="font-medium">पोर्टल से मूल जानकारी: </span>
            {data.paymentStatusRaw ?? ''}
          </p>
        </div>
      )}
    </div>
  );
}
