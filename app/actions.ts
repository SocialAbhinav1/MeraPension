'use server';

/**
 * Server Actions — runs exclusively on Vercel Node.js servers.
 * Nothing in this file is ever sent to or executable on the browser.
 * Network tab in DevTools shows only RSC wire format, NOT readable JSON.
 */

import {
  PAYMENT_URL,
  fetchViewStateTokens,
  parsePaymentStatusHtml,
} from '@/lib/scraper';
import type { PensionData, SearchFormValues } from '@/lib/types';

// ─── Allowed search types ─────────────────────────────────────────────────────
const ALLOWED_TYPES = ['Aadhaar No', 'Labharthi Id', 'Account No'] as const;
const SEARCH_TYPE_MAP: Record<string, string> = {
  'Labharthi Id': 'Ben',
  'Aadhaar No':   'Aadhaar',
  'Account No':   'Accnt',
};
// Confirmed June 2026 from live portal HTML:
// <option value="ben">लाभार्थी संख्या</option>
// <option value="adr">आधार संख्या</option>
const SEEDING_TYPE_MAP: Record<string, string> = {
  'Aadhaar No':   'adr',
  'Labharthi Id': 'ben',
  'Account No':   'ben', // portal doesn't support account no; fallback to beneficiary
};

function getFinYearValue(fy: string): string {
  if (!fy || typeof fy !== 'string') return '0';
  const parts = fy.split('-');
  if (parts.length === 2) return `${parts[0].slice(-2)}${parts[1].slice(-2)}`;
  return '0';
}



// ─── Main Server Action ───────────────────────────────────────────────────────
export type SearchResult =
  | { success: true; data: Omit<PensionData, 'currentStatus' | 'jpStatus' | 'paymentStatusRaw'> }
  | { success: false; error: string };

export async function searchPensionAction(
  values: SearchFormValues
): Promise<SearchResult> {
  // 1. Input validation
  const { financialYear, searchType, searchValue } = values;
  if (!financialYear || !searchType || !searchValue) {
    return { success: false, error: 'कृपया सभी जानकारी भरें। / Please fill in all fields.' };
  }
  if (!ALLOWED_TYPES.includes(searchType as (typeof ALLOWED_TYPES)[number])) {
    return { success: false, error: 'Invalid search type.' };
  }

  // 2. Sanitize: digits only, max 20 chars
  const sanitized = searchValue.replace(/[^0-9]/g, '').slice(0, 20);
  if (!sanitized) {
    return { success: false, error: 'केवल अंक मान्य हैं। / Only digits are accepted.' };
  }

  try {
    // 3. Scrape pension status (server-only — invisible to browser DevTools)
    const tokens = await fetchViewStateTokens(PAYMENT_URL);
    const formData = new URLSearchParams();
    formData.set('__VIEWSTATE', tokens.viewState);
    formData.set('__VIEWSTATEGENERATOR', tokens.viewStateGenerator);
    formData.set('__EVENTVALIDATION', tokens.eventValidation);
    Object.entries(tokens.hiddenInputs).forEach(([k, v]) => formData.set(k, v));
    formData.set('ctl00$ContentPlaceHolder1$ddlfinyr', getFinYearValue(financialYear));
    formData.set('ctl00$ContentPlaceHolder1$ddlType', SEARCH_TYPE_MAP[searchType] || 'Aadhaar');
    formData.set('ctl00$ContentPlaceHolder1$txtBenId', sanitized);
    formData.set('ctl00$ContentPlaceHolder1$btnsearch', 'Search');

    const searchResp = await fetch(PAYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: PAYMENT_URL,
        Origin: 'https://elabharthi.bihar.gov.in',
        ...(tokens.cookie ? { Cookie: tokens.cookie } : {}),
      },
      body: formData.toString(),
    });

    if (!searchResp.ok) {
      return { success: false, error: 'सरकारी पोर्टल से जवाब नहीं मिला। कृपया पुनः प्रयास करें।' };
    }

    const data = parsePaymentStatusHtml(await searchResp.text());
    if (!data) {
      return {
        success: false,
        error: 'कोई लाभार्थी नहीं मिला। कृपया आधार / लाभार्थी संख्या और वित्तीय वर्ष जाँचें।',
      };
    }



    // 5. Strip raw portal internals before returning to client
    const {
      currentStatus:    _cs,
      jpStatus:         _jp,
      paymentStatusRaw: _pr,
      ...clientData
    } = data;

    return { success: true, data: clientData };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stdout.write(`[searchPensionAction] ${new Date().toISOString()} ERROR: ${msg}\n`);
    return {
      success: false,
      error: 'eLabharthi पोर्टल से कनेक्ट नहीं हो सका। कृपया अपना इंटरनेट जाँचें।',
    };
  }
}
