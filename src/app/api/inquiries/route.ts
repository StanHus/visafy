import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { inquiries, inquiryMessages, properties, users } from "@/lib/db/schema";
import { eq, or, sql } from "drizzle-orm";
import { inquiryCreateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET: list user's inquiries (as tenant or landlord)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userInquiries = await db
      .select({
        id: inquiries.id,
        propertyId: inquiries.propertyId,
        tenantId: inquiries.tenantId,
        landlordId: inquiries.landlordId,
        message: inquiries.message,
        status: inquiries.status,
        createdAt: inquiries.createdAt,
        propertyTitle: properties.title,
        propertyCity: properties.city,
        tenantName: sql<string>`tenant_user.full_name`,
        landlordName: sql<string>`landlord_user.full_name`,
      })
      .from(inquiries)
      .innerJoin(properties, eq(inquiries.propertyId, properties.id))
      .innerJoin(
        sql`users AS tenant_user`,
        sql`tenant_user.id = ${inquiries.tenantId}`
      )
      .innerJoin(
        sql`users AS landlord_user`,
        sql`landlord_user.id = ${inquiries.landlordId}`
      )
      .where(
        or(
          eq(inquiries.tenantId, session.user.id),
          eq(inquiries.landlordId, session.user.id)
        )
      )
      .orderBy(sql`${inquiries.createdAt} DESC`);

    return NextResponse.json(userInquiries);
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: create inquiry
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = inquiryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Get property to find landlord
    const [property] = await db
      .select({ id: properties.id, landlordId: properties.landlordId })
      .from(properties)
      .where(eq(properties.id, parsed.data.propertyId));

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (property.landlordId === session.user.id) {
      return NextResponse.json({ error: "Cannot inquire about your own property" }, { status: 400 });
    }

    const [inquiry] = await db
      .insert(inquiries)
      .values({
        propertyId: parsed.data.propertyId,
        tenantId: session.user.id,
        landlordId: property.landlordId,
        message: parsed.data.message,
      })
      .returning();

    // Also create the first message in the thread
    await db.insert(inquiryMessages).values({
      inquiryId: inquiry.id,
      senderId: session.user.id,
      message: parsed.data.message,
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
