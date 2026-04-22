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

  // Current Status — raw kept server-side only, only clean versions sent to client
  currentStatus?: string;              // Internal: stripped before sending to client
  currentStatusClean: string;
  currentStatusBadge: BadgeType;
  currentStatusLastUpdate: string;
  removalReason: string;

  // Jeevan Praman / eKYC — raw kept server-side only
  jpStatus?: string;                   // Internal: stripped before sending to client
  jpStatusClean: string;
  jpStatusBadge: BadgeType;
  jpLastDate: string;
  jpStatusLastUpdate: string;

  // Payment summary — raw kept server-side only
  paymentStatusRaw?: string;           // Internal: stripped before sending to client
  paymentStatusClean: string;
  paymentStatusLastUpdate: string;
  paymentMonths: PaymentMonth[];

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
