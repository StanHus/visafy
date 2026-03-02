import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { statusHistory, applications, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID required" }, { status: 400 });
    }

    // Verify ownership (unless admin)
    if (session.user.role !== "admin") {
      const [app] = await db
        .select({ id: applications.id })
        .from(applications)
        .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));

      if (!app) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
      }
    }

    const history = await db
      .select({
        id: statusHistory.id,
        oldStatus: statusHistory.oldStatus,
        newStatus: statusHistory.newStatus,
        note: statusHistory.note,
        createdAt: statusHistory.createdAt,
        changedByName: users.fullName,
      })
      .from(statusHistory)
      .leftJoin(users, eq(statusHistory.changedBy, users.id))
      .where(eq(statusHistory.applicationId, applicationId))
      .orderBy(desc(statusHistory.createdAt));

    return NextResponse.json(history);
  } catch (error) {
    console.error("GET /api/status-history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
