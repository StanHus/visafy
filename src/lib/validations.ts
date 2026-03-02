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
