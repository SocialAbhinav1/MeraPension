import * as cheerio from 'cheerio';
import type { BadgeType, PaymentMonth, PaymentRecord, PensionData, SeedingData } from './types';

export const PAYMENT_URL =
  'https://elabharthi.bihar.gov.in/link1/PaymentReports/CheckBeneficiaryPaymentStatus.aspx';
export const SEEDING_URL =
  'https://elabharthi.bihar.gov.in/link1/Public/AadhaarSeedingSearch.aspx';

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Cache-Control': 'no-cache',
};

// ─── ViewState Token Extraction ───────────────────────────────────────────────
export interface ViewStateTokens {
  viewState: string;
  viewStateGenerator: string;
  eventValidation: string;
  cookie: string;
  hiddenInputs: Record<string, string>;
}

export async function fetchViewStateTokens(url: string): Promise<ViewStateTokens> {
  const resp = await fetch(url, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
    redirect: 'follow',
  });
  if (!resp.ok) throw new Error(`GET ${url} failed with status ${resp.status}`);

  const setCookie = resp.headers.get('set-cookie') ?? '';
  const cookieString = setCookie
    .split(/,(?=[^;]+=[^;]+;)/)
    .map((c) => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ');

  const html = await resp.text();
  const $ = cheerio.load(html);

  const viewState = ($('#__VIEWSTATE').val() as string) ?? '';
  const viewStateGenerator = ($('#__VIEWSTATEGENERATOR').val() as string) ?? '';
  const eventValidation = ($('#__EVENTVALIDATION').val() as string) ?? '';

  const hiddenInputs: Record<string, string> = {};
  $('input[type="hidden"]').each((_, el) => {
    const name = $(el).attr('name');
    if (name && !['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION'].includes(name)) {
      hiddenInputs[name] = ($(el).val() as string) || '';
    }
  });

  return { viewState, viewStateGenerator, eventValidation, cookie: cookieString, hiddenInputs };
}

// ─── Status Normalizer ────────────────────────────────────────────────────────
export function normalizeStatus(raw: string): BadgeType {
  const t = raw.toLowerCase();
  if (
    t.includes('सत्यापित') ||
    t.includes('verified') ||
    t.includes('done successfully') ||
    t.includes('success') ||
    (t.includes('seeded') && !t.includes('not seeded'))
  )
    return 'success';
  if (
    t.includes('pending') ||
    t.includes('process') ||
    t.includes('प्रक्रिया') ||
    t.includes('in progress') ||
    t.includes('प्रोसेस')
  )
    return 'warning';
  if (
    t.includes('not seeded') ||
    t.includes('नहीं') ||
    t.includes('failed') ||
    t.includes('removed') ||
    t.includes('हटाया')
  )
    return 'danger';
  if (t.includes('लॉक') || t.includes('lock')) return 'locked';
  return 'neutral';
}

// ─── Split "status text + Last Update Status as On: DATE" ────────────────────
function splitStatusAndDate(raw: string): { clean: string; lastUpdate: string } {
  const marker = 'Last Update Status as On:';
  const idx = raw.indexOf(marker);
  if (idx === -1) return { clean: raw.trim(), lastUpdate: '' };
  return {
    clean: raw.slice(0, idx).replace(/[|\s]+$/, '').trim(),
    lastUpdate: raw.slice(idx + marker.length).trim(),
  };
}

// ─── Scheme Type Classifier ───────────────────────────────────────────────────
export function classifyScheme(name: string): PensionData['schemeType'] {
  const n = name.toLowerCase();
  if (n.includes('widow') || n.includes('विधवा')) return 'widow';
  if (n.includes('disab') || n.includes('handicap') || n.includes('दिव्यांग') || n.includes('विकलांग'))
    return 'disabled';
  if (n.includes('old age') || n.includes('वृद्ध') || n.includes('vridhjan')) return 'old-age';
  return 'other';
}

