import * as cheerio from 'cheerio';
import type { BadgeType, PaymentMonth, PaymentRecord, PensionData, SeedingData } from './types';

export const PAYMENT_URL =
  'https://elabharthi.bihar.gov.in/link1/PaymentReports/CheckBeneficiaryPaymentStatus.aspx';
// Confirmed June 2026: seeding is served from /link1/Public/ subdirectory
// The old /Aadhaar/AadhaarSeedingSearch.aspx path returns 404
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
  const t = raw.toLowerCase().trim();
  if (!t) return 'neutral';

  // 1. Check Danger / Error states first
  if (
    t.includes('not seeded') ||
    t.includes('not been seeded') ||
    t.includes('नहीं') ||
    t.includes('failed') ||
    t.includes('removed') ||
    t.includes('हटाया') ||
    t.includes('rejected') ||
    t.includes('invalid') ||
    t.includes('expired') ||
    t.includes('error')
  )
    return 'danger';

  // 2. Check Warning / Pending states
  if (
    t.includes('pending') ||
    t.includes('process') ||
    t.includes('प्रक्रिया') ||
    t.includes('in progress') ||
    t.includes('प्रोसेस') ||
    t.includes('awaiting') ||
    t.includes('मार्क') ||
    t.includes('mark')
  )
    return 'warning';

  // 3. Check Success states
  if (
    t.includes('सत्यापित') ||
    t.includes('verified') ||
    t.includes('done successfully') ||
    t.includes('success') ||
    t.includes('active') ||
    t.includes('सक्रिय') ||
    t.includes('seeded')
  )
    return 'success';

  if (t.includes('लॉक') || t.includes('lock')) return 'locked';

  return 'neutral';
}

