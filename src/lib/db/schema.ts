import { pgTable, text, integer, timestamp, uuid, boolean, time, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  fullName: text("full_name").notNull().default(""),
  phone: text("phone"),
  role: text("role", { enum: ["client", "captain", "landlord", "admin"] }).notNull().default("client"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  visaType: text("visa_type", {
    enum: [
      "work_visa",
      "golden_visa",
      "student_visa",
      "family_reunification",
      "digital_nomad",
      "non_lucrative",
    ],
  }),
  status: text("status", {
    enum: [
      "draft",
      "submitted",
      "under_review",
      "additional_info_needed",
      "approved",
      "rejected",
    ],
  })
    .notNull()
    .default("draft"),
  currentStep: integer("current_step").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const applicationData = pgTable("application_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id),
  stepNumber: integer("step_number").notNull(),
  fieldName: text("field_name").notNull(),
  fieldValue: text("field_value").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id),
  documentType: text("document_type", {
    enum: [
      "passport",
      "photo",
      "proof_of_income",
      "bank_statement",
      "health_insurance",
      "criminal_record",
      "accommodation_proof",
      "employment_contract",
      "other",
    ],
  }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
  rejectionReason: text("rejection_reason"),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

// Admin notes on applications
export const adminNotes = pgTable("admin_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Status history tracking
export const statusHistory = pgTable("status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id),
  oldStatus: text("old_status"),
  newStatus: text("new_status").notNull(),
  changedBy: uuid("changed_by").references(() => users.id),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Payments
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  stripePaymentId: text("stripe_payment_id"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  amount: integer("amount").notNull(), // cents
  currency: text("currency").notNull().default("eur"),
  status: text("status", { enum: ["pending", "completed", "failed", "refunded"] })
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  applicationId: uuid("application_id").references(() => applications.id),
  type: text("type", { enum: ["status_change", "note_added", "payment", "document_review", "message"] }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Messages between admin and applicant
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => applications.id),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Phase 2: Captains Network ──

export const captains = pgTable("captains", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  city: text("city").notNull(),
  languages: text("languages").array().notNull(),
  expertise: text("expertise").array().notNull(),
  hourlyRate: integer("hourly_rate"), // cents
  status: text("status", { enum: ["pending", "verified", "rejected"] })
    .notNull()
    .default("pending"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const captainAvailability = pgTable("captain_availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  captainId: uuid("captain_id")
    .notNull()
    .references(() => captains.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  captainId: uuid("captain_id")
    .notNull()
    .references(() => captains.id),
  clientId: uuid("client_id")
    .notNull()
    .references(() => users.id),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "completed", "cancelled"] })
    .notNull()
    .default("pending"),
  totalAmount: integer("total_amount"), // cents
  captainPayout: integer("captain_payout"), // 85%
  platformFee: integer("platform_fee"), // 15%
  stripePaymentId: text("stripe_payment_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id),
  reviewerId: uuid("reviewer_id")
    .notNull()
    .references(() => users.id),
  captainId: uuid("captain_id")
    .notNull()
    .references(() => captains.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Phase 3: Real Estate Marketplace ──

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  landlordId: uuid("landlord_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  city: text("city").notNull(),
  address: text("address"),
  priceMonthly: integer("price_monthly").notNull(), // cents
  rooms: integer("rooms"),
  bathrooms: integer("bathrooms"),
  areaSqm: integer("area_sqm"),
  furnished: boolean("furnished").notNull().default(false),
  visaFriendly: boolean("visa_friendly").notNull().default(false),
  amenities: text("amenities").array(),
  status: text("status", { enum: ["active", "rented", "inactive"] })
    .notNull()
    .default("active"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const propertyImages = pgTable("property_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id),
  imageUrl: text("image_url").notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => users.id),
  landlordId: uuid("landlord_id")
    .notNull()
    .references(() => users.id),
  message: text("message").notNull(),
  status: text("status", { enum: ["new", "replied", "closed"] })
    .notNull()
    .default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const inquiryMessages = pgTable("inquiry_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  inquiryId: uuid("inquiry_id")
    .notNull()
    .references(() => inquiries.id),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type ApplicationData = typeof applicationData.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type AdminNote = typeof adminNotes.$inferSelect;
export type StatusHistory = typeof statusHistory.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Captain = typeof captains.$inferSelect;
export type CaptainAvailability = typeof captainAvailability.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type PropertyImage = typeof propertyImages.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type InquiryMessage = typeof inquiryMessages.$inferSelect;
