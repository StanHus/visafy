import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { captains, captainAvailability } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { availabilitySchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET: get captain availability
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const captainId = searchParams.get("captainId");

    if (!captainId) {
      // Get own availability
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const [captain] = await db
        .select({ id: captains.id })
        .from(captains)
        .where(eq(captains.userId, session.user.id));

      if (!captain) {
        return NextResponse.json({ error: "Not a captain" }, { status: 403 });
      }

      const slots = await db
        .select()
        .from(captainAvailability)
        .where(eq(captainAvailability.captainId, captain.id));

      return NextResponse.json(slots);
    }

    // Get specific captain's availability
    const slots = await db
      .select()
      .from(captainAvailability)
      .where(eq(captainAvailability.captainId, captainId));

    return NextResponse.json(slots);
  } catch (error) {
    console.error("GET /api/captains/availability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: update captain availability
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [captain] = await db
      .select({ id: captains.id })
      .from(captains)
      .where(eq(captains.userId, session.user.id));

    if (!captain) {
      return NextResponse.json({ error: "Not a captain" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = availabilitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Delete old and insert new
    await db
      .delete(captainAvailability)
      .where(eq(captainAvailability.captainId, captain.id));

    if (parsed.data.slots.length > 0) {
      await db.insert(captainAvailability).values(
        parsed.data.slots.map((slot) => ({
          captainId: captain.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/captains/availability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
