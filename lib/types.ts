export type SearchType = 'Aadhaar No' | 'Labharthi Id' | 'Account No';
export type BadgeType = 'success' | 'warning' | 'danger' | 'info' | 'locked' | 'neutral';

export interface PaymentMonth {
  month: string;
  status: string;
  badgeType: BadgeType;
}

/** Full monthly payment record from Table 2 */
export interface PaymentRecord {
  srNo: string;
  financialYear: string;
  registerNo: string;
  beneficiaryId: string;
  schemeName: string;
  beneficiaryName: string;
  fatherName: string;
  fromMonth: string;
  toMonth: string;
  utrNo: string;
  amount: string;
  status: string;
  statusBadge: BadgeType;
  paymentType: string;
  creditAccountNo: string;
  accountHolderName: string;
  creditBank: string;
}

export interface PensionData {
  // Identity
  name: string;
  fatherName: string;
  beneficiaryId: string;
  sspmisId: string;
  schemeName: string;
  schemeType: 'old-age' | 'widow' | 'disabled' | 'other';

  // Location
  district: string;
  block: string;
  panchayat: string;
  village: string;

  // Personal
  dob: string;
  dobAadhaar: string;
  accountNo: string;
  aadhaarNo?: string;

  // Current Status (raw text may contain "Last Update Status as On: ...")
  currentStatus: string;
  currentStatusClean: string;          // Status text without the timestamp suffix
  currentStatusBadge: BadgeType;
  currentStatusLastUpdate: string;     // Extracted "21 Apr 2026"
  removalReason: string;

  // Jeevan Praman / eKYC
  jpStatus: string;
  jpStatusClean: string;
  jpStatusBadge: BadgeType;
  jpLastDate: string;                  // "Jan 7 2026 4:22PM"
  jpStatusLastUpdate: string;

  // Payment summary (last 2 months, Table 1 col 17)
  paymentStatusRaw: string;
  paymentStatusClean: string;
  paymentStatusLastUpdate: string;
  paymentMonths: PaymentMonth[];       // Parsed from summary text

  // Full payment history (Table 2)
  paymentHistory: PaymentRecord[];

  // Aadhaar Seeding (merged from second API call)
  aadhaarSeedingStatus: string;
  aadhaarSeedingBadge: BadgeType;
}

export interface SeedingData {
  beneficiaryId: string;
  name: string;
  aadhaarNo: string;
  district: string;
  block: string;
  panchayat: string;
  status: string;
  statusBadge: BadgeType;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SearchFormValues {
  financialYear: string;
  searchType: SearchType;
  searchValue: string;
}
