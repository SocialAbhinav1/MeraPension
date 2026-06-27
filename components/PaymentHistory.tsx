'use client';

import { Banknote, CheckCircle2, Clock, XCircle, HelpCircle, Calendar, Landmark } from 'lucide-react';
import type { BadgeType, PaymentMonth, PaymentRecord, PensionData } from '@/lib/types';

interface Props {
  data: PensionData;
  financialYear: string;
}

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

function PayStatusIcon({ type, className }: { type: BadgeType, className?: string }) {
  if (type === 'success') return <CheckCircle2 className={className} style={{ color: '#16a34a' }} />;
  if (type === 'warning') return <Clock className={className} style={{ color: '#d97706' }} />;
  if (type === 'danger')  return <XCircle className={className} style={{ color: '#dc2626' }} />;
  return <HelpCircle className={className} style={{ color: 'var(--color-muted-soft)' }} />;
}

// ─── Vertical Timeline ───────────────────────────────────────────────────────
function HistoryTimeline({ records }: { records: PaymentRecord[] }) {
  if (records.length === 0) return null;
  return (
    <div className="px-6 py-6 pb-8">
      {records.map((r, i) => {
        const isSuccess = r.statusBadge === 'success';
        const fromM = formatMonth(r.fromMonth) || r.fromMonth || '—';
        const toM = formatMonth(r.toMonth);
        const monthDisplay = (toM && toM !== fromM) ? `${fromM} - ${toM}` : fromM;
        
        return (
          <div key={i} className="timeline-node flex gap-5 mb-8 last:mb-0 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
            
            {/* Timeline Icon */}
            <div className="relative z-10 flex-shrink-0 mt-1">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center border-4"
                style={{ 
                  background: isSuccess ? '#f0fdf4' : 'var(--color-canvas)', 
                  borderColor: 'var(--color-canvas)',
                  boxShadow: '0 0 0 1px var(--color-hairline)'
                }}
              >
                <PayStatusIcon type={r.statusBadge} className="w-5 h-5" />
              </div>
            </div>

            {/* Passbook Entry Card */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl"
              style={{ background: 'var(--color-surface-soft)', border: '1px solid var(--color-hairline-soft)' }}>
              
              <div className="flex flex-col gap-1.5">
                <p className="text-lg font-bold devanagari" style={{ color: 'var(--color-ink)' }}>
                  {monthDisplay}
                </p>
                <p className="text-sm font-medium flex items-center gap-1.5" style={{ color: isSuccess ? '#15803d' : 'var(--color-muted)' }}>
                  {r.status}
                </p>
                
                {/* Bank Details */}
                {(r.creditAccountNo || r.creditBank) && (
                  <div className="flex items-center gap-2 mt-2 pt-2 text-xs" style={{ borderTop: '1px dashed var(--color-hairline)', color: 'var(--color-muted)' }}>
                    <Landmark className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-mono">A/C: {r.creditAccountNo || '—'}</span>
                    <span className="opacity-50">|</span>
                    <span className="truncate max-w-[150px]">{r.creditBank || '—'}</span>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="flex flex-col sm:items-end justify-center">
                {r.amount ? (
                  <p className="text-2xl font-bold font-mono tracking-tight" style={{ color: isSuccess ? '#15803d' : 'var(--color-ink)' }}>
                    ₹{r.amount}
                  </p>
                ) : (
                  <p className="text-xl font-bold" style={{ color: 'var(--color-muted-soft)' }}>—</p>
                )}
                {r.utrNo && (
                  <p className="text-xs font-mono mt-1" style={{ color: 'var(--color-muted-soft)' }}>UTR: {r.utrNo}</p>
                )}
              </div>
            </div>
            
          </div>
        );
      })}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyHistory({ rawText }: { rawText?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'var(--color-surface-soft)', border: '1px dashed var(--color-hairline)' }}
      >
        <Banknote className="w-6 h-6 opacity-40" />
      </div>
      <p className="text-lg font-bold devanagari" style={{ color: 'var(--color-muted)' }}>कोई भुगतान इतिहास नहीं</p>
      <p className="text-sm" style={{ color: 'var(--color-muted-soft)' }}>No payment history for this period</p>
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
      className="passbook-cover mt-8 animate-fade-in-up"
      style={{ animationDelay: '200ms' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ background: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-hairline)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--color-feature-gold)', color: 'var(--color-feature-gold-on)' }}
          >
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold font-display tracking-wide" style={{ color: 'var(--color-ink)' }}>भुगतान इतिहास</h3>
            <p className="text-xs uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--color-muted)' }}>Payment Timeline</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>वर्ष / Year</span>
          <span className="px-3 py-1 rounded-lg text-sm font-bold font-mono" style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)' }}>
            {financialYear}
          </span>
        </div>
      </div>

      {/* Full history timeline or empty state */}
      {hasHistory ? (
        <HistoryTimeline records={data.paymentHistory} />
      ) : (
        <EmptyHistory rawText={data.paymentStatusRaw ?? ''} />
      )}
    </div>
  );
}
