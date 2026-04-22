'use client';

import { MapPin, ChevronRight } from 'lucide-react';
import type { PensionData } from '@/lib/types';

interface Props {
  data: PensionData;
}

export default function LocationCard({ data }: Props) {
  const crumbs = [
    { label: 'Bihar', sub: 'राज्य' },
    { label: data.district, sub: 'जिला' },
    { label: data.block, sub: 'ब्लॉक' },
    { label: data.panchayat, sub: 'पंचायत' },
    { label: data.village, sub: 'ग्राम/वार्ड' },
  ].filter((c) => c.label);

  return (
    <div className="glass rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: '280ms' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">पता / Location</h3>
          <p className="text-xs text-slate-500">Residential Address</p>
        </div>
      </div>

      {/* Breadcrumb path */}
      <div className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  i === crumbs.length - 1
                    ? 'bg-orange-500/15 text-orange-300 border border-orange-500/20'
                    : 'bg-white text-slate-700 border border-slate-300/60'
                }`}
              >
                {crumb.label || '—'}
              </span>
              <span className="text-slate-500 text-[10px] mt-0.5">{crumb.sub}</span>
            </div>
            {i < crumbs.length - 1 && (
              <ChevronRight className="w-3 h-3 text-slate-500 mt-[-10px]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
