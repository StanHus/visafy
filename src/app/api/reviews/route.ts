import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reviews, bookings } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { reviewCreateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

// POST: submit review after completed booking
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reviewCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Verify booking exists, belongs to user, and is completed
    const [booking] = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.id, parsed.data.bookingId),
          eq(bookings.clientId, session.user.id),
          eq(bookings.status, "completed")
        )
      );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or not completed" },
        { status: 404 }
      );
    }

    // Check if already reviewed
    const existing = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(eq(reviews.bookingId, parsed.data.bookingId));

    if (existing.length > 0) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
    }

    const [review] = await db
      .insert(reviews)
      .values({
        bookingId: parsed.data.bookingId,
        reviewerId: session.user.id,
        captainId: booking.captainId,
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
      })
      .returning();

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
