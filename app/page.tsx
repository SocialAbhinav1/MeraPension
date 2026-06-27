'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Search, Printer, ExternalLink, ChevronDown,
  Users, ShieldCheck, IndianRupee, Fingerprint,
} from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import BeneficiaryCard from '@/components/BeneficiaryCard';
import StatusTiles from '@/components/StatusTiles';
import PaymentHistory from '@/components/PaymentHistory';
import LocationCard from '@/components/LocationCard';
import type { PensionData, SearchFormValues } from '@/lib/types';
import { searchPensionAction } from '@/app/actions';
import QuickSummaryCard from '@/components/QuickSummaryCard';

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const features = [
    { icon: <Users className="w-3.5 h-3.5" />, textHi: 'वृद्धा / विधवा / दिव्यांग', textEn: 'All pension types' },
    { icon: <ShieldCheck className="w-3.5 h-3.5" />, textHi: 'eKYC स्थिति', textEn: 'eKYC status' },
    { icon: <Fingerprint className="w-3.5 h-3.5" />, textHi: 'जीवन प्रमाण', textEn: 'Jeevan Praman' },
    { icon: <IndianRupee className="w-3.5 h-3.5" />, textHi: 'भुगतान इतिहास', textEn: 'Payment history' },
  ];

  return (
    <div className="hero-bg relative overflow-hidden">
      {/* Subtle background orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-400/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-12 md:pt-20 md:pb-16">

        {/* Live portal badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide"
            style={{ background: '#fff7ed', borderColor: '#fed7aa', color: '#9a3412' }}>
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-orange-500" />
            </span>
            Live · eLabharthi Bihar Portal
          </span>
        </div>

        {/* Brand headline */}
        <div className="text-center mb-7">
          <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[1.08] pt-1 pb-1 overflow-visible"
            style={{ color: 'var(--color-ink)' }}>
            <span className="gradient-text-saffron">मेरा</span>
            <span> Pension</span>
          </h1>
          <p className="devanagari mt-3 text-xl md:text-2xl font-medium"
            style={{ color: 'var(--color-body)' }}>
            बिहार पेंशन स्थिति ट्रैकर
          </p>
          <p className="mt-1.5 text-base" style={{ color: 'var(--color-muted)' }}>
            Bihar Pension Status Tracker &mdash; for widows, disabled &amp; senior citizens
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8">
          {features.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: 'var(--color-canvas)',
                border: '1px solid var(--color-hairline)',
                color: 'var(--color-body)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <span style={{ color: 'var(--color-primary)' }}>{f.icon}</span>
              <span className="devanagari">{f.textHi}</span>
            </span>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="flex justify-center">
          <ChevronDown className="w-5 h-5 animate-bounce" style={{ color: 'var(--color-muted-soft)' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Result Actions Bar ───────────────────────────────────────────────────────
function ResultActions({ onNewSearch }: { onNewSearch: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 no-print">
      <button
        onClick={onNewSearch}
        className="flex items-center gap-2 font-semibold rounded-xl px-5 py-2.5 text-sm transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: 'var(--color-primary)',
          color: '#fff',
          boxShadow: 'var(--shadow-primary)',
        }}
      >
        <Search className="w-4 h-4" />
        <span className="devanagari">नई खोज</span>
        <span className="opacity-70">/ New Search</span>
      </button>
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200"
        style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', color: 'var(--color-body)' }}
      >
        <Printer className="w-4 h-4" />
        <span className="devanagari">प्रिंट</span>
        <span className="opacity-60">/ Print</span>
      </button>
      <a
        href="https://elabharthi.bihar.gov.in"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200"
        style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', color: 'var(--color-body)' }}
      >
        <ExternalLink className="w-4 h-4" />
        eLabharthi Portal
      </a>
    </div>
  );
}

// ─── Notice Card ─────────────────────────────────────────────────────────────
function NoticeCard() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl"
      style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
      <span className="text-lg flex-shrink-0">⚠️</span>
      <div className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
        <span className="font-semibold" style={{ color: '#92400e' }}>महत्वपूर्ण सूचना / Important: </span>
        यह जानकारी eLabharthi Bihar सरकार के आधिकारिक पोर्टल (elabharthi.bihar.gov.in) से ली गई है। किसी भी समस्या के लिए अपने जिला सामाजिक सुरक्षा कार्यालय से संपर्क करें।{' '}
        This is an unofficial helper tool. Data is sourced live from the official eLabharthi portal.
      </div>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: '01', emoji: '📅',
      title: 'वित्तीय वर्ष चुनें',
      titleEn: 'Choose Financial Year',
      desc: 'सबसे पहले वह वित्तीय वर्ष चुनें जिसकी पेंशन की जानकारी आप देखना चाहते हैं।',
    },
    {
      n: '02', emoji: '🔍',
      title: 'खोज का तरीका चुनें',
      titleEn: 'Select Search Method',
      desc: 'आधार नंबर, लाभार्थी संख्या या बैंक खाता नंबर — जो उपलब्ध हो उसे चुनें।',
    },
    {
      n: '03', emoji: '⌨️',
      title: 'नंबर दर्ज करें',
      titleEn: 'Enter Your Number',
      desc: 'अपना नंबर सावधानी से दर्ज करें। आधार नंबर 12 अंकों का होना ज़रूरी है।',
    },
    {
      n: '04', emoji: '✅',
      title: 'स्थिति देखें',
      titleEn: 'View Pension Status',
      desc: 'खोजें बटन दबाने पर पेंशन स्थिति, eKYC और भुगतान इतिहास तुरंत आ जाएगा।',
    },
  ];

  const colors = ['feature-card-teal', 'feature-card-coral', 'feature-card-gold', 'feature-card-cream'];

  return (
    <div className="mt-16 mb-4">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
          Step by Step
        </p>
        <h2 className="font-display text-3xl md:text-4xl"
          style={{ color: 'var(--color-ink)' }}>
          कैसे इस्तेमाल करें
        </h2>
        <p className="mt-2 text-base" style={{ color: 'var(--color-muted)' }}>How To Use MeraPension</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {steps.map((s, idx) => (
          <div
            key={s.n}
            className={`relative p-6 group transition-all duration-300 hover:-translate-y-1 ${colors[idx]}`}
            style={{
              boxShadow: 'var(--shadow-card)',
              animationDelay: `${idx * 80}ms`,
            }}
          >
            {/* Step number — editorial serif */}
            <span
              className="block text-4xl mb-4 leading-none font-display"
              style={{
                color: 'inherit',
                opacity: 0.9,
              }}
            >
              {s.n}
            </span>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl leading-none">{s.emoji}</span>
              <h3 className="text-sm font-bold devanagari leading-snug" style={{ color: 'inherit' }}>
                {s.title}
              </h3>
            </div>

            <p className="text-xs text-sm leading-relaxed devanagari" style={{ color: 'inherit', opacity: 0.9 }}>
              {s.desc}
            </p>

            {/* Bottom label */}
            <p className="mt-3 text-xs font-medium" style={{ opacity: 0.75 }}>
              {s.titleEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Trust & Transparency Section ────────────────────────────────────────────
function TrustSection() {
  const points = [
    {
      icon: '🔒',
      titleHi: 'आपका डेटा सुरक्षित है',
      titleEn: 'Zero Data Storage',
      descHi: 'यह ऐप आपका आधार नंबर या कोई जानकारी सर्वर पर सेव नहीं करता। खोज सीधे सरकारी वेबसाइट से होती है।',
      accent: '#059669',
    },
    {
      icon: '🏛️',
      titleHi: 'सरकारी पोर्टल सुरक्षित',
      titleEn: 'No Harm to Gov Portal',
      descHi: 'यह ऐप वही क्रियाएं करता है जो आप खुद eLabharthi पर जाकर करते हैं। कोई बोझ या नुकसान नहीं।',
      accent: '#0284c7',
    },
    {
      icon: '📊',
      titleHi: 'सिर्फ सरकारी डेटा',
      titleEn: 'Only Official Data',
      descHi: 'जो जानकारी दिखाई जाती है वह सीधे elabharthi.bihar.gov.in से आती है। कोई बदलाव नहीं।',
      accent: '#7c3aed',
    },
    {
      icon: '💚',
      titleHi: 'नागरिकों के लिए',
      titleEn: 'Built for Bihar Citizens',
      descHi: 'यह एक मुफ़्त, ओपन सोर्स परियोजना है — बुजुर्ग, विधवाओं और दिव्यांग नागरिकों की मदद के लिए।',
      accent: '#f97316',
    },
  ];

  return (
    <div className="mt-16 no-print">
      {/* Section header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-4"
          style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d' }}>
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
          </span>
          Open Source · Free · No Data Stored
        </span>
        <h2 className="font-display text-3xl md:text-4xl devanagari"
          style={{ color: 'var(--color-ink)' }}>
          आप भरोसे के साथ इस्तेमाल करें
        </h2>
        <p className="mt-2 text-base" style={{ color: 'var(--color-muted)' }}>
          Why MeraPension Is Safe &amp; Trustworthy
        </p>
      </div>

      {/* 2×2 trust cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {points.map((p, i) => (
          <div
            key={p.titleEn}
            className="flex gap-4 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'var(--color-canvas)',
              border: '1px solid var(--color-hairline)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${p.accent}14`, border: `1px solid ${p.accent}22` }}
            >
              {p.icon}
            </div>
            <div>
              <p className="text-sm font-bold devanagari" style={{ color: 'var(--color-ink)' }}>{p.titleHi}</p>
              <p className="text-xs font-medium tracking-wide mb-1.5" style={{ color: 'var(--color-muted-soft)' }}>{p.titleEn}</p>
              <p className="text-sm leading-relaxed devanagari" style={{ color: 'var(--color-body)' }}>{p.descHi}</p>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="mt-20 no-print" style={{ background: 'var(--color-surface-dark)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Brand */}
          <div>
            <p className="font-semibold text-lg" style={{ color: 'var(--color-on-dark)' }}>
              <span className="font-display gradient-text-saffron">MeraPension</span>
              <span style={{ color: 'var(--color-on-dark-soft)' }}> — Bihar Pension Tracker</span>
            </p>
            <p className="text-xs mt-1.5" style={{ color: 'var(--color-on-dark-soft)' }}>
              Built with ❤️ by <span className="font-semibold" style={{ color: 'var(--color-on-dark)' }}>Abhinav Kumar</span> · Unofficial helper tool
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#5a534e' }}>
              Data from elabharthi.bihar.gov.in
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 text-xs" style={{ color: 'var(--color-on-dark-soft)' }}>
            <a href="https://elabharthi.bihar.gov.in" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:opacity-100 transition-opacity"
              style={{ opacity: 0.7 }}>
              eLabharthi Portal <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://sspmis.bihar.gov.in" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:opacity-100 transition-opacity"
              style={{ opacity: 0.7 }}>
              SSPMIS <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://github.com/SocialAbhinav1/MeraPension" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:opacity-100 transition-opacity"
              style={{ opacity: 0.7 }}>
              GitHub
            </a>
          </div>
        </div>

        {/* Legal */}
        <div className="border-t mt-6 pt-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-center text-xs" style={{ color: '#5a534e' }}>
            © {new Date().getFullYear()} MeraPension by Abhinav Kumar. Not affiliated with Bihar Government. For official info, visit{' '}
            <a href="https://elabharthi.bihar.gov.in" className="transition-opacity hover:opacity-100"
              style={{ color: 'var(--color-on-dark-soft)', opacity: 0.7 }}
              target="_blank" rel="noopener noreferrer">
              elabharthi.bihar.gov.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}


// ─── Main Page ────────────────────────────────────────────────────────────────
type AppState = 'idle' | 'loading' | 'error' | 'results';

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [pensionData, setPensionData] = useState<PensionData | null>(null);
  const [lastSearch, setLastSearch] = useState<SearchFormValues | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToResults = () => {
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleSearch = useCallback(async (values: SearchFormValues) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLastSearch(values);
    setAppState('loading');
    setPensionData(null);
    scrollToResults();

    try {
      const result = await searchPensionAction(values);

      if (!result.success) {
        setErrorMsg(result.error ?? 'कोई लाभार्थी नहीं मिला। कृपया जानकारी जाँचें।');
        setAppState('error');
        return;
      }

      if (!result.data) {
        setErrorMsg('कोई लाभार्थी नहीं मिला। कृपया जानकारी जाँचें।');
        setAppState('error');
        return;
      }

      setPensionData(result.data as PensionData);
      setAppState('results');
      scrollToResults();
    } catch {
      setErrorMsg('eLabharthi पोर्टल से कनेक्ट नहीं हो सका। कृपया अपना इंटरनेट जाँचें।');
      setAppState('error');
    }
  }, []);

  const handleNewSearch = () => {
    setAppState('idle');
    setPensionData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    if (lastSearch) handleSearch(lastSearch);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-canvas)' }}>
      {/* Hero */}
      <HeroSection />

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 md:py-12">
        {/* Search form — always visible */}
        <div className="no-print">
          <SearchForm onSearch={handleSearch} isLoading={appState === 'loading'} />
        </div>

        {/* How it works + Trust — only in idle state */}
        {appState === 'idle' && (
          <>
            <HowItWorks />
            <TrustSection />
          </>
        )}

        {/* Results area */}
        <div ref={resultsRef} className="mt-8">
          {appState === 'loading' && <LoadingState />}

          {appState === 'error' && (
            <ErrorState
              message={errorMsg}
              onRetry={handleRetry}
              onNewSearch={handleNewSearch}
            />
          )}

          {appState === 'results' && pensionData && (
            <div className="space-y-4">
              {/* Action bar */}
              <div className="no-print">
                <ResultActions onNewSearch={handleNewSearch} />
              </div>

              {/* Quick summary */}
              <QuickSummaryCard data={pensionData} />

              {/* Beneficiary identity */}
              <BeneficiaryCard data={pensionData} />

              {/* Status tiles */}
              <StatusTiles data={pensionData} />

              {/* Payment history */}
              <PaymentHistory data={pensionData} financialYear={lastSearch?.financialYear ?? '—'} />

              {/* Location */}
              <LocationCard data={pensionData} />

              {/* Notice */}
              <NoticeCard />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
