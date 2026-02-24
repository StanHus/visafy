# Visafy — Spain Immigration Onboarding Platform

## Overview
A Next.js web app for immigration/visa onboarding into Spain. Clients fill out a multi-step form, upload documents, and track their application status. An agency reviews submissions.

## Tech Stack
- **Next.js 15** (App Router, TypeScript)
- **Postgres** via Vercel Postgres (@vercel/postgres + Drizzle ORM)
- **Auth**: NextAuth.js (email magic link or credentials for MVP)
- **File uploads**: Vercel Blob Storage
- **Styling**: Tailwind CSS
- **Deploy**: Vercel

## Design
- **Colors**: Gray, white, black primary. Orange (#F97316) as accent/primary action color.
- **Style**: Elegant, crisp, minimal. Think premium law firm meets modern SaaS.
- **Font**: Inter or similar clean sans-serif.
- **Mobile-responsive** but web-first.

## Database Schema (Postgres)

### users
- id (uuid, PK)
- email (unique)
- password_hash (nullable - for magic link)
- full_name
- phone
- created_at, updated_at

### applications
- id (uuid, PK)
- user_id (FK → users)
- visa_type (enum: work_visa, golden_visa, student_visa, family_reunification, digital_nomad, non_lucrative)
- status (enum: draft, submitted, under_review, additional_info_needed, approved, rejected)
- current_step (int, 1-6)
- created_at, updated_at

### application_data
- id (uuid, PK)
- application_id (FK → applications)
- step_number (int)
- field_name (text)
- field_value (text)
- created_at, updated_at

### documents
- id (uuid, PK)
- application_id (FK → applications)
- document_type (enum: passport, photo, proof_of_income, bank_statement, health_insurance, criminal_record, accommodation_proof, employment_contract, other)
- file_url (text)
- file_name (text)
- file_size (int)
- status (enum: pending, approved, rejected)
- rejection_reason (text, nullable)
- uploaded_at

## Onboarding Steps (Multi-Step Form)

### Step 1: Visa Type Selection
- Card-based selection of visa types with icons and brief descriptions
- Each visa type shows requirements summary

### Step 2: Personal Information
- Full name, date of birth, nationality
- Passport number, expiry date
- Phone, email (pre-filled from auth)
- Current address (country, city)

### Step 3: Visa-Specific Details
- Dynamic fields based on visa type selected:
  - **Work Visa**: employer info, job title, contract dates
  - **Golden Visa**: investment type, amount
  - **Student Visa**: university, program, duration
  - **Digital Nomad**: company/freelance, monthly income, remote work proof
  - **Family Reunification**: sponsor info, relationship
  - **Non-Lucrative**: income source, monthly amount

### Step 4: Financial Information
- Monthly/annual income
- Bank account details
- Source of funds

### Step 5: Document Upload
- Required documents checklist (varies by visa type)
- Drag-and-drop upload area
- Preview uploaded documents
- Document status indicators

### Step 6: Review & Submit
- Summary of all entered information
- Document checklist with status
- Terms & conditions checkbox
- Submit button

## Pages

### / (Landing)
- Hero section explaining the service
- "Start Your Application" CTA → goes to auth/signup
- Visa types overview
- How it works (3-step visual)

### /auth/signin & /auth/signup
- Clean auth forms with orange accent
- Magic link or email/password

### /onboarding
- Multi-step form with progress bar
- Step navigation (can go back, not forward past current)
- Auto-save on each step completion

### /dashboard
- Application overview card (status, progress, dates)
- Document status list
- Timeline of status changes
- "Continue Application" button if draft
- Notification area for agency messages

## Key Features
- Progress auto-saved after each step
- Form validation on each step before proceeding
- Responsive progress indicator
- Smooth step transitions (animations)
- Document upload with preview
- Application status tracking with visual timeline

## Deployment
- Deploy to Vercel
- Use Vercel Postgres for database
- Use Vercel Blob for file storage
- Set up environment variables

## Important
- Make it production-quality in appearance
- All forms must validate properly
- Handle loading states and errors gracefully
- Use proper TypeScript types throughout
- Create seed data for demo purposes
