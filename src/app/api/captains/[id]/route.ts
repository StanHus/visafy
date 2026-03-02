import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { captains, users, reviews, bookings } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET: captain profile + reviews
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [captain] = await db
      .select({
        id: captains.id,
        userId: captains.userId,
        bio: captains.bio,
        photoUrl: captains.photoUrl,
        city: captains.city,
        languages: captains.languages,
        expertise: captains.expertise,
        hourlyRate: captains.hourlyRate,
        status: captains.status,
        createdAt: captains.createdAt,
        fullName: users.fullName,
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(captains)
      .innerJoin(users, eq(captains.userId, users.id))
      .leftJoin(reviews, eq(captains.id, reviews.captainId))
      .where(eq(captains.id, id))
      .groupBy(captains.id, users.id);

    if (!captain) {
      return NextResponse.json({ error: "Captain not found" }, { status: 404 });
    }

    // Fetch reviews with reviewer names
    const captainReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        reviewerName: users.fullName,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.captainId, id))
      .orderBy(sql`${reviews.createdAt} DESC`);

    // Fetch completed bookings count
    const [stats] = await db
      .select({
        completedBookings: sql<number>`COUNT(*)`,
      })
      .from(bookings)
      .where(eq(bookings.captainId, id));

    return NextResponse.json({
      ...captain,
      reviews: captainReviews,
      completedBookings: stats?.completedBookings || 0,
    });
  } catch (error) {
    console.error("GET /api/captains/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
