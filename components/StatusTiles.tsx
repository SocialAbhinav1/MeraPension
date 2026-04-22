'use client';

import {
  ShieldCheck, Fingerprint, Link2,
  CheckCircle2, XCircle, Clock, Lock, HelpCircle, Calendar,
} from 'lucide-react';
import type { BadgeType, PensionData } from '@/lib/types';

interface Props { data: PensionData }

function StatusDot({ type }: { type: BadgeType }) {
  const colors: Record<BadgeType, string> = {
    success: 'bg-emerald-400', warning: 'bg-amber-400',
    danger:  'bg-red-400',     locked:  'bg-violet-400',
    info:    'bg-sky-400',     neutral: 'bg-slate-500',
  };
  return (
    <span className="relative flex w-2.5 h-2.5 flex-shrink-0">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[type]} opacity-40`} />
      <span className={`relative inline-flex rounded-full w-2.5 h-2.5 ${colors[type]}`} />
    </span>
  );
}

const BADGE_CONFIG: Record<BadgeType, {
  bg: string; border: string; text: string; icon: React.ReactNode;
  label: string; labelHi: string;
}> = {
  success: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={1.8} />,
    label: 'Verified / Active', labelHi: 'सत्यापित / सक्रिय' },
  warning: { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700',
    icon: <Clock className="w-5 h-5 text-amber-600" strokeWidth={1.8} />,
    label: 'Processing', labelHi: 'प्रक्रिया में है' },
  danger:  { bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-700',
    icon: <XCircle className="w-5 h-5 text-red-600" strokeWidth={1.8} />,
    label: 'Not Verified', labelHi: 'सत्यापित नहीं' },
  locked:  { bg: 'bg-violet-100', border: 'border-violet-200', text: 'text-violet-700',
    icon: <Lock className="w-5 h-5 text-violet-600" strokeWidth={1.8} />,
    label: 'Locked', labelHi: 'लॉक किया गया' },
  info:    { bg: 'bg-sky-100', border: 'border-sky-200', text: 'text-sky-700',
    icon: <HelpCircle className="w-5 h-5 text-sky-600" strokeWidth={1.8} />,
    label: 'Info', labelHi: 'जानकारी' },
  neutral: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600',
    icon: <HelpCircle className="w-5 h-5 text-slate-500" strokeWidth={1.8} />,
    label: 'Unknown', labelHi: 'अज्ञात' },
};

function StatusCard({
  icon, titleHi, titleEn, statusHi, badge, lastUpdate, delay, extra,
}: {
  icon: React.ReactNode;
  titleHi: string;
  titleEn: string;
  statusHi: string;
  badge: BadgeType;
  lastUpdate?: string;
  delay?: string;
  extra?: React.ReactNode;
}) {
  const cfg = BADGE_CONFIG[badge];

  return (
    <div
      className={`${cfg.bg} border ${cfg.border} rounded-2xl p-5 flex flex-col gap-4 animate-fade-in-up`}
      style={{ animationDelay: delay }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
          {/* Title */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider leading-none mb-1">{titleEn}</p>
            <h3 className="text-sm font-semibold text-slate-800 devanagari leading-none">{titleHi}</h3>
          </div>
        </div>
        <StatusDot type={badge} />
      </div>

      {/* Badge label */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border self-start ${cfg.bg} ${cfg.border} ${cfg.text}`}>
        {cfg.icon}
        <span className="devanagari">{cfg.labelHi}</span>
      </div>

      {/* Status text — full, readable */}
      {statusHi && (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider">स्थिति विवरण / Status Detail</p>
          <p className="text-sm text-slate-800 devanagari leading-relaxed bg-slate-100 rounded-xl px-3 py-2.5 border border-slate-900/5">
            {statusHi}
          </p>
        </div>
      )}

      {/* Last updated */}
      {lastUpdate && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-900/5 pt-3">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>अंतिम अपडेट: <span className="text-slate-500 font-medium">{lastUpdate}</span></span>
        </div>
      )}

      {extra}
    </div>
  );
}

export default function StatusTiles({ data }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatusCard
        icon={<ShieldCheck className="w-5 h-5 text-orange-400" />}
        titleHi="पेंशन स्थिति"
        titleEn="Pension Status"
        statusHi={data.currentStatusClean}
        badge={data.currentStatusBadge}
        lastUpdate={data.currentStatusLastUpdate}
        delay="0ms"
      />
      <StatusCard
        icon={<Fingerprint className="w-5 h-5 text-emerald-400" />}
        titleHi="जीवन प्रमाण / eKYC"
        titleEn="Jeevan Praman Status"
        statusHi={data.jpStatusClean}
        badge={data.jpStatusBadge}
        lastUpdate={data.jpStatusLastUpdate}
        delay="80ms"
        extra={
          data.jpLastDate ? (
            <div className="flex flex-col gap-0.5 border-t border-slate-900/5 pt-3">
              <p className="text-xs text-slate-500">प्रमाणीकरण तिथि / Auth Date</p>
              <p className="text-sm font-semibold text-emerald-800 font-mono">{data.jpLastDate}</p>
            </div>
          ) : undefined
        }
      />
      <StatusCard
        icon={<Link2 className="w-5 h-5 text-sky-500" />}
        titleHi="आधार सीडिंग"
        titleEn="Aadhaar Seeding Status"
        statusHi={data.aadhaarSeedingStatus}
        badge={data.aadhaarSeedingBadge}
        delay="160ms"
      />
    </div>
  );
}
