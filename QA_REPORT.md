# QA Audit Report — Visafy

**Date:** 2026-02-24
**Scope:** Full codebase audit — API routes, pages, middleware, auth, DB, uploads

---

## CRITICAL — Will cause 500 errors or security vulnerabilities

### C1. IDOR: Any authenticated user can modify any application

**File:** `src/app/api/applications/route.ts:61-69`

The POST handler updates an application by `applicationId` taken from user input but never verifies the application belongs to the logged-in user. Any authenticated user can send a request with another user's `applicationId` to overwrite their visa type, step, and field data.

```typescript
// CURRENT (line 66-69) — no ownership check
await db
  .update(applications)
  .set(updates)
  .where(eq(applications.id, appId));
```

**Fix:** Add a `userId` ownership check to the WHERE clause:
```typescript
await db
  .update(applications)
  .set(updates)
  .where(and(eq(applications.id, appId), eq(applications.userId, session.user.id)));
```

---

### C2. IDOR: Any authenticated user can submit any application

**File:** `src/app/api/applications/submit/route.ts:22-29`

Same as C1 — the submit endpoint marks an application as "submitted" using only the `applicationId` without verifying the user owns it.

```typescript
// CURRENT (line 22-29) — no ownership check
await db
  .update(applications)
  .set({ status: "submitted", currentStep: 6, updatedAt: new Date() })
  .where(eq(applications.id, applicationId));
```

**Fix:**
```typescript
import { and } from "drizzle-orm";

await db
  .update(applications)
  .set({ status: "submitted", currentStep: 6, updatedAt: new Date() })
  .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));
```

Also add a check that the result actually updated a row, and return 404 if not.

---

### C3. IDOR: Any authenticated user can upload files to any application

**File:** `src/app/api/upload/route.ts:18,42`

The upload endpoint takes `applicationId` from the form data and writes a document record without verifying the application belongs to the authenticated user.

**Fix:** Before inserting the document, query the application and verify ownership:
```typescript
const [app] = await db
  .select({ id: applications.id })
  .from(applications)
  .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));

if (!app) {
  return NextResponse.json({ error: "Application not found" }, { status: 404 });
}
```

---

### C4. Uploaded immigration documents are publicly accessible

**File:** `src/app/api/upload/route.ts:29,45`

Files are saved to `public/uploads/` and served as unauthenticated static assets. Sensitive documents (passports, bank statements, criminal records) are accessible to anyone who knows or guesses the UUID filename. There is no authentication layer for file downloads.

**Fix:** Store files outside `public/` (or use cloud storage like S3/R2 with signed URLs), and create an authenticated download API route that verifies ownership before streaming the file.

---

### C5. Upload route will crash on Vercel — read-only filesystem

**File:** `src/app/api/upload/route.ts:29-39`

Vercel deployments have a read-only filesystem. `writeFile()` to `public/uploads/` will throw an `EROFS` error at runtime, making the entire upload feature non-functional in production.

```typescript
// This will throw EROFS on Vercel
const uploadDir = path.join(process.cwd(), "public", "uploads");
await mkdir(uploadDir, { recursive: true });
await writeFile(filePath, Buffer.from(bytes));
```

**Fix:** Use cloud object storage (Vercel Blob, S3, Cloudflare R2) instead of the local filesystem.

---

### C6. Upload route: No file size limit — denial of service

**File:** `src/app/api/upload/route.ts`

The upload endpoint has zero server-side file size validation. An attacker can upload arbitrarily large files, exhausting disk space or memory. The UI mentions "10MB" but this is never enforced.

**Fix:** Add size validation before processing:
```typescript
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
if (file.size > MAX_SIZE) {
  return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 413 });
}
```

---

### C7. Upload route: No server-side file type validation

**File:** `src/app/api/upload/route.ts:33`

The route accepts any file extension. The `accept=".pdf,.jpg,.jpeg,.png"` attribute on the HTML input is client-side only and trivially bypassed with curl/Postman. An attacker could upload `.html` files (for stored XSS served from your domain), `.svg` (XSS vector), or any other type.

**Fix:** Validate the extension server-side:
```typescript
const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
const ext = path.extname(file.name).toLowerCase();
if (!allowedExtensions.includes(ext)) {
  return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
}
```

Also validate the MIME type (`file.type`) as a secondary check.

---

