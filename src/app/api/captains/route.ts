import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { captains, users, reviews } from "@/lib/db/schema";
import { eq, ilike, sql, and } from "drizzle-orm";
import { captainRegisterSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET: list/search captains
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const language = searchParams.get("language");
    const expertise = searchParams.get("expertise");

    const conditions = [eq(captains.status, "verified")];

    if (city) {
      conditions.push(ilike(captains.city, `%${city}%`));
    }

    const allCaptains = await db
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
      .where(and(...conditions))
      .groupBy(captains.id, users.id);

    let filtered = allCaptains;

    if (language) {
      filtered = filtered.filter((c) =>
        c.languages.some((l) => l.toLowerCase() === language.toLowerCase())
      );
    }
    if (expertise) {
      filtered = filtered.filter((c) =>
        c.expertise.some((e) => e.toLowerCase() === expertise.toLowerCase())
      );
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("GET /api/captains error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: register as captain
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = captainRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Check if already registered
    const existing = await db
      .select({ id: captains.id })
      .from(captains)
      .where(eq(captains.userId, session.user.id));

    if (existing.length > 0) {
      return NextResponse.json({ error: "Already registered as captain" }, { status: 409 });
    }

    const [captain] = await db
      .insert(captains)
      .values({
        userId: session.user.id,
        bio: parsed.data.bio,
        city: parsed.data.city,
        languages: parsed.data.languages,
        expertise: parsed.data.expertise,
        hourlyRate: parsed.data.hourlyRate,
      })
      .returning();

    // Update user role
    await db.update(users).set({ role: "captain" }).where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true, captain });
  } catch (error) {
    console.error("POST /api/captains error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
