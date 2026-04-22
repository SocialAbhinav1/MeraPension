import { NextRequest, NextResponse } from 'next/server';
import {
  SEEDING_URL,
  fetchViewStateTokens,
  parseSeedingHtml,
} from '@/lib/scraper';
import type { ApiResponse, SeedingData } from '@/lib/types';

export const runtime = 'nodejs';

// Map our SearchType to seeding page dropdown values
const SEEDING_TYPE_MAP: Record<string, string> = {
  'Aadhaar No': '2',      // Aadhaar Number
  'Labharthi Id': '1',   // Beneficiary ID
  'Account No': '1',     // Fallback to Beneficiary ID (seeding page doesn't support account no)
};

export async function POST(req: NextRequest) {
  // Block cross-origin requests — this route is called server-to-server internally
  const origin = req.headers.get('origin');
  if (origin) {
    const host = req.headers.get('host') ?? '';
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Forbidden.' },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Forbidden.' },
        { status: 403 }
      );
    }
  }

  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (contentLength > 1024) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Request too large.' },
      { status: 413 }
    );
  }
  try {
    const body = await req.json();
    const { searchType, searchValue } = body as {
      searchType: string;
      searchValue: string;
    };

    if (!searchType || !searchValue) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const sanitized = searchValue.replace(/[^0-9]/g, '').slice(0, 20);
    if (!sanitized) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid search value.' },
        { status: 400 }
      );
    }

    // Step 1: GET page to extract tokens
    const tokens = await fetchViewStateTokens(SEEDING_URL);

    // Step 2: Build POST body
    const formData = new URLSearchParams();
    formData.set('__VIEWSTATE', tokens.viewState);
    formData.set('__VIEWSTATEGENERATOR', tokens.viewStateGenerator);
    formData.set('__EVENTVALIDATION', tokens.eventValidation);
    Object.entries(tokens.hiddenInputs).forEach(([key, val]) => formData.set(key, val));
    formData.set('ctl00$ContentPlaceHolder1$ddlSearchBy', SEEDING_TYPE_MAP[searchType] ?? '2');
    formData.set('ctl00$ContentPlaceHolder1$txtSearchBy', sanitized);
    formData.set('ctl00$ContentPlaceHolder1$btnView', 'View');

    // Step 3: POST
    const searchResp = await fetch(SEEDING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: SEEDING_URL,
        Origin: 'https://elabharthi.bihar.gov.in',
        ...(tokens.cookie ? { Cookie: tokens.cookie } : {}),
      },
      body: formData.toString(),
    });

    if (!searchResp.ok) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: `Portal returned status ${searchResp.status}.` },
        { status: 502 }
      );
    }

    const html = await searchResp.text();
    const data = parseSeedingHtml(html);

    if (!data) {
      // Not finding seeding data is non-fatal — return empty status
      return NextResponse.json<ApiResponse<SeedingData>>(
        {
          success: true,
          data: {
            beneficiaryId: '',
            name: '',
            aadhaarNo: '',
            district: '',
            block: '',
            panchayat: '',
            status: 'Data Not Available',
            statusBadge: 'neutral',
          },
        }
      );
    }

    return NextResponse.json<ApiResponse<SeedingData>>({ success: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stdout.write(`[aadhaar-seeding] ${new Date().toISOString()} ERROR: ${msg}\n`);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch Aadhaar seeding data.' },
      { status: 503 }
    );
  }
}