### C8. GET/POST /api/applications — Unhandled exceptions crash the route

**File:** `src/app/api/applications/route.ts` (entire file)

Neither the GET handler (line 8-37) nor the POST handler (line 40-102) have try/catch blocks. If `request.json()` throws on malformed input, or a DB query fails, the route returns an unhandled 500 with a stack trace that may leak internal details (DB connection strings, table names).

**Fix:** Wrap both handlers in try/catch:
```typescript
export async function GET() {
  try {
    // ... existing code
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // ... existing code
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

---

## HIGH — Breaks functionality

### H1. Uploaded documents are lost when resuming onboarding

**File:** `src/app/onboarding/page.tsx:37,42-61`

When a user returns to continue their application, `loadApplication()` fetches application fields from the API but never loads existing uploaded documents. The `uploadedDocs` state is initialized as `[]` and never populated from the server.

**Result:** Users see all documents as "not uploaded" when resuming. They have to re-upload everything. On the Review step (Step 6), previously uploaded documents don't appear.

**Fix:**
1. Add a documents endpoint or include documents in the GET /api/applications response
2. Populate `uploadedDocs` from the loaded application data:

```typescript
// In GET /api/applications route, include documents:
const docs = await db
  .select()
  .from(documents)
  .where(eq(documents.applicationId, app.id));
return { ...app, fields, documents: docs };

