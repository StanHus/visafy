import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { documentReviewSchema } from "@/lib/validations";

// PATCH: approve/reject a document
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = documentReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { documentId, status, rejectionReason } = parsed.data;

    const result = await db
      .update(documents)
      .set({
        status,
        rejectionReason: status === "rejected" ? (rejectionReason || null) : null,
      })
      .where(eq(documents.id, documentId));

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/documents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
