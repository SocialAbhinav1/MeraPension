import { NextRequest, NextResponse } from 'next/server';
import {
  PAYMENT_URL,
  SEEDING_URL,
  fetchViewStateTokens,
  parsePaymentStatusHtml,
  parseSeedingHtml,
} from '@/lib/scraper';
import type { ApiResponse, PensionData } from '@/lib/types';

export const runtime = 'nodejs';

// ─── Same-origin guard ────────────────────────────────────────────────────────
// Rejects requests from external sites / scrapers calling this API directly.
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  // No Origin header = same-origin browser navigation or server-to-server (allowed)
  if (!origin) return true;
  const host = req.headers.get('host') ?? '';
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// ─── Financial year mapper ────────────────────────────────────────────────────
const SEARCH_TYPE_MAP: Record<string, string> = {
  'Labharthi Id': 'Ben',
  'Aadhaar No':   'Aadhaar',
  'Account No':   'Accnt',
};
const SEEDING_TYPE_MAP: Record<string, string> = {
  'Aadhaar No':   '2',
  'Labharthi Id': '1',
  'Account No':   '1',
};

function getFinYearValue(fy: string): string {
  if (!fy || typeof fy !== 'string') return '0';
  const parts = fy.split('-');
  if (parts.length === 2) return `${parts[0].slice(-2)}${parts[1].slice(-2)}`;
  return '0';
}

// ─── Scrape aadhaar seeding (server-side, never exposed to client) ─────────────
async function fetchSeedingData(searchType: string, sanitized: string) {
  try {
    const tokens = await fetchViewStateTokens(SEEDING_URL);
    const formData = new URLSearchParams();
    formData.set('__VIEWSTATE', tokens.viewState);
    formData.set('__VIEWSTATEGENERATOR', tokens.viewStateGenerator);
    formData.set('__EVENTVALIDATION', tokens.eventValidation);
    Object.entries(tokens.hiddenInputs).forEach(([k, v]) => formData.set(k, v));
    formData.set('ctl00$ContentPlaceHolder1$ddlSearchBy', SEEDING_TYPE_MAP[searchType] ?? '2');
    formData.set('ctl00$ContentPlaceHolder1$txtSearchBy', sanitized);
    formData.set('ctl00$ContentPlaceHolder1$btnView', 'View');

    const resp = await fetch(SEEDING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: SEEDING_URL,
        Origin: 'https://elabharthi.bihar.gov.in',
        ...(tokens.cookie ? { Cookie: tokens.cookie } : {}),
      },
      body: formData.toString(),
    });
    if (!resp.ok) return null;
    return parseSeedingHtml(await resp.text());
  } catch {
    return null;
  }
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Block cross-origin requests (third-party sites calling this API)
  if (!isSameOrigin(req)) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Forbidden.' },
      { status: 403 }
    );
  }

  // 2. Block oversized payloads
  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (contentLength > 1024) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Request too large.' },
      { status: 413 }
    );
  }

  try {
    const body = await req.json();
    const { financialYear, searchType, searchValue } = body as {
      financialYear: string;
      searchType: string;
      searchValue: string;
    };

    // 3. Field presence check
    if (!financialYear || !searchType || !searchValue) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // 4. Type allowlist
    if (!['Labharthi Id', 'Aadhaar No', 'Account No'].includes(searchType)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid search type.' },
        { status: 400 }
      );
    }

    // 5. Sanitize: digits only, max 20 chars
    const sanitized = searchValue.replace(/[^0-9]/g, '').slice(0, 20);
    if (!sanitized) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid search value. Only digits are accepted.' },
        { status: 400 }
      );
    }

    // 6. Scrape pension status
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
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Portal returned an error. Please try again.' },
        { status: 502 }
      );
    }

    const data = parsePaymentStatusHtml(await searchResp.text());
    if (!data) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'No beneficiary found. Please verify your Aadhaar / Beneficiary ID and financial year.',
        },
        { status: 404 }
      );
    }

    // 7. Merge seeding data server-side (never requires a second client request)
    const seeding = await fetchSeedingData(searchType, sanitized);
    if (seeding) {
      data.aadhaarSeedingStatus = seeding.status;
      data.aadhaarSeedingBadge  = seeding.statusBadge;
      if (seeding.aadhaarNo) data.aadhaarNo = seeding.aadhaarNo;
    } else {
      data.aadhaarSeedingStatus = 'अज्ञात (Unknown)';
      data.aadhaarSeedingBadge  = 'neutral';
    }

    // 8. Strip internal raw fields — never expose portal internals to the client
    const {
      currentStatus:    _cs,
      jpStatus:         _jp,
      paymentStatusRaw: _pr,
      ...clientData
    } = data;

    return NextResponse.json<ApiResponse<Omit<PensionData, 'currentStatus' | 'jpStatus' | 'paymentStatusRaw'>>>(
      { success: true, data: clientData }
    );

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stdout.write(`[pension-status] ${new Date().toISOString()} ERROR: ${msg}\n`);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to reach the eLabharthi portal. Please try again.' },
      { status: 503 }
    );
  }
}
