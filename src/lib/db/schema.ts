import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  fullName: text("full_name").notNull().default(""),
  phone: text("phone"),
  role: text("role", { enum: ["client", "admin"] }).notNull().default("client"),
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

export type User = typeof users.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type ApplicationData = typeof applicationData.$inferSelect;
export type Document = typeof documents.$inferSelect;
