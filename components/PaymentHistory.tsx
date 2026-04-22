'use client';

import { Banknote, CheckCircle2, Clock, XCircle, HelpCircle, Calendar, CreditCard, Hash } from 'lucide-react';
import type { BadgeType, PaymentMonth, PaymentRecord, PensionData } from '@/lib/types';

interface Props {
  data: PensionData;
  financialYear: string;
}

function PayStatusIcon({ type }: { type: BadgeType }) {
  if (type === 'success') return <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
  if (type === 'warning') return <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />;
  if (type === 'danger')  return <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />;
  return <HelpCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />;
}

const BADGE_CLASS: Record<BadgeType, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger:  'badge-danger',
  locked:  'badge-locked',
  info:    'badge-info',
  neutral: 'badge-neutral',
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
    <div className="flex flex-col gap-3 px-6 py-5 border-b border-slate-200">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm font-bold text-slate-800 tracking-wide">
          अंतिम भुगतान की स्थिति
          <span className="text-slate-500 font-normal ml-1 text-xs">/ Recent Payment Summary</span>
        </p>
        {lastUpdate && (
          <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            अंतिम अपडेट: <span className="text-slate-800 font-semibold ml-0.5">{lastUpdate}</span>
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {months.map((pm, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${
              pm.badgeType === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : pm.badgeType === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : pm.badgeType === 'danger'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <PayStatusIcon type={pm.badgeType} />
            <div>
              <span className="font-bold devanagari">{pm.month}</span>
              <span className="text-xs ml-2 devanagari opacity-80">{pm.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Full payment history table ─────────────────────────────────────────────
function HistoryTable({ records }: { records: PaymentRecord[] }) {
  if (records.length === 0) return null;
  return (
    <div>
      <div className="px-6 py-3 border-b border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          पूर्ण भुगतान इतिहास / Full Payment History
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/80">
              {['माह/Month', 'स्थिति/Status', 'राशि/Amount', 'UTR No.', 'खाता/Account', 'बैंक/Bank'].map((h) => (
                <th key={h} className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((r, i) => (
              <tr
                key={i}
                className="hover:bg-slate-50 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${i * 40}ms` }}
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
                            <span className="text-sm font-semibold text-slate-800 devanagari">{fromM} से</span>
                            <span className="text-sm font-semibold text-slate-800 devanagari">{toM} तक</span>
                          </>
                        );
                      } else {
                        return <span className="text-sm font-semibold text-slate-800 devanagari">{fromM || r.fromMonth || '—'}</span>;
                      }
                    })()}
                  </div>
                </td>
                {/* Status */}
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <PayStatusIcon type={r.statusBadge} />
                      <span className="text-sm text-slate-800 devanagari leading-snug">{r.status}</span>
                    </div>
                    <span className={BADGE_CLASS[r.statusBadge]}>
                      {r.paymentType || '—'}
                    </span>
                  </div>
                </td>
                {/* Amount */}
                <td className="py-3 px-4">
                  <span className="text-sm font-semibold text-emerald-300 font-mono">
                    {r.amount ? `₹${r.amount}` : '—'}
                  </span>
                </td>
                {/* UTR */}
                <td className="py-3 px-4">
                  <span className="text-xs font-mono text-slate-500 select-all">{r.utrNo || '—'}</span>
                </td>
                {/* Account */}
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-mono text-slate-700">{r.creditAccountNo || '—'}</span>
                    <span className="text-xs text-slate-500 truncate max-w-[120px]">{r.accountHolderName || '—'}</span>
                  </div>
                </td>
                {/* Bank */}
                <td className="py-3 px-4">
                  <span className="text-xs text-slate-500">{r.creditBank || '—'}</span>
                </td>
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
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
        <Banknote className="w-6 h-6 text-slate-500" />
      </div>
      <p className="text-slate-500 text-sm devanagari">कोई भुगतान इतिहास उपलब्ध नहीं</p>
      <p className="text-slate-500 text-xs">No payment history for this period</p>
      {rawText && (
        <p className="text-xs text-slate-500 max-w-sm text-center px-4 mt-2 devanagari leading-relaxed">
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
    <div className="glass rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
            <Banknote className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">भुगतान इतिहास</h3>
            <p className="text-xs text-slate-500">Payment History</p>
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
        <div className="px-6 py-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 devanagari leading-relaxed">
            <span className="text-slate-500 font-medium">पोर्टल से मूल जानकारी: </span>
            {data.paymentStatusRaw ?? ''}
          </p>
        </div>
      )}
    </div>
  );
}
