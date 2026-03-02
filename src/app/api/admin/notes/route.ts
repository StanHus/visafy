import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminNotes, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { adminNoteSchema } from "@/lib/validations";

// GET: get notes for an application
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID required" }, { status: 400 });
    }

    const notes = await db
      .select({
        id: adminNotes.id,
        content: adminNotes.content,
        createdAt: adminNotes.createdAt,
        adminName: users.fullName,
      })
      .from(adminNotes)
      .leftJoin(users, eq(adminNotes.adminId, users.id))
      .where(eq(adminNotes.applicationId, applicationId))
      .orderBy(desc(adminNotes.createdAt));

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/admin/notes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: add a note
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = adminNoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const [note] = await db.insert(adminNotes).values({
      applicationId: parsed.data.applicationId,
      adminId: session.user.id,
      content: parsed.data.content,
    }).returning();

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error("POST /api/admin/notes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
