import { db } from "./index";
import { sql } from "drizzle-orm";

// Create tables if they don't exist
db.run(sql`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    full_name TEXT NOT NULL DEFAULT '',
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    visa_type TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    current_step INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS application_data (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES applications(id),
    step_number INTEGER NOT NULL,
    field_name TEXT NOT NULL,
    field_value TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES applications(id),
    document_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

console.log("Database tables created successfully");
