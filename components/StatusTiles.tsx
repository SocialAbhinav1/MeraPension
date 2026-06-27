'use client';

import { ShieldCheck, Fingerprint, Link2, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import type { BadgeType, PensionData } from '@/lib/types';

interface Props { data: PensionData }

function getStatusIcon(badge: BadgeType, color: string) {
  switch (badge) {
    case 'success': return <CheckCircle2 className="w-6 h-6" style={{ color }} />;
    case 'warning': return <Clock className="w-6 h-6" style={{ color }} />;
    case 'danger': return <XCircle className="w-6 h-6" style={{ color }} />;
    case 'locked': return <AlertTriangle className="w-6 h-6" style={{ color }} />;
    default: return <AlertTriangle className="w-6 h-6" style={{ color }} />;
  }
}

export default function StatusTiles({ data }: Props) {
  // Map our data badges to the Clay feature card styles
  // Verification/Aadhaar = Coral if bad, Teal if good
  // eKYC = Gold if pending, Teal if good
  // Pension = Teal if good, Coral if bad
  
  const getCardClass = (badge: BadgeType) => {
    if (badge === 'success') return 'feature-teal';
    if (badge === 'danger' || badge === 'locked') return 'feature-coral';
    return 'feature-gold';
  };

  const cards = [
    {
      title: 'Aadhaar Seeding',
      titleHi: 'आधार सीडिंग',
      status: data.aadhaarSeedingStatus,
      badge: data.aadhaarSeedingBadge,
      icon: Link2,
    },
    {
      title: 'eKYC Status',
      titleHi: 'जीवन प्रमाण / eKYC',
      status: data.jpStatusClean,
      badge: data.jpStatusBadge,
      date: data.jpLastDate,
      icon: Fingerprint,
    },
    {
      title: 'Pension Status',
      titleHi: 'पेंशन स्थिति',
      status: data.currentStatusClean,
      badge: data.currentStatusBadge,
      date: data.currentStatusLastUpdate,
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center gap-2 mb-4 px-2">
        <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
        <h3 className="font-semibold uppercase tracking-widest text-xs" style={{ color: 'var(--color-muted)' }}>
          वर्तमान स्थिति / Vital Signs
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Connection line for desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 z-0" style={{ background: 'var(--color-hairline)' }} />
        
        {cards.map((card, i) => {
          const cardClass = getCardClass(card.badge);
          const MainIcon = card.icon;
          
          return (
            <div key={i} className={`feature-card ${cardClass} relative z-10 flex flex-col justify-between min-h-[160px]`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 mb-3 opacity-90">
                  <MainIcon className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">{card.title}</span>
                </div>
                {getStatusIcon(card.badge, 'currentColor')}
              </div>
              
              <div>
                <h4 className="text-lg md:text-xl font-bold devanagari leading-tight mb-2">
                  {card.titleHi}
                </h4>
                
                <div className="p-3 rounded-lg bg-black/10 backdrop-blur-sm border border-white/10">
                  <p className="text-sm font-semibold devanagari leading-snug">
                    {card.status || '—'}
                  </p>
                </div>
                
                {card.date && (
                  <p className="text-xs font-medium opacity-80 mt-3 font-mono">
                    {card.date}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
