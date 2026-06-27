'use client';

import { MapPin, ChevronRight } from 'lucide-react';
import type { PensionData } from '@/lib/types';

interface Props { data: PensionData; }

export default function LocationCard({ data }: Props) {
  const crumbs = [
    { label: 'Bihar', sub: 'राज्य' },
    { label: data.district, sub: 'जिला' },
    { label: data.block, sub: 'ब्लॉक' },
    { label: data.panchayat, sub: 'पंचायत' },
    { label: data.village, sub: 'ग्राम/वार्ड' },
  ].filter((c) => c.label);

  return (
    <div
      className="rounded-2xl p-5 animate-fade-in-up"
      style={{
        background: 'var(--color-canvas)',
        border: '1px solid var(--color-hairline)',
        boxShadow: 'var(--shadow-card)',
        animationDelay: '280ms',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}
        >
          <MapPin className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>पता / Location</h3>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Residential Address</p>
        </div>
      </div>

      {/* Breadcrumb path */}
      <div className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <span
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={
                  i === crumbs.length - 1
                    ? { background: '#fff7ed', color: 'var(--color-primary)', border: '1px solid #fed7aa' }
                    : { background: 'var(--color-surface-soft)', color: 'var(--color-body)', border: '1px solid var(--color-hairline)' }
                }
              >
                {crumb.label || '—'}
              </span>
              <span className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>{crumb.sub}</span>
            </div>
            {i < crumbs.length - 1 && (
              <ChevronRight className="w-3 h-3 mt-[-10px]" style={{ color: 'var(--color-muted-soft)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
