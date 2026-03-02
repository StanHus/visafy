import { pgTable, text, integer, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

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

export type User = typeof users.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type ApplicationData = typeof applicationData.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type AdminNote = typeof adminNotes.$inferSelect;
export type StatusHistory = typeof statusHistory.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Message = typeof messages.$inferSelect;
