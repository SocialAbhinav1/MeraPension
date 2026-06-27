'use client';

import { useState } from 'react';
import { Search, RotateCcw, Info, Calendar, Fingerprint, CreditCard, Shield, ChevronDown } from 'lucide-react';
import type { SearchFormValues, SearchType } from '@/lib/types';

// Financial years confirmed live on elabharthi.bihar.gov.in as of June 2026
const FINANCIAL_YEARS = ['2026-2027', '2025-2026', '2024-2025', '2023-2024', '2022-2023'];

const SEARCH_TYPES: {
  value: SearchType; labelHi: string; labelEn: string;
  placeholder: string; maxLength: number; icon: React.ReactNode;
}[] = [
  { value: 'Aadhaar No',   labelHi: 'आधार नंबर',     labelEn: 'Aadhaar No',    placeholder: 'आधार के 12 अंक दर्ज करें',   maxLength: 12, icon: <Fingerprint className="w-4 h-4" /> },
  { value: 'Labharthi Id', labelHi: 'लाभार्थी संख्या', labelEn: 'Beneficiary ID', placeholder: 'लाभार्थी संख्या दर्ज करें', maxLength: 20, icon: <Shield className="w-4 h-4" /> },
  { value: 'Account No',   labelHi: 'खाता नंबर',      labelEn: 'Account No',    placeholder: 'बैंक खाता नंबर दर्ज करें',  maxLength: 20, icon: <CreditCard className="w-4 h-4" /> },
];

interface Props { onSearch: (values: SearchFormValues) => void; isLoading: boolean; }

