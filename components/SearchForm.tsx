'use client';

import { useState } from 'react';
import { Search, RotateCcw, ChevronDown, Info, Calendar, Fingerprint, CreditCard, Shield } from 'lucide-react';
import type { SearchFormValues, SearchType } from '@/lib/types';

const FINANCIAL_YEARS = ['2025-2026', '2024-2025', '2023-2024', '2022-2023', '2021-2022'];

const SEARCH_TYPES: {
  value: SearchType; labelHi: string; labelEn: string;
  placeholder: string; maxLength: number; icon: React.ReactNode;
}[] = [
  { value: 'Aadhaar No',   labelHi: 'आधार नंबर',     labelEn: 'Aadhaar Number', placeholder: 'आधार के 12 अंक दर्ज करें',      maxLength: 12, icon: <Fingerprint className="w-4 h-4" /> },
  { value: 'Labharthi Id', labelHi: 'लाभार्थी संख्या', labelEn: 'Beneficiary ID', placeholder: 'लाभार्थी संख्या दर्ज करें',    maxLength: 20, icon: <Shield className="w-4 h-4" /> },
  { value: 'Account No',   labelHi: 'खाता नंबर',      labelEn: 'Account Number', placeholder: 'बैंक खाता नंबर दर्ज करें',    maxLength: 20, icon: <CreditCard className="w-4 h-4" /> },
];

interface Props { onSearch: (values: SearchFormValues) => void; isLoading: boolean; }

export default function SearchForm({ onSearch, isLoading }: Props) {
  const [financialYear, setFinancialYear] = useState('2025-2026');
  const [searchType, setSearchType] = useState<SearchType>('Aadhaar No');
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');

  const currentType = SEARCH_TYPES.find((t) => t.value === searchType)!;

  // True when the user has filled in a valid value — triggers the card glow
  const isReady =
    searchType === 'Aadhaar No'
      ? searchValue.length === 12
      : searchValue.trim().length > 0;

  function handleTypeChange(val: SearchType) { setSearchType(val); setSearchValue(''); setError(''); }

  function handleValueChange(val: string) {
    let cleaned = val;
    if (searchType === 'Aadhaar No')    cleaned = val.replace(/\D/g, '').slice(0, 12);
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
    setFinancialYear('2025-2026'); setSearchType('Aadhaar No');
    setSearchValue(''); setError('');
  }

  return (
    <div className={`rounded-2xl overflow-hidden border bg-white transition-all duration-500 ${
      isReady
        ? 'shadow-2xl shadow-orange-300/50 border-orange-300 ring-2 ring-orange-300/40'
        : 'shadow-xl border-slate-200'
    }`}>
      {/* Accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-200">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 devanagari">लाभार्थी खोजें</h2>
            <p className="text-sm text-slate-500 mt-0.5">Search Bihar Pension Beneficiary</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Two dropdowns side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

            {/* Financial Year */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="devanagari">वित्तीय वर्ष</span>
                <span className="text-slate-400 font-normal text-xs">/ Year</span>
              </label>
              <div className="relative">
                <select
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 pr-10 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all cursor-pointer hover:border-orange-300"
                >
                  {FINANCIAL_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Search By */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <ChevronDown className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="devanagari">खोज का प्रकार</span>
                <span className="text-slate-400 font-normal text-xs">/ Search By</span>
              </label>
              <div className="relative">
                <select
                  value={searchType}
                  onChange={(e) => handleTypeChange(e.target.value as SearchType)}
                  className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 pr-10 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all cursor-pointer hover:border-orange-300"
                >
                  {SEARCH_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.labelHi} / {t.labelEn}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Number input — full width, large */}
          <div className="flex flex-col gap-1.5 mb-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="text-orange-500">{currentType.icon}</span>
              <span className="devanagari">{currentType.labelHi} दर्ज करें</span>
              <span className="text-slate-400 font-normal text-xs">/ Enter {currentType.labelEn}</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={searchValue}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={currentType.placeholder}
              maxLength={currentType.maxLength}
              className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-4 text-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-mono tracking-widest ${
                error
                  ? 'border-red-400 focus:ring-red-300 bg-red-50'
                  : 'border-slate-200 focus:ring-orange-400 focus:border-orange-400 hover:border-orange-300'
              }`}
            />
          </div>

          {/* Aadhaar digit progress dots */}
          <div className="h-7 flex items-center mb-3">
            {searchType === 'Aadhaar No' && searchValue.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${i < searchValue.length ? 'bg-orange-500' : 'bg-slate-200'}`} />
                  ))}
                </div>
                <span className={`text-xs font-bold ${searchValue.length === 12 ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {searchValue.length === 12 ? '✓ पूरा हो गया' : `${searchValue.length}/12 अंक`}
                </span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
              <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">!</span>
              <p className="text-sm text-red-700 font-medium devanagari">{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2.5 font-bold rounded-xl px-6 py-4 text-lg transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed ${
                isReady && !isLoading
                  ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-lg shadow-orange-400/30 hover:shadow-orange-500/40'
                  : 'bg-orange-300 hover:bg-orange-400 text-white/90 shadow-md shadow-orange-200/40 disabled:bg-orange-200'
              }`}
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
              className="sm:w-auto flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-600 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-200 disabled:opacity-40"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="devanagari">रीसेट</span>
            </button>
          </div>
        </form>

        {/* Source note */}
        <div className="mt-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-sky-50 border border-sky-100">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-600" />
          <p className="text-sm text-sky-900 leading-relaxed devanagari">
            <span className="font-semibold">डेटा स्रोत:</span> यह जानकारी सीधे{' '}
            <a href="https://elabharthi.bihar.gov.in" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-700 hover:text-orange-600 underline underline-offset-2 transition-colors">
              elabharthi.bihar.gov.in
            </a>{' '}से ली जाती है।
          </p>
        </div>
      </div>
    </div>
  );
}
