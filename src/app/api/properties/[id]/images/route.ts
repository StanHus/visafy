import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { properties, propertyImages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

// POST: upload property image via Vercel Blob
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: propertyId } = await params;

    // Verify ownership
    const [property] = await db
      .select({ id: properties.id })
      .from(properties)
      .where(
        and(
          eq(properties.id, propertyId),
          eq(properties.landlordId, session.user.id)
        )
      );

    if (!property) {
      return NextResponse.json({ error: "Property not found or not owned" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const isPrimary = formData.get("isPrimary") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WebP" },
        { status: 400 }
      );
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB" }, { status: 400 });
    }

    const blob = await put(`properties/${propertyId}/${file.name}`, file, {
      access: "public",
    });

    // If isPrimary, unset other primary images
    if (isPrimary) {
      await db
        .update(propertyImages)
        .set({ isPrimary: false })
        .where(eq(propertyImages.propertyId, propertyId));
    }

    const existingImages = await db
      .select({ sortOrder: propertyImages.sortOrder })
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId));

    const nextOrder = existingImages.length > 0
      ? Math.max(...existingImages.map((i) => i.sortOrder)) + 1
      : 0;

    const [image] = await db
      .insert(propertyImages)
      .values({
        propertyId,
        imageUrl: blob.url,
        isPrimary: isPrimary || existingImages.length === 0,
        sortOrder: nextOrder,
      })
      .returning();

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error("POST /api/properties/[id]/images error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