// ─── Status Translator (Meaningful Hindi/English mapping) ──────────────────────
export function translateStatus(raw: string): string {
  if (!raw) return '';
  const t = raw.trim();
  const lower = t.toLowerCase();

  // Payment specific
  if (lower.includes('payment done successfully')) return 'भुगतान सफलतापूर्वक पूरा हुआ (Payment Done) — आपके बैंक खाते में राशि भेज दी गई है।';
  if (lower.includes('payment process successfully')) return 'भुगतान की प्रक्रिया सफल रही (Payment Processed) — भुगतान को मंज़ूरी दे दी गई है और जल्द ही खाते में आ जाएगा।';
  if (lower.includes('भुगतान प्रक्रिया के लिए मार्क कर दिया गया है') || lower.includes('mark for payment')) return 'भुगतान के लिए चिह्नित (Marked for Payment) — आपका नाम इस महीने की भुगतान सूची में शामिल कर लिया गया है। जल्द ही PFMS के माध्यम से राशि आपके खाते में भेजी जाएगी।';
  if (lower.includes('pending at pmfs') || lower.includes('pending at pfms')) return 'PFMS पर लंबित (Pending at PFMS) — आपका भुगतान सरकारी वित्तीय प्रणाली (PFMS) द्वारा प्रोसेस किया जा रहा है। कृपया कुछ दिनों की प्रतीक्षा करें, राशि जल्द ही आपके खाते में आ जाएगी।';
  if (lower.includes('account rejected')) return 'खाता अस्वीकृत (Account Rejected) — आपके बैंक खाते का विवरण (Account No/IFSC) गलत होने के कारण इसे PFMS द्वारा अस्वीकार कर दिया गया है। कृपया ब्लॉक कार्यालय में सही बैंक पासबुक या आधार विवरण जमा करें।';

  // Aadhaar specific
  if (lower.includes('not been seeded with the bank account') || lower.includes('कारण: aadhaar number has not been seeded')) return 'भुगतान रुका है: आधार बैंक से लिंक नहीं है (Aadhaar Not Seeded) — आपका बैंक खाता आधार से लिंक (DBT/NPCI इनेबल) नहीं है। कृपया तुरंत अपनी बैंक शाखा में जाकर अपने खाते को आधार से लिंक (DBT enable) कराएं ताकि रुकी हुई पेंशन आ सके।';
  if (lower === 'aadhar not seeded') return 'आधार लिंक नहीं है (Aadhaar Not Seeded) — आपका बैंक खाता DBT प्राप्त करने के लिए आधार से जुड़ा नहीं है। कृपया अपनी बैंक शाखा से संपर्क करें।';
  if (lower === 'aadhar seeded') return 'आधार लिंक है (Aadhaar Seeded) — आपका बैंक खाता DBT/पेंशन प्राप्त करने के लिए सही ढंग से आधार से जुड़ा हुआ है।';

  // Verification & JP specific
  if (t.includes('जिला से सत्यापन, लॉक और विभाग से सैंक्शन हो चुका है')) return 'विभाग द्वारा स्वीकृत (Sanctioned by Dept) — आपके आवेदन और दस्तावेजों की जाँच ज़िला और समाज कल्याण विभाग द्वारा सफलतापूर्वक पूरी हो गई है। आपको योजना के लिए योग्य मान लिया गया है और पेंशन चालू है।';
  if (t.includes('जिला से सत्यापन और लॉक हो चुका है')) return 'ज़िला द्वारा सत्यापित (Verified by District) — आपका आवेदन ज़िला स्तर पर जाँचा जा चुका है और सही पाया गया है। अब यह राज्य विभाग की अंतिम स्वीकृति के लिए भेजा गया है।';
  if (lower.includes('लाभार्थी का जीवन प्रमाणीकरण') && lower.includes('सत्यापित हो गया है')) {
    const dateMatch = t.match(/\(([^)]+)\)/);
    const dateStr = dateMatch ? ` ${dateMatch[0]}` : '';
    return `जीवन प्रमाण पत्र सत्यापित${dateStr} (Jeevan Pramaan Verified) — आपका वार्षिक जीवित होने का प्रमाण (eKYC) सफलतापूर्वक जमा हो गया है, जिससे आपकी पेंशन बिना रुकावट जारी रहेगी।`;
  }

  // General edge cases
  if (lower.includes('removed')) return 'लाभार्थी सूची से हटाया गया (Removed) — किन्हीं कारणों (जैसे मृत्यु, अयोग्यता, या डुप्लीकेट खाते) से आपका नाम पेंशन सूची से हटा दिया गया है। अधिक जानकारी के लिए अपने ब्लॉक अधिकारी से संपर्क करें।';
  if (lower.includes('भुगतान की प्रक्रिया शुरू नहीं की गई')) return 'भुगतान की प्रक्रिया शुरू नहीं हुई है (Payment Not Started) — इस महीने के लिए अभी तक भुगतान भेजने की प्रक्रिया सरकार द्वारा शुरू नहीं की गई है। कृपया प्रतीक्षा करें।';

  // Fallback: clean up trailing commas and pipes, fix weird spaces
  return t.replace(/[|,]+$/, '').replace(/\s+/g, ' ').trim();
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
      status: translateStatus(statusPart || cleaned),
      badgeType: normalizeStatus(statusPart || cleaned),
    });
  }

  // Fallback: raw text
  if (months.length === 0 && raw.trim()) {
    months.push({ month: '—', status: translateStatus(raw), badgeType: normalizeStatus(raw) });
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
      const srNo = cell(0);
      
      // Skip empty or malformed rows that don't have a Sr No
      if (!srNo) return;

      const status = cell(11);
      records.push({
        srNo,
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

  // Find Table 1: beneficiary details — first table with ≥14 columns in data row
  let dataTable: any = null;
  for (const table of allTables) {
    const rows = $(table).find('tr');
    if (rows.length < 2) continue;
    const secondRowCells = $(rows[1]).find('td');
    if (secondRowCells.length >= 14) {
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
    if (cells.length >= 14) { dataRow = row; return false; }
  });

  if (!dataRow) return null;

  const cells = $(dataRow).find('td');
  const colCount = cells.length;
  const cell = (i: number) => i >= 0 && i < colCount ? $(cells[i]).text().trim() : '';

  // ── Adaptive column mapping ──────────────────────────────────────────────────
  // OLD layout (18 cols): had DOB(Aadhaar) col 11, Account col 12,
  //   CurrentStatus 13, RemovalReason 14, JPStatus 15, JPLastDate 16, PayStatus 17
  //
  // NEW layout (15 cols, confirmed Jun 2026 from screenshot):
  //   DOB(Aadhaar) removed, RemovalReason removed, JPLastDate merged into JPStatus
  //   Account col 11, CurrentStatus 12, JPStatus 13, PayStatus 14
  const isOldLayout = colCount >= 18;

  const accountNoIdx     = isOldLayout ? 12 : 11;
  const currentStatusIdx = isOldLayout ? 13 : 12;
  const removalReasonIdx = isOldLayout ? 14 : -1;
  const jpStatusIdx      = isOldLayout ? 15 : 13;
  const jpLastDateColIdx = isOldLayout ? 16 : -1;
  const paymentStatusIdx = isOldLayout ? 17 : 14;

  const currentStatusRaw = cell(currentStatusIdx);
  const jpStatusRaw      = cell(jpStatusIdx);
  const paymentRaw       = cell(paymentStatusIdx);

  const { clean: currentStatusClean, lastUpdate: currentStatusLastUpdate } =
    splitStatusAndDate(currentStatusRaw);
  const { clean: jpStatusClean, lastUpdate: jpStatusLastUpdate } =
    splitStatusAndDate(jpStatusRaw);
  const { clean: paymentStatusClean, lastUpdate: paymentStatusLastUpdate } =
    splitStatusAndDate(paymentRaw);

  // JP Last Date — in old layout it's a separate cell; in new layout extract from text
  // e.g. "(Jan 13 2026 7:26PM)"
  let jpLastDateRaw = '';
  if (isOldLayout) {
    jpLastDateRaw = cell(jpLastDateColIdx);
  } else {
    const m = jpStatusRaw.match(/\(([^)]+\d{4}[^)]*[AP]M)\)/i)
           || jpStatusRaw.match(/\(([^)]*\d{1,2}\s+\w+\s+\d{4}[^)]*)\)/);
    if (m) jpLastDateRaw = m[1].trim();
  }

  const schemeName = cell(5);

  // Table 2: Full payment history
  const paymentHistory = parsePaymentHistoryTable($, allTables);

  // Parse payment months — sorted latest-first
  const paymentMonthsRaw = parsePaymentMonths(paymentStatusClean || paymentRaw);
  paymentMonthsRaw.sort((a, b) => {
    const parseKey = (s: string) => {
      const match = s.match(/([A-Za-z\u0900-\u097F]+)[- ](\d{4})/);
      if (!match) return 0;
      const mNum = MONTH_MAP[match[1].toLowerCase()] || 0;
      return parseInt(match[2], 10) * 100 + mNum;
    };
    return parseKey(b.month) - parseKey(a.month);
  });

  return {
    name: cell(8),
    fatherName: cell(9),
    beneficiaryId: cell(6),
    sspmisId: cell(7),
    schemeName,
    schemeType: classifyScheme(schemeName),

    district: cell(1),
    block: cell(2),
    panchayat: cell(3),
    village: cell(4),

    dob: cell(10),
    dobAadhaar: isOldLayout ? cell(11) : '',
    accountNo: cell(accountNoIdx),

    currentStatus: currentStatusRaw,
    currentStatusClean: translateStatus(currentStatusClean),
    currentStatusBadge: normalizeStatus(currentStatusClean),
    currentStatusLastUpdate,
    removalReason: removalReasonIdx >= 0 ? cell(removalReasonIdx) : '',

    jpStatus: jpStatusRaw,
    jpStatusClean: translateStatus(jpStatusClean),
    jpStatusBadge: normalizeStatus(jpStatusClean),
    jpLastDate: jpLastDateRaw,
    jpStatusLastUpdate,

    paymentStatusRaw: paymentRaw,
    paymentStatusClean,
    paymentStatusLastUpdate,
    paymentMonths: paymentMonthsRaw,


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

  // Confirmed June 2026 column layout:
  // 0:Sr, 1:Beneficiary Id, 2:Name, 3:Aadhaar No, 4:District, 5:Block, 6:Panchayat, 7:Status
  const status = cell(7) || cell(6) || cell(5); // fallback if columns shift
  return {
    beneficiaryId: cell(1),
    name: cell(2),
    aadhaarNo: cell(3),
    district: cell(4),
    block: cell(5),
    panchayat: cell(6),
    status: translateStatus(status),
    statusBadge: normalizeStatus(status),
  };
}
