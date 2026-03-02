import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { properties, propertyImages, users } from "@/lib/db/schema";
import { eq, ilike, gte, lte, and, sql } from "drizzle-orm";
import { propertyCreateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET: search/list properties
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rooms = searchParams.get("rooms");
    const furnished = searchParams.get("furnished");
    const visaFriendly = searchParams.get("visaFriendly");

    const conditions = [eq(properties.status, "active")];

    if (city) conditions.push(ilike(properties.city, `%${city}%`));
    if (minPrice) conditions.push(gte(properties.priceMonthly, parseInt(minPrice)));
    if (maxPrice) conditions.push(lte(properties.priceMonthly, parseInt(maxPrice)));
    if (rooms) conditions.push(eq(properties.rooms, parseInt(rooms)));
    if (furnished === "true") conditions.push(eq(properties.furnished, true));
    if (visaFriendly === "true") conditions.push(eq(properties.visaFriendly, true));

    const allProperties = await db
      .select({
        id: properties.id,
        landlordId: properties.landlordId,
        title: properties.title,
        description: properties.description,
        city: properties.city,
        address: properties.address,
        priceMonthly: properties.priceMonthly,
        rooms: properties.rooms,
        bathrooms: properties.bathrooms,
        areaSqm: properties.areaSqm,
        furnished: properties.furnished,
        visaFriendly: properties.visaFriendly,
        amenities: properties.amenities,
        status: properties.status,
        verified: properties.verified,
        createdAt: properties.createdAt,
        landlordName: users.fullName,
      })
      .from(properties)
      .innerJoin(users, eq(properties.landlordId, users.id))
      .where(and(...conditions))
      .orderBy(sql`${properties.createdAt} DESC`);

    // Fetch primary images for all properties
    const propIds = allProperties.map((p) => p.id);
    let images: { propertyId: string; imageUrl: string }[] = [];
    if (propIds.length > 0) {
      images = await db
        .select({
          propertyId: propertyImages.propertyId,
          imageUrl: propertyImages.imageUrl,
        })
        .from(propertyImages)
        .where(eq(propertyImages.isPrimary, true));
    }

    const imageMap = new Map(images.map((img) => [img.propertyId, img.imageUrl]));

    const result = allProperties.map((p) => ({
      ...p,
      primaryImage: imageMap.get(p.id) || null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/properties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: create property listing
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = propertyCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const [property] = await db
      .insert(properties)
      .values({
        landlordId: session.user.id,
        title: parsed.data.title,
        description: parsed.data.description || null,
        city: parsed.data.city,
        address: parsed.data.address || null,
        priceMonthly: parsed.data.priceMonthly,
        rooms: parsed.data.rooms ?? null,
        bathrooms: parsed.data.bathrooms ?? null,
        areaSqm: parsed.data.areaSqm ?? null,
        furnished: parsed.data.furnished,
        visaFriendly: parsed.data.visaFriendly,
        amenities: parsed.data.amenities || [],
      })
      .returning();

    // Update user role to landlord if not admin
    const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, session.user.id));
    if (user?.role === "client") {
      await db.update(users).set({ role: "landlord" }).where(eq(users.id, session.user.id));
    }

    return NextResponse.json({ success: true, property });
  } catch (error) {
    console.error("POST /api/properties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
