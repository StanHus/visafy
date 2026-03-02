import { z } from "zod";

export const emailSchema = z.string().email("Invalid email format");

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(200),
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const applicationPostSchema = z.object({
  applicationId: z.string().uuid().optional().nullable(),
  step: z.number().int().min(1).max(6).optional(),
  fields: z.record(z.string(), z.string().max(5000)).optional(),
  visaType: z.enum([
    "work_visa",
    "golden_visa",
    "student_visa",
    "family_reunification",
    "digital_nomad",
    "non_lucrative",
  ]).optional().nullable(),
  currentStep: z.number().int().min(1).max(6).optional(),
});

export const applicationSubmitSchema = z.object({
  applicationId: z.string().uuid("Valid application ID is required"),
});

export const adminStatusUpdateSchema = z.object({
  applicationId: z.string().uuid(),
  status: z.enum([
    "draft",
    "submitted",
    "under_review",
    "additional_info_needed",
    "approved",
    "rejected",
  ]),
  note: z.string().max(2000).optional(),
});

export const adminNoteSchema = z.object({
  applicationId: z.string().uuid(),
  content: z.string().min(1, "Note content is required").max(5000),
});

export const documentReviewSchema = z.object({
  documentId: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().max(1000).optional(),
});

export const messageSchema = z.object({
  applicationId: z.string().uuid(),
  content: z.string().min(1).max(5000),
});

export const checkoutSchema = z.object({
  applicationId: z.string().uuid(),
  visaType: z.enum([
    "work_visa",
    "golden_visa",
    "student_visa",
    "family_reunification",
    "digital_nomad",
    "non_lucrative",
  ]),
});

// ── Phase 2: Captains ──

export const captainRegisterSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters").max(2000),
  city: z.string().min(1, "City is required").max(200),
  languages: z.array(z.string().min(1)).min(1, "At least one language is required"),
  expertise: z.array(z.string().min(1)).min(1, "At least one expertise is required"),
  hourlyRate: z.number().int().min(500, "Minimum rate is €5").max(50000, "Maximum rate is €500"),
});

export const captainUpdateSchema = captainRegisterSchema.partial();

export const availabilitySchema = z.object({
  slots: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format: HH:MM"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format: HH:MM"),
    isAvailable: z.boolean().default(true),
  })),
});

export const bookingCreateSchema = z.object({
  captainId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format: HH:MM"),
  durationMinutes: z.number().int().min(30).max(480),
  notes: z.string().max(1000).optional(),
});

export const reviewCreateSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

// ── Phase 3: Properties ──

export const propertyCreateSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().max(5000).optional(),
  city: z.string().min(1, "City is required").max(200),
  address: z.string().max(500).optional(),
  priceMonthly: z.number().int().min(10000, "Minimum price is €100"),
  rooms: z.number().int().min(0).max(50).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  areaSqm: z.number().int().min(1).max(10000).optional(),
  furnished: z.boolean().default(false),
  visaFriendly: z.boolean().default(false),
  amenities: z.array(z.string()).optional(),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();

export const inquiryCreateSchema = z.object({
  propertyId: z.string().uuid(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const inquiryMessageSchema = z.object({
  message: z.string().min(1, "Message is required").max(2000),
});