// ─── Payment Month Summary Parser (Table 1, col 17) ──────────────────────────
export function parsePaymentMonths(raw: string): PaymentMonth[] {
  if (!raw || raw.trim() === '—' || raw.trim() === '') return [];

  const months: PaymentMonth[] = [];
  const hindiMonths = [
    'जनवरी', 'फरवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ];
  const engMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Pattern: "फ़रवरी-2026 माह का Payment Done Successfully और मार्च-2026 माह का Payment Process Successfully"
  // Split on "और" (and) to get individual segments
  const andParts = raw.split(/और|and/gi);
  for (const part of andParts) {
    const cleaned = part
      .replace(/अंतिम भुगतान की स्थिति,?\s*/g, '')
      .replace(/Last Update Status as On:.*$/i, '')
      .trim();
    if (!cleaned) continue;

    // Extract month-year pattern like "फ़रवरी-2026" or "March-2026"
    const monthYearMatch = cleaned.match(
      /([A-Za-zऀ-ॿ\u0900-\u097F]+)[-\s](\d{4})/
    );
    let monthLabel = '';
    let year = '';
    if (monthYearMatch) {
      monthLabel = monthYearMatch[1].trim();
      year = monthYearMatch[2];
    } else {
      // Fallback: find any known month name
      for (const m of [...hindiMonths, ...engMonths]) {
        if (cleaned.includes(m)) { monthLabel = m; break; }
      }
      const yearMatch = cleaned.match(/\d{4}/);
      if (yearMatch) year = yearMatch[0];
    }

    if (!monthLabel) continue;

    const statusPart = cleaned
      .replace(monthYearMatch ? monthYearMatch[0] : monthLabel, '')
      .replace(/माह का\s*/g, '')
      .replace(year, '')
      .replace(/-/g, '')
      .trim();

    months.push({
      month: year ? `${monthLabel} ${year}` : monthLabel,
      status: statusPart || cleaned,
      badgeType: normalizeStatus(statusPart || cleaned),
    });
  }

  // Fallback: raw text
  if (months.length === 0 && raw.trim()) {
    months.push({ month: '—', status: raw.trim(), badgeType: normalizeStatus(raw) });
  }

  return months;
}

// ─── Payment Date Sorter ──────────────────────────────────────────────────────
const MONTH_MAP: Record<string, number> = {
  jan: 1, january: 1, जनवरी: 1,
  feb: 2, february: 2, 'फ़रवरी': 2, फरवरी: 2,
  mar: 3, march: 3, मार्च: 3,
  apr: 4, april: 4, अप्रैल: 4,
  may: 5, मई: 5,
  jun: 6, june: 6, जून: 6,
  jul: 7, july: 7, जुलाई: 7,
  aug: 8, august: 8, अगस्त: 8,
  sep: 9, september: 9, सितंबर: 9,
  oct: 10, october: 10, अक्टूबर: 10,
  nov: 11, november: 11, नवंबर: 11,
  dec: 12, december: 12, दिसंबर: 12,
};

function parseMonthYearSortKey(val: string): number {
  if (!val) return 0;
  const m = val.match(/([A-Za-zऀ-ॿ\u0900-\u097F]+)[-\s]?(\d{4})/);
  if (m) {
    const month = m[1].toLowerCase();
    const year = parseInt(m[2], 10);
    const mNum = MONTH_MAP[month] || 0;
    return year * 100 + mNum;
  }
  return 0;
}

// ─── Full Payment History Table Parser (Table 2) ──────────────────────────────
function parsePaymentHistoryTable($: cheerio.CheerioAPI, allTables: cheerio.Cheerio<any>[]): PaymentRecord[] {
  const records: PaymentRecord[] = [];

  for (const table of allTables) {
    const rows = $(table).find('tr');
    if (rows.length < 2) continue;

    // Detect if this is Table 2 by checking for UTR-like column (रजिस्टर/Register/UTR)
    const headerText = $(rows[0]).text().toLowerCase();
    if (
      !headerText.includes('utr') &&
      !headerText.includes('यूटीआर') &&
      !headerText.includes('register') &&
      !headerText.includes('रजिस्टर')
    ) continue;

    rows.each((idx, row) => {
      if (idx === 0) return; // skip header
      const cells = $(row).find('td');
      if (cells.length < 14) return; // Table 2 has 16 columns; skip malformed rows

      const cell = (i: number) => $(cells[i]).text().trim();
      const status = cell(11);
      records.push({
        srNo: cell(0),
        financialYear: cell(1),
        registerNo: cell(2),
        beneficiaryId: cell(3),
        schemeName: cell(4),
        beneficiaryName: cell(5),
        fatherName: cell(6),
        fromMonth: cell(7),
        toMonth: cell(8),
        utrNo: cell(9),
        amount: cell(10),
        status,
        statusBadge: normalizeStatus(status),
        paymentType: cell(12),
        creditAccountNo: cell(13),
        accountHolderName: cell(14),
        creditBank: cell(15),
      });
    });

    if (records.length > 0) break;
  }

  records.sort((a, b) => {
    const scoreA = parseMonthYearSortKey(a.toMonth) || parseMonthYearSortKey(a.fromMonth);
    const scoreB = parseMonthYearSortKey(b.toMonth) || parseMonthYearSortKey(b.fromMonth);
    return scoreB - scoreA;
  });

  return records;
}

// ─── Payment Status Page Parser ───────────────────────────────────────────────
export function parsePaymentStatusHtml(html: string): PensionData | null {
  const $ = cheerio.load(html);

  // Collect all tables
  const allTables: cheerio.Cheerio<any>[] = [];
  $('table').each((_, table) => { allTables.push($(table)); });

  // Table 1: Beneficiary details — find table with ≥18 columns in data row
  let dataTable: any = null;
  for (const table of allTables) {
    const rows = $(table).find('tr');
    if (rows.length < 2) continue;
    const secondRowCells = $(rows[1]).find('td');
    if (secondRowCells.length >= 15) {
      dataTable = table;
      break;
    }
  }

  if (!dataTable) return null;

  const rows = $(dataTable).find('tr');
  let dataRow: any = null;
  rows.each((idx, row) => {
    if (idx === 0) return;
    const cells = $(row).find('td');
    if (cells.length >= 15) { dataRow = row; return false; }
  });

  if (!dataRow) return null;

  const cells = $(dataRow).find('td');
  const cell = (i: number) => $(cells[i]).text().trim();

  // Column mapping (confirmed from live portal):
  // 0: Sr, 1: District, 2: Block, 3: Panchayat, 4: Village
  // 5: Scheme, 6: Beneficiary ID, 7: SSPMIS ID, 8: Name, 9: Father/Husband
  // 10: DOB, 11: DOB(Aadhaar), 12: Account No
  // 13: Current Status (contains "... Last Update Status as On: DATE")
  // 14: Removal Reason
  // 15: JP Status (contains "... Last Update Status as On: DATE")
  // 16: JP Last Date
  // 17: Payment Status Summary (contains "... Last Update Status as On: DATE")

  const currentStatusRaw = cell(13);
  const jpStatusRaw = cell(15);
  const paymentRaw = cell(17);

  const { clean: currentStatusClean, lastUpdate: currentStatusLastUpdate } =
    splitStatusAndDate(currentStatusRaw);
  const { clean: jpStatusClean, lastUpdate: jpStatusLastUpdate } =
    splitStatusAndDate(jpStatusRaw);
  const { clean: paymentStatusClean, lastUpdate: paymentStatusLastUpdate } =
    splitStatusAndDate(paymentRaw);

  // JP Last Date: may contain timestamp like "Jan 7 2026 4:22PM"
  const jpLastDateRaw = cell(16);

  const schemeName = cell(5);

  // Table 2: Full payment history
  const paymentHistory = parsePaymentHistoryTable($, allTables);

  return {
    name: cell(8),
    fatherName: cell(9),
    // Keep full beneficiary ID including leading zeros
    beneficiaryId: cell(6),
    sspmisId: cell(7),
    schemeName,
    schemeType: classifyScheme(schemeName),

    district: cell(1),
    block: cell(2),
    panchayat: cell(3),
    village: cell(4),

    dob: cell(10),
    dobAadhaar: cell(11),
    accountNo: cell(12),

    currentStatus: currentStatusRaw,
    currentStatusClean,
    currentStatusBadge: normalizeStatus(currentStatusClean),
    currentStatusLastUpdate,
    removalReason: cell(14),

    jpStatus: jpStatusRaw,
    jpStatusClean,
    jpStatusBadge: normalizeStatus(jpStatusClean),
    jpLastDate: jpLastDateRaw,
    jpStatusLastUpdate,

    paymentStatusRaw: paymentRaw,
    paymentStatusClean,
    paymentStatusLastUpdate,
    paymentMonths: parsePaymentMonths(paymentStatusClean || paymentRaw),

    paymentHistory,

    aadhaarSeedingStatus: 'अज्ञात (Unknown)',
    aadhaarSeedingBadge: 'neutral',
  };
}

// ─── Aadhaar Seeding Page Parser ──────────────────────────────────────────────
export function parseSeedingHtml(html: string): SeedingData | null {
  const $ = cheerio.load(html);

  let dataTable: any = null;
  $('table').each((_, table) => {
    const rows = $(table).find('tr');
    if (rows.length >= 2) {
      const secondRowCells = $(rows[1]).find('td');
      if (secondRowCells.length >= 4) {
        dataTable = $(table);
        return false;
      }
    }
  });

  if (!dataTable) return null;

  const rows = $(dataTable).find('tr');
  let dataRow: any = null;
  rows.each((idx, row) => {
    if (idx === 0) return;
    const cells = $(row).find('td');
    if (cells.length >= 4) { dataRow = $(row); return false; }
  });

  if (!dataRow) return null;

  const cells = $(dataRow).find('td');
  const cell = (i: number) => $(cells[i]).text().trim();

  // Columns: 0:Sr, 1:Beneficiary Id, 2:Name, 3:Aadhar No, 4:District, 5:Block, 6:Panchayat, 7:Status
  const status = cell(7);
  return {
    beneficiaryId: cell(1),
    name: cell(2),
    aadhaarNo: cell(3),
    district: cell(4),
    block: cell(5),
    panchayat: cell(6),
    status,
    statusBadge: normalizeStatus(status),
  };
}
