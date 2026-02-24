import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  fullName: text("full_name").notNull().default(""),
  phone: text("phone"),
  role: text("role", { enum: ["client", "admin"] }).notNull().default("client"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
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
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

export const applicationData = sqliteTable("application_data", {
  id: text("id").primaryKey(),
  applicationId: text("application_id")
    .notNull()
    .references(() => applications.id),
  stepNumber: integer("step_number").notNull(),
  fieldName: text("field_name").notNull(),
  fieldValue: text("field_value").notNull().default(""),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  applicationId: text("application_id")
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
  uploadedAt: text("uploaded_at").notNull().default(new Date().toISOString()),
});

export type User = typeof users.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type ApplicationData = typeof applicationData.$inferSelect;
export type Document = typeof documents.$inferSelect;
