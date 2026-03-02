import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { properties, propertyImages, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET: property detail with images
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [property] = await db
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
      .where(eq(properties.id, id));

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const images = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, id))
      .orderBy(sql`${propertyImages.sortOrder} ASC`);

    return NextResponse.json({ ...property, images });
  } catch (error) {
    console.error("GET /api/properties/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
