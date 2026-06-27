'use client';

import { MapPin, ChevronRight } from 'lucide-react';
import type { PensionData } from '@/lib/types';

interface Props { data: PensionData; }

export default function LocationCard({ data }: Props) {
  const crumbs = [
    { label: data.district, sub: 'जिला / District' },
    { label: data.block, sub: 'ब्लॉक / Block' },
    { label: data.panchayat, sub: 'पंचायत / Panchayat' },
    { label: data.village, sub: 'ग्राम / Village' },
  ].filter((c) => c.label);

  return (
    <div
      className="passbook-cover mt-4 animate-fade-in-up"
      style={{ animationDelay: '300ms' }}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
            पता / Address
          </h3>
        </div>

        {/* Infographic Breadcrumb Path */}
        <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2">
          {crumbs.map((crumb, i) => (
            <div key={i} className="flex flex-row md:flex-col items-start md:items-center relative group">
              
              {/* Mobile Vertical Line */}
              {i < crumbs.length - 1 && (
                <div className="absolute left-2.5 top-6 bottom-[-16px] w-[2px] md:hidden" style={{ background: 'var(--color-hairline)' }} />
              )}
              
              <div className="flex items-center gap-4 md:gap-0 w-full md:w-auto">
                {/* Node Dot */}
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center relative z-10 flex-shrink-0"
                  style={{ background: i === crumbs.length - 1 ? 'var(--color-primary)' : 'var(--color-canvas)', border: `2px solid ${i === crumbs.length - 1 ? 'var(--color-primary)' : 'var(--color-hairline-soft)'}` }}
                >
                  {i === crumbs.length - 1 && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>

                {/* Text */}
                <div className="py-3 md:py-0 md:mt-3 flex flex-col md:items-center">
                  <span className="text-base font-bold devanagari" style={{ color: 'var(--color-ink)' }}>
                    {crumb.label || '—'}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--color-muted-soft)' }}>
                    {crumb.sub}
                  </span>
                </div>
              </div>

              {/* Desktop Horizontal Line */}
              {i < crumbs.length - 1 && (
                <div className="hidden md:block w-12 lg:w-20 h-[2px] mt-[-24px] ml-4" style={{ background: 'var(--color-hairline)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