// In onboarding page loadApplication():
if (app.documents) {
  setUploadedDocs(app.documents.map(d => ({
    id: d.id,
    fileName: d.fileName,
    fileUrl: d.fileUrl,
    documentType: d.documentType,
    status: d.status,
  })));
}
```

---

### H2. N+1 query in GET /api/applications

**File:** `src/app/api/applications/route.ts:20-34`

For each application, a separate DB query fetches `applicationData`. With N applications, this executes N+1 queries.

```typescript
// Executes 1 query for applications + N queries for data
const appsWithData = await Promise.all(
  userApps.map(async (app) => {
    const data = await db
      .select()
      .from(applicationData)
      .where(eq(applicationData.applicationId, app.id));
```

**Fix:** Fetch all applicationData in a single query:
```typescript
const allAppIds = userApps.map(app => app.id);
const allData = await db
  .select()
  .from(applicationData)
  .where(inArray(applicationData.applicationId, allAppIds));

// Group by applicationId in JS
const dataByAppId = allData.reduce((acc, d) => {
  (acc[d.applicationId] ??= []).push(d);
  return acc;
}, {} as Record<string, typeof allData>);
```

---

### H3. Application field updates are not atomic

**File:** `src/app/api/applications/route.ts:74-98`

Field data is upserted one-at-a-time in a loop. If the request has 9 fields and the 5th write fails, fields 1-4 are saved but 5-9 are lost, leaving the application in an inconsistent state.

**Fix:** Wrap the loop in a transaction (requires switching to neon-websocket driver for transactions, or batching with a CTE).

---

### H4. next.config.ts references removed SQLite dependency

**File:** `next.config.ts:4`

```typescript
serverExternalPackages: ["better-sqlite3"],
```

This is a leftover from the SQLite-to-Postgres migration. While it won't cause build failures (the package is just never loaded), it signals that the migration was incomplete and could confuse developers.

**Fix:** Remove the line:
```typescript
const nextConfig: NextConfig = {};
```

---

## MEDIUM — UX issues or missing validation

### M1. No email format validation on registration

**File:** `src/app/api/auth/register/route.ts:11`

The endpoint checks `!email` (empty) but doesn't validate format. Users can register with `email: "notanemail"` and the account will be created.

**Fix:** Add email format validation:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
}
```

---

### M2. No rate limiting on authentication endpoints

**Files:** `src/app/api/auth/register/route.ts`, `src/lib/auth.ts` (authorize)

There is no rate limiting on sign-in or registration. An attacker can brute-force passwords or create thousands of accounts.

**Fix:** Add rate limiting via middleware or use a library like `@upstash/ratelimit` with a Redis/KV store.

---

### M3. No input length/format validation on application fields

**File:** `src/app/api/applications/route.ts:46,74`

The POST handler accepts `fields` from user input and stores them directly. There is no validation on field names, field values, or types. A user could send thousands of arbitrary fields, or extremely long values.

**Fix:** Validate field names against an allowlist and enforce maximum lengths. The `zod` package is already installed but unused — use it here.

---

### M4. Passport number and financial data stored as plain text

**Files:** `src/lib/db/schema.ts` (applicationData table), `src/app/api/applications/route.ts:91`

Sensitive personal data (passport numbers, bank names, income figures) is stored as plain text in `application_data.field_value`. For compliance (GDPR, etc.), sensitive fields should be encrypted at rest.

---

### M5. No password complexity validation beyond length

**File:** `src/app/api/auth/register/route.ts:18`

Password validation only checks `length < 8`. No requirements for uppercase, numbers, or special characters.

---

### M6. Dashboard date display may show "Invalid Date"

**File:** `src/app/dashboard/page.tsx:195,201`

```typescript
{new Date(app.createdAt).toLocaleDateString()}
```

If the Neon driver returns timestamps in an unexpected format, `new Date()` could produce `Invalid Date`. The code has no fallback.

**Fix:** Add a safe date formatter:
```typescript
const formatDate = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};
```

---

### M7. Submit endpoint returns success even if no rows updated

**File:** `src/app/api/applications/submit/route.ts:22-31`

If the `applicationId` doesn't exist (or doesn't belong to the user after fixing C2), the UPDATE affects 0 rows but the response is still `{ success: true }`.

**Fix:** Check the result and return 404:
```typescript
const result = await db.update(applications)...;
if (result.rowCount === 0) {
  return NextResponse.json({ error: "Application not found" }, { status: 404 });
}
```

---

## LOW — Code quality / best practices

### L1. `zod` is installed but never used

**File:** `package.json:33`

Zod is listed as a dependency but no file imports it. It should either be used for API input validation (recommended — it would fix M3) or removed.

---

### L2. `uuid` package can be replaced with `crypto.randomUUID()`

**File:** `src/app/api/upload/route.ts:2`

Node.js 19+ and all modern runtimes include `crypto.randomUUID()`. The `uuid` dependency is unnecessary.

---

### L3. `serverExternalPackages` references non-existent dependency

**File:** `next.config.ts:4` (also noted in H4)

Dead configuration from SQLite migration.

---

### L4. Inconsistent error handling patterns across routes

- `register/route.ts` — has try/catch, returns proper errors
- `applications/route.ts` — no try/catch
- `applications/submit/route.ts` — no try/catch
- `upload/route.ts` — has try/catch

All API routes should follow the same error handling pattern.

---

### L5. No `loading.tsx` or `error.tsx` boundary pages

**Files:** Missing in `src/app/`, `src/app/dashboard/`, `src/app/onboarding/`

Next.js App Router supports `error.tsx` for automatic error boundaries and `loading.tsx` for Suspense fallbacks. Neither is present. Unhandled errors in page components will show the default Next.js error page.

---

### L6. Middleware matcher excludes `/uploads` but could be more explicit

**File:** `src/middleware.ts:25`

```typescript
matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
```

The `uploads` exclusion is correct for the current static file approach, but if uploads move to an API route (per fix for C4/C5), this exclusion should be removed.

---

### L7. No `rel="noopener noreferrer"` on potential external links

The Terms of Service and Privacy Policy links in `Step6Review.tsx:164-166` are `<span>` elements, not actual links. If they're ever converted to real links, they should include proper rel attributes.

---

### L8. `visaLabels` duplicated across three files

**Files:** `src/app/dashboard/page.tsx:18-25`, `src/app/onboarding/Step3VisaDetails.tsx:103-110`, `src/app/onboarding/Step6Review.tsx:15-22`

The same visa label mapping is defined in three places. Should be extracted to a shared constants file.

---

## Summary

| Severity | Count | Key Theme |
|----------|-------|-----------|
| CRITICAL | 8     | IDOR authorization bypass, upload security, missing error handling |
| HIGH     | 4     | Data loss on resume, N+1 queries, non-atomic writes |
| MEDIUM   | 7     | Input validation, data protection, UX edge cases |
| LOW      | 8     | Code quality, dead dependencies, duplication |

**Top 3 priorities:**
1. Fix all IDOR vulnerabilities (C1, C2, C3) — any authenticated user can tamper with any other user's application
2. Fix upload security (C4-C7) — public file access, no size/type limits, broken on Vercel
3. Fix document loading on resume (H1) — users lose uploaded documents when returning to their application
