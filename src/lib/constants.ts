export const VISA_LABELS: Record<string, string> = {
  work_visa: "Work Visa",
  golden_visa: "Golden Visa",
  student_visa: "Student Visa",
  digital_nomad: "Digital Nomad Visa",
  family_reunification: "Family Reunification",
  non_lucrative: "Non-Lucrative Visa",
};

export const FUND_SOURCE_LABELS: Record<string, string> = {
  employment: "Employment / Salary",
  self_employment: "Self-Employment / Business",
  investments: "Investments / Dividends",
  savings: "Savings",
  pension: "Pension / Retirement",
  family_support: "Family Support",
  other: "Other",
};

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-gray-700", bg: "bg-gray-100" },
  submitted: { label: "Submitted", color: "text-blue-700", bg: "bg-blue-100" },
  under_review: { label: "Under Review", color: "text-yellow-700", bg: "bg-yellow-100" },
  additional_info_needed: { label: "Info Needed", color: "text-amber-700", bg: "bg-amber-50" },
  approved: { label: "Approved", color: "text-green-700", bg: "bg-green-100" },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-100" },
};

export const ALLOWED_UPLOAD_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
export const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
