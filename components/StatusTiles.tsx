'use client';

import {
  ShieldCheck, Fingerprint, Link2,
  CheckCircle2, XCircle, Clock, Lock, HelpCircle, Calendar,
} from 'lucide-react';
import type { BadgeType, PensionData } from '@/lib/types';

interface Props { data: PensionData }

const BADGE_CFG: Record<BadgeType, {
  bg: string; border: string; iconBg: string;
  textColor: string; label: string; labelHi: string;
  dotColor: string;
  icon: React.ReactNode;
}> = {
  success: {
    bg: '#f0fdf4', border: '#bbf7d0', iconBg: '#dcfce7', textColor: '#15803d',
    label: 'Verified / Active', labelHi: 'सत्यापित / सक्रिय', dotColor: '#22c55e',
    icon: <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} strokeWidth={1.8} />,
  },
  warning: {
    bg: '#fffbeb', border: '#fde68a', iconBg: '#fef9c3', textColor: '#92400e',
    label: 'Processing', labelHi: 'प्रक्रिया में है', dotColor: '#f59e0b',
    icon: <Clock className="w-5 h-5" style={{ color: '#d97706' }} strokeWidth={1.8} />,
  },
  danger: {
    bg: '#fef2f2', border: '#fca5a5', iconBg: '#fee2e2', textColor: '#991b1b',
    label: 'Not Verified', labelHi: 'सत्यापित नहीं', dotColor: '#ef4444',
    icon: <XCircle className="w-5 h-5" style={{ color: '#dc2626' }} strokeWidth={1.8} />,
  },
  locked: {
    bg: '#faf5ff', border: '#d8b4fe', iconBg: '#ede9fe', textColor: '#5b21b6',
    label: 'Locked', labelHi: 'लॉक किया गया', dotColor: '#8b5cf6',
    icon: <Lock className="w-5 h-5" style={{ color: '#7c3aed' }} strokeWidth={1.8} />,
  },
  info: {
    bg: '#f0f9ff', border: '#bae6fd', iconBg: '#e0f2fe', textColor: '#0369a1',
    label: 'Info', labelHi: 'जानकारी', dotColor: '#0ea5e9',
    icon: <HelpCircle className="w-5 h-5" style={{ color: '#0284c7' }} strokeWidth={1.8} />,
  },
  neutral: {
    bg: 'var(--color-surface-soft)', border: 'var(--color-hairline)', iconBg: 'var(--color-surface-card)',
    textColor: 'var(--color-muted)', label: 'Unknown', labelHi: 'अज्ञात', dotColor: 'var(--color-muted)',
    icon: <HelpCircle className="w-5 h-5" style={{ color: 'var(--color-muted-soft)' }} strokeWidth={1.8} />,
  },
};

function StatusDot({ type }: { type: BadgeType }) {
  const cfg = BADGE_CFG[type];
  return (
    <span className="relative flex w-2.5 h-2.5 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ background: cfg.dotColor }} />
      <span className="relative inline-flex rounded-full w-2.5 h-2.5" style={{ background: cfg.dotColor }} />
    </span>
  );
}

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
  const cfg = BADGE_CFG[badge];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 animate-fade-in-up"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: 'var(--shadow-card)',
        animationDelay: delay,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: cfg.iconBg, border: `1px solid ${cfg.border}` }}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider leading-none mb-1" style={{ color: 'var(--color-muted-soft)' }}>{titleEn}</p>
            <h3 className="text-sm font-semibold devanagari leading-snug" style={{ color: 'var(--color-ink)' }}>{titleHi}</h3>
          </div>
        </div>
        <StatusDot type={badge} />
      </div>

      {/* Badge label */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border self-start"
        style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.textColor }}
      >
        {cfg.icon}
        <span className="devanagari">{cfg.labelHi}</span>
      </div>

      {/* Status text */}
      {statusHi && (
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-muted-soft)' }}>स्थिति विवरण / Status Detail</p>
          <p
            className="text-sm devanagari leading-relaxed px-3 py-2.5 rounded-xl"
            style={{ background: 'var(--color-canvas)', color: 'var(--color-body)', border: '1px solid rgba(0,0,0,0.04)' }}
          >
            {statusHi}
          </p>
        </div>
      )}

      {/* Last updated */}
      {lastUpdate && (
        <div className="flex items-center gap-1.5 text-xs pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', color: 'var(--color-muted)' }}>
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>अंतिम अपडेट: <span className="font-medium">{lastUpdate}</span></span>
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
        icon={<ShieldCheck className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />}
        titleHi="पेंशन स्थिति"
        titleEn="Pension Status"
        statusHi={data.currentStatusClean}
        badge={data.currentStatusBadge}
        lastUpdate={data.currentStatusLastUpdate}
        delay="0ms"
      />
      <StatusCard
        icon={<Fingerprint className="w-5 h-5" style={{ color: '#059669' }} />}
        titleHi="जीवन प्रमाण / eKYC"
        titleEn="Jeevan Praman Status"
        statusHi={data.jpStatusClean}
        badge={data.jpStatusBadge}
        lastUpdate={data.jpStatusLastUpdate}
        delay="80ms"
        extra={
          data.jpLastDate ? (
            <div className="flex flex-col gap-0.5 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>प्रमाणीकरण तिथि / Auth Date</p>
              <p className="text-sm font-semibold font-mono" style={{ color: '#15803d' }}>{data.jpLastDate}</p>
            </div>
          ) : undefined
        }
      />
      <StatusCard
        icon={<Link2 className="w-5 h-5" style={{ color: '#0284c7' }} />}
        titleHi="आधार सीडिंग"
        titleEn="Aadhaar Seeding Status"
        statusHi={data.aadhaarSeedingStatus}
        badge={data.aadhaarSeedingBadge}
        delay="160ms"
      />
    </div>
  );
}