export default function SearchForm({ onSearch, isLoading }: Props) {
  const [financialYear, setFinancialYear] = useState('2026-2027');
  const [searchType, setSearchType] = useState<SearchType>('Aadhaar No');
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');

  const currentType = SEARCH_TYPES.find((t) => t.value === searchType)!;

  const isReady =
    searchType === 'Aadhaar No'
      ? searchValue.length === 12
      : searchValue.trim().length > 0;

  function handleTypeChange(val: SearchType) { setSearchType(val); setSearchValue(''); setError(''); }

  function handleValueChange(val: string) {
    let cleaned = val;
    if (searchType === 'Aadhaar No')     cleaned = val.replace(/\D/g, '').slice(0, 12);
    else if (searchType === 'Labharthi Id') cleaned = val.replace(/\D/g, '').slice(0, 20);
    setSearchValue(cleaned);
    if (error) setError('');
  }

  function validate(): string | null {
    if (!searchValue.trim()) return 'कृपया नंबर दर्ज करें / Please enter a number.';
    if (searchType === 'Aadhaar No' && searchValue.length !== 12)
      return 'आधार नंबर 12 अंकों का होना चाहिए / Aadhaar must be exactly 12 digits.';
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    onSearch({ financialYear, searchType, searchValue });
  }

  function handleReset() {
    setFinancialYear('2026-2027'); setSearchType('Aadhaar No');
    setSearchValue(''); setError('');
  }

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        background: 'var(--color-canvas)',
        border: isReady
          ? '1.5px solid var(--color-primary)'
          : '1.5px solid var(--color-hairline)',
        boxShadow: isReady
          ? '0 4px 24px rgba(249,115,22,0.18), 0 1px 4px rgba(249,115,22,0.08)'
          : 'var(--shadow-card)',
      }}
    >
      {/* Accent bar */}
      <div className="accent-bar" />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-7">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f97316, #fbbf24)', boxShadow: '0 4px 12px rgba(249,115,22,0.25)' }}
          >
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold devanagari" style={{ color: 'var(--color-ink)' }}>लाभार्थी खोजें</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>Search Bihar Pension Beneficiary</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Financial Year */}
          <div className="mb-5">
            <label className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: 'var(--color-body)' }}>
              <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
              <span className="devanagari">वित्तीय वर्ष</span>
              <span className="font-normal text-xs" style={{ color: 'var(--color-muted-soft)' }}>/ Financial Year</span>
            </label>
            <div className="relative">
              <select
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                className="w-full appearance-none rounded-xl px-4 py-3 pr-10 text-base font-semibold cursor-pointer transition-all outline-none"
                style={{
                  background: 'var(--color-surface-soft)',
                  border: '1.5px solid var(--color-hairline)',
                  color: 'var(--color-ink)',
                }}
              >
                {FINANCIAL_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--color-muted)' }} />
            </div>
          </div>

          {/* Search type — pill tabs */}
          <div className="mb-5">
            <label className="flex items-center gap-1.5 text-sm font-semibold mb-2.5" style={{ color: 'var(--color-body)' }}>
              <span className="devanagari">खोज का प्रकार</span>
              <span className="font-normal text-xs" style={{ color: 'var(--color-muted-soft)' }}>/ Search By</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {SEARCH_TYPES.map((t) => {
                const active = t.value === searchType;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => handleTypeChange(t.value)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: active ? 'var(--color-primary)' : 'var(--color-surface-soft)',
                      color: active ? '#fff' : 'var(--color-body)',
                      border: active ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-hairline)',
                      boxShadow: active ? '0 2px 8px rgba(249,115,22,0.25)' : 'none',
                    }}
                  >
                    {t.icon}
                    <span className="devanagari">{t.labelHi}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number input — full width */}
          <div className="mb-2">
            <label className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: 'var(--color-body)' }}>
              <span style={{ color: 'var(--color-primary)' }}>{currentType.icon}</span>
              <span className="devanagari">{currentType.labelHi} दर्ज करें</span>
              <span className="font-normal text-xs" style={{ color: 'var(--color-muted-soft)' }}>/ Enter {currentType.labelEn}</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={searchValue}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={currentType.placeholder}
              maxLength={currentType.maxLength}
              className="w-full rounded-xl px-4 py-3.5 text-base md:text-xl font-mono tracking-wider md:tracking-widest transition-all outline-none devanagari placeholder-shown:font-sans"
              style={{
                background: error ? '#fef2f2' : 'var(--color-surface-soft)',
                border: error
                  ? '1.5px solid #f87171'
                  : isReady
                  ? '1.5px solid var(--color-primary)'
                  : '1.5px solid var(--color-hairline)',
                color: 'var(--color-ink)',
                boxShadow: isReady && !error ? '0 0 0 3px rgba(249,115,22,0.1)' : 'none',
              }}
            />
          </div>

          {/* Aadhaar progress dots */}
          <div className="h-7 flex items-center mb-4">
            {searchType === 'Aadhaar No' && searchValue.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full transition-all duration-150"
                      style={{ background: i < searchValue.length ? 'var(--color-primary)' : 'var(--color-hairline)' }}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold" style={{ color: searchValue.length === 12 ? '#059669' : 'var(--color-muted)' }}>
                  {searchValue.length === 12 ? '✓ पूरा हो गया' : `${searchValue.length}/12 अंक`}
                </span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4"
              style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
              <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">!</span>
              <p className="text-sm font-medium devanagari" style={{ color: '#991b1b' }}>{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2.5 font-bold rounded-xl px-6 py-4 text-base transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed"
              style={{
                background: isReady && !isLoading ? 'var(--color-primary)' : '#fdba74',
                color: '#fff',
                boxShadow: isReady && !isLoading ? 'var(--shadow-primary)' : 'none',
              }}
            >
              {isLoading ? (
                <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /><span className="devanagari">खोज रहे हैं…</span></>
              ) : (
                <><Search className="w-5 h-5" /><span className="devanagari">खोजें / Search</span></>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="sm:w-auto flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-200 disabled:opacity-40"
              style={{
                background: 'var(--color-surface-soft)',
                border: '1.5px solid var(--color-hairline)',
                color: 'var(--color-body)',
              }}
            >
              <RotateCcw className="w-5 h-5" />
              <span className="devanagari">रीसेट</span>
            </button>
          </div>
        </form>

        {/* Source note */}
        <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-xl"
          style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0284c7' }} />
          <p className="text-sm leading-relaxed devanagari" style={{ color: '#0c4a6e' }}>
            <span className="font-semibold">डेटा स्रोत:</span> यह जानकारी सीधे{' '}
            <a href="https://elabharthi.bihar.gov.in" target="_blank" rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 transition-colors hover:text-orange-600"
              style={{ color: '#0369a1' }}>
              elabharthi.bihar.gov.in
            </a>{' '}से ली जाती है।
          </p>
        </div>
      </div>
    </div>
  );
}
