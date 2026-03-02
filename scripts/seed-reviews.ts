/**
 * Seed script: adds 3-5 realistic reviews per captain.
 *
 * Usage:
 *   npx tsx scripts/seed-reviews.ts
 *
 * Requires DATABASE_URL in .env or environment.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { randomUUID } from "crypto";
import * as schema from "../src/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Realistic reviewer names
const reviewers = [
  { name: "Emily Richardson", email: "emily.richardson@example.com" },
  { name: "Marco Bianchi", email: "marco.bianchi@example.com" },
  { name: "Yuki Tanaka", email: "yuki.tanaka@example.com" },
  { name: "Sarah O'Connor", email: "sarah.oconnor@example.com" },
  { name: "Dmitry Volkov", email: "dmitry.volkov@example.com" },
  { name: "Priya Sharma", email: "priya.sharma@example.com" },
  { name: "Lucas Müller", email: "lucas.mueller@example.com" },
  { name: "Olivia Chen", email: "olivia.chen@example.com" },
  { name: "Tomás Herrera", email: "tomas.herrera@example.com" },
  { name: "Nadia Kowalski", email: "nadia.kowalski@example.com" },
  { name: "David Park", email: "david.park@example.com" },
  { name: "Isabella Rossi", email: "isabella.rossi@example.com" },
  { name: "Alexander Wright", email: "alexander.wright@example.com" },
  { name: "Fatima Al-Rashid", email: "fatima.alrashid@example.com" },
  { name: "Henrik Johansson", email: "henrik.johansson@example.com" },
];

// Realistic review comments grouped by theme
const reviewTemplates = [
  // Visa help
  { rating: 5, comment: "Incredibly knowledgeable about the digital nomad visa process. Walked me through every document I needed and even helped me find a gestoría. Saved me weeks of confusion!" },
  { rating: 5, comment: "Best decision I made during my move to Spain. They knew exactly which documents the consulate would ask for and helped me prepare everything in advance." },
  { rating: 4, comment: "Very helpful with my golden visa application. Explained the investment requirements clearly and connected me with a reliable lawyer. Would have been lost without this guidance." },
  { rating: 5, comment: "After months of trying to figure out the non-lucrative visa on my own, one session changed everything. Clear, practical advice that actually works." },
  { rating: 4, comment: "Great help with my work visa paperwork. The only reason it's not 5 stars is that we ran slightly over time, but the advice was excellent." },

  // Housing help
  { rating: 5, comment: "Found me a visa-friendly apartment in Barcelona within two weeks. Knew exactly which landlords accept foreign tenants and which neighborhoods to avoid." },
  { rating: 4, comment: "Really useful tips on the rental market in Madrid. Helped me understand the NIE process for signing a lease and what to watch out for in contracts." },
  { rating: 5, comment: "As someone who doesn't speak much Spanish, having a guide who could explain lease terms and tenant rights was invaluable. Highly recommend!" },

  // Cultural adjustment
  { rating: 5, comment: "Made my transition to life in Spain so much smoother. From opening a bank account to understanding the healthcare system — covered everything I needed." },
  { rating: 5, comment: "Not just immigration help — they gave me real insider tips about daily life in Spain. Where to shop, how to deal with bureaucracy, even the best tapas spots!" },
  { rating: 4, comment: "Very warm and welcoming person. Helped me feel less anxious about the move. Practical advice about empadronamiento and setting up utilities." },
  { rating: 5, comment: "The cultural tips alone were worth it. Understanding Spanish work culture, social norms, and how appointments actually work here was a game-changer." },

  // General positive
  { rating: 5, comment: "Professional, patient, and genuinely cared about my situation. Answered all my follow-up questions even after our session ended. Five stars all the way." },
  { rating: 4, comment: "Very professional and organized. Had a clear agenda for our session and covered more ground than I expected. Will definitely book again." },
  { rating: 5, comment: "Worth every euro. The peace of mind alone from having someone who actually understands the system is priceless. Don't try to do this alone!" },
  { rating: 4, comment: "Solid advice and very responsive. Helped me prioritize my to-do list for the move and gave realistic timelines for each step." },
  { rating: 5, comment: "I was so stressed about my family reunification visa and they made the whole process feel manageable. Patient, knowledgeable, and kind." },
  { rating: 5, comment: "Second time booking with this captain and just as great as the first. They remembered my situation and picked up right where we left off." },
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomDate(daysBack: number): Date {
  const now = Date.now();
  const offset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - offset);
}

async function main() {
  console.log("Fetching captains...");
  const allCaptains = await db.select().from(schema.captains);

  if (allCaptains.length === 0) {
    console.log("No captains found in the database. Seed captains first.");
    process.exit(1);
  }

  console.log(`Found ${allCaptains.length} captain(s). Seeding reviews...`);

  let totalReviews = 0;

  for (const captain of allCaptains) {
    const reviewCount = 3 + Math.floor(Math.random() * 3); // 3-5 reviews
    const selectedReviews = pickRandom(reviewTemplates, reviewCount);
    const selectedReviewers = pickRandom(reviewers, reviewCount);

    for (let i = 0; i < reviewCount; i++) {
      const reviewer = selectedReviewers[i];
      const review = selectedReviews[i];

      // Create reviewer user
      const userId = randomUUID();
      await db.insert(schema.users).values({
        id: userId,
        email: `seed_${userId.slice(0, 8)}_${reviewer.email}`,
        fullName: reviewer.name,
        role: "client",
      });

      // Create a completed booking
      const bookingId = randomUUID();
      const bookingDate = randomDate(180); // last 6 months
      await db.insert(schema.bookings).values({
        id: bookingId,
        captainId: captain.id,
        clientId: userId,
        date: bookingDate.toISOString().split("T")[0],
        startTime: "10:00",
        durationMinutes: 60,
        status: "completed",
        totalAmount: captain.hourlyRate ?? 5000,
        captainPayout: Math.round((captain.hourlyRate ?? 5000) * 0.85),
        platformFee: Math.round((captain.hourlyRate ?? 5000) * 0.15),
        notes: "Seeded booking",
      });

      // Create the review
      const reviewDate = new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000); // 1 day after booking
      await db.insert(schema.reviews).values({
        id: randomUUID(),
        bookingId,
        reviewerId: userId,
        captainId: captain.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: reviewDate,
      });

      totalReviews++;
      console.log(
        `  [${captain.city}] ${reviewer.name} → ${review.rating}★`
      );
    }
  }

  console.log(`\nDone! Seeded ${totalReviews} reviews for ${allCaptains.length} captain(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
