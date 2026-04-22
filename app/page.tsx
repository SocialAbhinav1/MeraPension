'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Search, RotateCcw, Printer, ExternalLink, ChevronDown,
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

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const features = [
    { icon: <Users className="w-4 h-4" />, text: 'वृद्धा / Widow / दिव्यांग' },
    { icon: <ShieldCheck className="w-4 h-4" />, text: 'eKYC Status' },
    { icon: <Fingerprint className="w-4 h-4" />, text: 'Jeevan Praman' },
    { icon: <IndianRupee className="w-4 h-4" />, text: 'Payment History' },
  ];

  return (
    <div className="hero-bg relative overflow-visible">
      {/* Background orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-12 md:pt-16 md:pb-16">

        {/* Live indicator — compact, above title */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-semibold tracking-wide">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-orange-500" />
            </span>
            Live · eLabharthi Bihar Portal
          </span>
        </div>

        {/* Brand */}
        <div className="text-center mb-5">
          {/* Extra top padding so Devanagari matras (ें etc.) are never clipped */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight pt-2 pb-1 overflow-visible">
            <span className="gradient-text">मेरा</span>
            <span className="text-slate-900"> Pension</span>
          </h1>
          <p className="devanagari text-slate-700 text-xl md:text-2xl font-medium mt-2">
            बिहार पेंशन स्थिति ट्रैकर
          </p>
          <p className="text-slate-600 text-base md:text-lg mt-1">
            Bihar Pension Status Tracker &mdash; for widows, disabled &amp; senior citizens
          </p>
        </div>

        {/* Status badge — fuller version below title */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-orange-700 text-sm font-medium">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-orange-500" />
            </span>
            Live Data from eLabharthi Bihar Portal
          </span>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {features.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-300 text-slate-800 text-sm font-medium shadow-sm"
            >
              <span className="text-orange-600">{f.icon}</span>
              {f.text}
            </span>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="flex justify-center mt-8">
          <ChevronDown className="w-5 h-5 text-slate-500 animate-bounce" />
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
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-all shadow-lg shadow-orange-500/30 hover:-translate-y-0.5"
      >
        <Search className="w-4 h-4" />
        नई खोज / New Search
      </button>
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-500 rounded-xl px-4 py-2.5 text-sm transition-all"
      >
        <Printer className="w-4 h-4" />
        प्रिंट / Print
      </button>
      <a
        href="https://elabharthi.bihar.gov.in"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-500 rounded-xl px-4 py-2.5 text-sm transition-all"
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
    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/15">
      <span className="text-amber-400 text-lg flex-shrink-0">⚠️</span>
      <div className="text-xs text-slate-500 leading-relaxed">
        <span className="font-semibold text-amber-400">महत्वपूर्ण सूचना / Important: </span>
        यह जानकारी eLabharthi Bihar सरकार के आधिकारिक पोर्टल (elabharthi.bihar.gov.in) से ली गई है। किसी भी समस्या के लिए अपने जिला सामाजिक सुरक्षा कार्यालय से संपर्क करें।
        This is an unofficial helper tool. Data is sourced live from the official eLabharthi portal. For disputes, contact your district Social Security Office.
      </div>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: 1, emoji: '📅',
      title: 'वित्तीय वर्ष चुनें',
      desc: 'सबसे पहले वह वित्तीय वर्ष चुनें जिसकी पेंशन की जानकारी आप देखना चाहते हैं। जैसे: वर्ष 2025–2026 चुनें।',
    },
    {
      n: 2, emoji: '🔍',
      title: 'खोज का तरीका चुनें',
      desc: 'आप तीन तरीकों से खोज सकते हैं: आधार नंबर, लाभार्थी संख्या या बैंक खाता नंबर। जो आपके पास उपलब्ध हो उसे चुनें।',
    },
    {
      n: 3, emoji: '⌨️',
      title: 'नंबर दर्ज करें',
      desc: 'अपने चुने हुए तरीके का नंबर सावधानी से बॉक्स में लिखें। आधार नंबर 12 अंकों का होना ज़रूरी है।',
    },
    {
      n: 4, emoji: '✅',
      title: 'पेंशन स्थिति देखें',
      desc: 'खोजें बटन दबाने पर आपकी पेंशन स्थिति, eKYC जीवन प्रमाण और भुगतान इतिहास तुरंत स्क्रीन पर आ जाएगा।',
    },
  ];
  return (
    <div className="mt-12 mb-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 devanagari">कैसे इस्तेमाल करें</h2>
        <p className="text-slate-600 text-base mt-1">How To Use MeraPension — Step by Step</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {steps.map((s) => (
          <div key={s.n} className="relative glass rounded-2xl p-6 pt-9 text-left group hover:-translate-y-1 transition-transform duration-200 overflow-hidden shadow-sm hover:shadow-md">
            {/* Step number badge — top-left corner */}
            <div className="absolute top-0 left-0 w-9 h-9 bg-orange-100 border-r border-b border-orange-200 text-orange-600 flex items-center justify-center text-sm font-bold rounded-br-2xl transition-colors group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500">
              {s.n}
            </div>

            {/* Icon + title inline */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-2xl leading-none">{s.emoji}</span>
              <h3 className="text-base font-bold text-slate-800 devanagari leading-snug">{s.title}</h3>
            </div>

            {/* Description — bigger font, full sentences */}
            <p className="text-sm md:text-base text-slate-600 leading-relaxed devanagari">{s.desc}</p>
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
      descHi: 'यह ऐप आपका आधार नंबर, नाम या कोई भी जानकारी किसी सर्वर पर सेव नहीं करता। आपकी खोज सीधे सरकारी वेबसाइट से होती है।',
      color: 'emerald',
    },
    {
      icon: '🏛️',
      titleHi: 'सरकारी वेबसाइट सुरक्षित',
      titleEn: 'No Harm to Gov Portal',
      descHi: 'यह ऐप वही साधारण क्रियाएं करता है जो आप खुद eLabharthi पर जाकर करते हैं। कोई बोझ या नुकसान नहीं।',
      color: 'sky',
    },
    {
      icon: '📊',
      titleHi: 'सिर्फ सरकारी डेटा',
      titleEn: 'Only Official Data',
      descHi: 'जो जानकारी दिखाई जाती है वह सीधे elabharthi.bihar.gov.in से आती है। कोई अनुमान या बदलाव नहीं किया जाता।',
      color: 'violet',
    },
    {
      icon: '💚',
      titleHi: 'नागरिकों के लिए बनाया',
      titleEn: 'Built for Bihar Citizens',
      descHi: 'यह एक मुफ़्त, ओपन सोर्स परियोजना है जो बुजुर्ग, विधवाओं और दिव्यांग नागरिकों की मदद के लिए बनाई गई है।',
      color: 'orange',
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; iconBg: string; text: string; iconText: string }> = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', iconBg: 'bg-emerald-100', text: 'text-emerald-900', iconText: 'text-emerald-700' },
    sky:     { bg: 'bg-sky-50',     border: 'border-sky-100',     iconBg: 'bg-sky-100',     text: 'text-sky-900',     iconText: 'text-sky-700' },
    violet:  { bg: 'bg-violet-50',  border: 'border-violet-100',  iconBg: 'bg-violet-100',  text: 'text-violet-900',  iconText: 'text-violet-700' },
    orange:  { bg: 'bg-orange-50',  border: 'border-orange-100',  iconBg: 'bg-orange-100',  text: 'text-orange-900',  iconText: 'text-orange-700' },
  };

  return (
    <div className="mt-14 mb-2 no-print">
      {/* Section header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
          </span>
          Open Source · Free · No Data Stored
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 devanagari">आप भरोसे के साथ इस्तेमाल कर सकते हैं</h2>
        <p className="text-slate-500 text-base mt-1">Why MeraPension Is Safe &amp; Trustworthy</p>
      </div>

      {/* 4 trust cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {points.map((p) => {
          const c = colorMap[p.color];
          return (
            <div key={p.titleEn} className={`${c.bg} border ${c.border} rounded-2xl p-5 flex gap-4 hover:-translate-y-0.5 transition-transform duration-200`}>
              <div className={`${c.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
                {p.icon}
              </div>
              <div className="flex flex-col gap-1">
                <p className={`text-sm font-bold ${c.text} devanagari`}>{p.titleHi}</p>
                <p className="text-xs text-slate-500 font-medium tracking-wide">{p.titleEn}</p>
                <p className="text-sm text-slate-700 leading-relaxed devanagari mt-1">{p.descHi}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Open-source + developer banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 p-6 md:p-8">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: description */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🔓</span>
              <span className="text-xl font-bold text-white">100% Open Source</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg devanagari">
              मेरा Pension एक स्वतंत्र परियोजना है — बिहार के वृद्ध, विधवाओं और दिव्यांग नागरिकों के कल्याण के लिए।
              {' '}<span className="text-slate-500">This app reads publicly available government data. It stores nothing, charges nothing, and harms nothing.</span>
            </p>
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {['✅ कोई डेटा सेव नहीं', '✅ कोई लॉगिन नहीं', '✅ Free Forever', '✅ Open Source', '✅ No Ads'].map((b) => (
                <span key={b} className="px-3 py-1 rounded-full bg-white/8 border border-white/10 text-xs text-slate-400 font-medium devanagari">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Right: developer card + GitHub */}
          <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[220px]">
            {/* Developer credit */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-slate-900 font-bold text-base flex-shrink-0 shadow-md">
                AK
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Abhinav Kumar</p>
                <p className="text-slate-400 text-xs">Developer &amp; Creator</p>
              </div>
            </div>
            {/* GitHub button — update href when your repo is ready */}
            {/* ↓ EDIT THIS LINK when your GitHub repo is public ↓ */}
            <a
              href="https://github.com/YOUR_USERNAME/MeraPension"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              View Source on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-16 no-print">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-slate-800 font-semibold">
              <span className="gradient-text">MeraPension</span> — Bihar Pension Tracker
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Built with ❤️ by <span className="font-semibold text-slate-700">Abhinav Kumar</span> · Unofficial helper tool
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Data from elabharthi.bihar.gov.in</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="https://elabharthi.bihar.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors flex items-center gap-1">
              eLabharthi Portal <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://sspmis.bihar.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors flex items-center gap-1">
              SSPMIS <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} MeraPension by Abhinav Kumar. Not affiliated with Bihar Government. For official info, visit{' '}
          <a href="https://elabharthi.bihar.gov.in" className="hover:text-orange-500 transition-colors" target="_blank" rel="noopener noreferrer">
            elabharthi.bihar.gov.in
          </a>
        </p>
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

  const scrollToResults = () => {
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleSearch = useCallback(async (values: SearchFormValues) => {
    setLastSearch(values);
    setAppState('loading');
    setPensionData(null);
    scrollToResults();

    try {
      // 1. Fetch pension/payment data
      const res = await fetch('/api/pension-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (!json.success || !json.data) {
        setErrorMsg(json.error ?? 'No beneficiary found. Please verify the details and try again.');
        setAppState('error');
        return;
      }

      const data: PensionData = json.data;

      // 2. Fetch Aadhaar seeding data in parallel (non-fatal)
      try {
        const seedRes = await fetch('/api/aadhaar-seeding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchType: values.searchType, searchValue: values.searchValue }),
        });
        const seedJson = await seedRes.json();
        if (seedJson.success && seedJson.data) {
          data.aadhaarSeedingStatus = seedJson.data.status;
          data.aadhaarSeedingBadge = seedJson.data.statusBadge;
          if (seedJson.data.aadhaarNo) data.aadhaarNo = seedJson.data.aadhaarNo;
        }
      } catch {
        // Seeding data is non-fatal
        data.aadhaarSeedingStatus = 'Could not fetch';
        data.aadhaarSeedingBadge = 'neutral';
      }

      setPensionData(data);
      setAppState('results');
      scrollToResults();
    } catch {
      setErrorMsg('Failed to connect to the eLabharthi portal. Please check your connection and try again.');
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
    <div className="min-h-screen flex flex-col">
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
