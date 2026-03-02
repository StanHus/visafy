import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, captains, users } from "@/lib/db/schema";
import { eq, or, sql } from "drizzle-orm";
import { bookingCreateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET: list user's bookings (as client or captain)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find captain record if exists
    const [captain] = await db
      .select({ id: captains.id })
      .from(captains)
      .where(eq(captains.userId, session.user.id));

    const conditions = captain
      ? or(eq(bookings.clientId, session.user.id), eq(bookings.captainId, captain.id))
      : eq(bookings.clientId, session.user.id);

    const userBookings = await db
      .select({
        id: bookings.id,
        captainId: bookings.captainId,
        clientId: bookings.clientId,
        date: bookings.date,
        startTime: bookings.startTime,
        durationMinutes: bookings.durationMinutes,
        status: bookings.status,
        totalAmount: bookings.totalAmount,
        captainPayout: bookings.captainPayout,
        platformFee: bookings.platformFee,
        notes: bookings.notes,
        createdAt: bookings.createdAt,
        captainName: sql<string>`cap_user.full_name`,
        clientName: sql<string>`cli_user.full_name`,
      })
      .from(bookings)
      .innerJoin(captains, eq(bookings.captainId, captains.id))
      .innerJoin(
        sql`users AS cap_user`,
        sql`cap_user.id = ${captains.userId}`
      )
      .innerJoin(
        sql`users AS cli_user`,
        sql`cli_user.id = ${bookings.clientId}`
      )
      .where(conditions!)
      .orderBy(sql`${bookings.date} DESC`);

    return NextResponse.json(userBookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: create booking
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Get captain info
    const [captain] = await db
      .select()
      .from(captains)
      .where(eq(captains.id, parsed.data.captainId));

    if (!captain || captain.status !== "verified") {
      return NextResponse.json({ error: "Captain not found or not verified" }, { status: 404 });
    }

    // Can't book yourself
    if (captain.userId === session.user.id) {
      return NextResponse.json({ error: "Cannot book yourself" }, { status: 400 });
    }

    // Calculate amounts
    const hourlyRate = captain.hourlyRate || 3000; // default €30/hr
    const totalAmount = Math.round((hourlyRate * parsed.data.durationMinutes) / 60);
    const platformFee = Math.round(totalAmount * 0.15);
    const captainPayout = totalAmount - platformFee;

    const [booking] = await db
      .insert(bookings)
      .values({
        captainId: parsed.data.captainId,
        clientId: session.user.id,
        date: parsed.data.date,
        startTime: parsed.data.startTime,
        durationMinutes: parsed.data.durationMinutes,
        totalAmount,
        captainPayout,
        platformFee,
        notes: parsed.data.notes || null,
      })
      .returning();

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
