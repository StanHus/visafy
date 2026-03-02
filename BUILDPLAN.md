# KORE Platform — Full Build Plan

## Vision
Transform the basic visa onboarding app into a full immigration platform with 3 pillars:
1. **Bureaucracy** — Visa processing, document management, status tracking, payments, admin panel
2. **Community (Captains)** — Local guide network for cultural onboarding
3. **Real Estate** — Verified rental marketplace for newcomers

## Tech Stack
- **Next.js 16** (App Router, TypeScript, React 19)
- **Neon Postgres** + Drizzle ORM
- **Vercel Blob** for file storage (already a dependency)
- **NextAuth v5** for auth
- **Stripe** for payments
- **Tailwind CSS v4**
- **i18n**: EN/ES/RU (already implemented)
- **Deploy**: Vercel (auto-deploy from main)

## Design Language
- Clean, minimal, premium feel (law firm meets modern SaaS)
- Orange (#F97316) accent on white/gray
- Already has animations (FadeIn, SlideTransition, StaggerChildren)
- Mobile-responsive, web-first

---

## PHASE 1: Fix Security + Complete Bureaucracy Pillar

### 1A. Security Fixes (from QA_REPORT.md)
- [ ] C1-C3: Add ownership checks to ALL API routes (applications, submit, upload)
- [ ] C4-C5: Move file uploads to Vercel Blob (already in deps, just not used)
- [ ] C6-C7: Server-side file size (10MB) and type validation (.pdf, .jpg, .jpeg, .png)
- [ ] C8: Add try/catch to all API routes
- [ ] H1: Load uploaded documents when resuming onboarding
- [ ] H2: Fix N+1 query in GET /api/applications
- [ ] H3: Wrap field updates in transaction
- [ ] M1: Email format validation on registration
- [ ] M3: Use Zod for all API input validation

### 1B. Admin Dashboard
- [ ] `/admin` route (protected, role=admin)
- [ ] List all applications with filters (status, visa type, date)
- [ ] View application details (all fields, documents)
- [ ] Change application status (under_review, additional_info_needed, approved, rejected)
- [ ] Add notes/comments to applications
- [ ] Document review: approve/reject individual documents with reasons
- [ ] Basic analytics: applications by status, by visa type, by month

### 1C. Stripe Payments
- [ ] Add `stripe` dependency
- [ ] Pricing page/component (€499 base, varies by visa type)
- [ ] Checkout flow after application review
- [ ] Payment status tracking in DB
- [ ] Webhook handler for payment confirmation
- [ ] Receipt/invoice generation

### 1D. Enhanced Status Tracking
- [ ] Status timeline with timestamps (not just current status)
- [ ] Email notifications on status changes (use Resend — already in deps)
- [ ] In-app notification center
- [ ] Application notes/messages between admin and applicant

### DB Schema Additions (Phase 1)
```sql
-- Admin notes on applications
CREATE TABLE admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id),
  admin_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Status history
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id),
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES users(id),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id),
  user_id UUID REFERENCES users(id),
  stripe_payment_id TEXT,
  stripe_checkout_session_id TEXT,
  amount INTEGER NOT NULL, -- cents
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## PHASE 2: Captains Network (Community Pillar)

### 2A. Captain Registration & Profiles
- [ ] Captain signup flow (separate from visa applicant)
- [ ] Profile: name, photo, bio, languages, expertise areas, location
- [ ] Verification status (pending, verified, rejected)
- [ ] Admin approval workflow

### 2B. Captain Discovery
- [ ] `/captains` browse page with search and filters
- [ ] Filter by: city, language, expertise (housing, legal, cultural, business)
- [ ] Captain profile detail page with reviews
- [ ] Map view (optional)

### 2C. Booking System
- [ ] Captain sets availability (calendar)
- [ ] Client books a session (1hr, 2hr, custom)
- [ ] Confirmation/cancellation flow
- [ ] Pricing set by captain (suggested range: €30-80/hr)
- [ ] Payment via Stripe (85% captain / 15% KORE split)

### 2D. Reviews & Ratings
- [ ] Post-session review prompt
- [ ] 1-5 star rating + text review
- [ ] Average rating on profile
- [ ] Report system for bad actors

### DB Schema (Phase 2)
```sql
CREATE TABLE captains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  bio TEXT,
  photo_url TEXT,
  city TEXT NOT NULL,
  languages TEXT[] NOT NULL, -- ['en', 'es', 'ru']
  expertise TEXT[] NOT NULL, -- ['housing', 'legal', 'cultural', 'business']
  hourly_rate INTEGER, -- cents
  status TEXT DEFAULT 'pending', -- pending, verified, rejected
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE captain_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  captain_id UUID REFERENCES captains(id),
  day_of_week INTEGER, -- 0=Sunday
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT true
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  captain_id UUID REFERENCES captains(id),
  client_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  total_amount INTEGER, -- cents
  captain_payout INTEGER, -- 85%
  platform_fee INTEGER, -- 15%
  stripe_payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  reviewer_id UUID REFERENCES users(id),
  captain_id UUID REFERENCES captains(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## PHASE 3: Real Estate Marketplace

### 3A. Landlord Portal
- [ ] Landlord registration (separate role)
- [ ] Add property listing (title, description, photos, price, location, rooms, amenities)
- [ ] Manage listings (edit, deactivate, mark rented)
- [ ] Verification badge system

### 3B. Property Search
- [ ] `/rentals` browse page
- [ ] Filters: city, price range, rooms, furnished, visa-friendly
- [ ] Photo gallery per listing
- [ ] Map integration (optional)
- [ ] "Visa-friendly" badge (landlord accepts immigrants)

### 3C. Inquiry System
- [ ] Contact landlord form (not full messaging yet)
- [ ] Landlord receives inquiry notification
- [ ] Basic messaging thread per inquiry
- [ ] Inquiry status tracking

### 3D. Safety Features
- [ ] Verified landlord badge (admin-approved)
- [ ] Report suspicious listing
- [ ] No-scam guidelines/education page

### DB Schema (Phase 3)
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  address TEXT,
  price_monthly INTEGER NOT NULL, -- cents
  rooms INTEGER,
  bathrooms INTEGER,
  area_sqm INTEGER,
  furnished BOOLEAN DEFAULT false,
  visa_friendly BOOLEAN DEFAULT false,
  amenities TEXT[], -- ['wifi', 'parking', 'ac', 'elevator']
  status TEXT DEFAULT 'active', -- active, rented, inactive
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  tenant_id UUID REFERENCES users(id),
  landlord_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- new, replied, closed
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inquiry_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID REFERENCES inquiries(id),
  sender_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Navigation Structure

```
/ (Landing)
├── /auth/signin
├── /auth/signup
├── /onboarding (6-step visa form)
├── /dashboard (user's applications)
├── /captains (browse captains)
│   └── /captains/[id] (captain profile)
├── /captains/register (become a captain)
├── /captains/dashboard (captain's bookings)
├── /rentals (browse properties)
│   └── /rentals/[id] (property detail)
├── /rentals/list (landlord: add property)
├── /rentals/dashboard (landlord: manage listings)
├── /admin (admin panel)
│   ├── /admin/applications
│   ├── /admin/captains
│   ├── /admin/properties
│   └── /admin/analytics
└── /pricing (visa service pricing)
```

## User Roles
- `client` — visa applicants (default)
- `captain` — local guides  
- `landlord` — property owners
- `admin` — platform administrators

Update the users table role enum: `client | captain | landlord | admin`

---

## i18n
All new UI text must include EN, ES, RU translations (matching existing pattern in src/lib/i18n.ts).

## Important Constraints
- All new API routes MUST have try/catch, ownership checks, and Zod validation
- Use Vercel Blob for ALL file uploads
- Keep the existing design language (orange accent, clean/minimal)
- Mobile-responsive throughout
- Preserve existing animations pattern
