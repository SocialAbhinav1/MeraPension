import { NextRequest, NextResponse } from 'next/server';
import {
  PAYMENT_URL,
  fetchViewStateTokens,
  parsePaymentStatusHtml,
} from '@/lib/scraper';
import type { ApiResponse, PensionData } from '@/lib/types';

export const runtime = 'nodejs';

// Map our internal searchType to the portal's dropdown values
const SEARCH_TYPE_MAP: Record<string, string> = {
  'Labharthi Id': 'Ben',
  'Aadhaar No': 'Aadhaar',
  'Account No': 'Accnt',
};

// Map financial year string (e.g. "2025-2026") to portal dropdown value ("2526")
function getFinYearValue(fy: string): string {
  if (!fy || typeof fy !== 'string') return '0';
  const parts = fy.split('-');
  if (parts.length === 2) {
    return `${parts[0].slice(-2)}${parts[1].slice(-2)}`;
  }
  return '0';
}

export async function POST(req: NextRequest) {
  // Block oversized payloads (max 1 KB is more than enough for a numeric ID)
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

    if (!financialYear || !searchType || !searchValue) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // Input validation: prevent oversized or non-numeric payloads reaching the portal
    const sanitized = searchValue.replace(/[^0-9]/g, '').slice(0, 20);
    if (!sanitized) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid search value. Only digits are accepted.' },
        { status: 400 }
      );
    }
    if (!['Labharthi Id', 'Aadhaar No', 'Account No'].includes(searchType)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid search type.' },
        { status: 400 }
      );
    }

    // Step 1: GET page to extract ViewState tokens
    const tokens = await fetchViewStateTokens(PAYMENT_URL);

    // Step 2: Build POST body
    const formData = new URLSearchParams();
    formData.set('__VIEWSTATE', tokens.viewState);
    formData.set('__VIEWSTATEGENERATOR', tokens.viewStateGenerator);
    formData.set('__EVENTVALIDATION', tokens.eventValidation);
    Object.entries(tokens.hiddenInputs).forEach(([key, val]) => formData.set(key, val));
    formData.set('ctl00$ContentPlaceHolder1$ddlfinyr', getFinYearValue(financialYear));
    formData.set('ctl00$ContentPlaceHolder1$ddlType', SEARCH_TYPE_MAP[searchType] || 'Aadhaar');
    formData.set('ctl00$ContentPlaceHolder1$txtBenId', sanitized);
    formData.set('ctl00$ContentPlaceHolder1$btnsearch', 'Search');

    // Step 3: POST the search
    const searchResp = await fetch(PAYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: PAYMENT_URL,
        Origin: 'https://elabharthi.bihar.gov.in',
        ...(tokens.cookie ? { Cookie: tokens.cookie } : {}),
      },
      body: formData.toString(),
    });

    if (!searchResp.ok) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: `Portal returned status ${searchResp.status}. Please try again.` },
        { status: 502 }
      );
    }

    const html = await searchResp.text();

    // Step 4: Parse HTML
    const data = parsePaymentStatusHtml(html);

    if (!data) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error:
            'No beneficiary found for the given details. Please verify your Aadhaar / Beneficiary ID and financial year.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<PensionData>>({ success: true, data });
  } catch (err) {
    // Log message only — full stack is visible in Vercel function logs, never sent to client
    const msg = err instanceof Error ? err.message : String(err);
    process.stdout.write(`[pension-status] ${new Date().toISOString()} ERROR: ${msg}\n`);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error:
          'Failed to reach the eLabharthi portal. Please check your internet connection and try again.',
      },
      { status: 503 }
    );
  }
}
