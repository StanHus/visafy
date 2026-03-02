import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, statusHistory } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { applicationSubmitSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = applicationSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Application ID required" }, { status: 400 });
    }

    const { applicationId } = parsed.data;

    // Fetch current status before updating
    const [currentApp] = await db
      .select({ status: applications.status })
      .from(applications)
      .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));

    if (!currentApp) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const result = await db
      .update(applications)
      .set({
        status: "submitted",
        currentStep: 6,
        updatedAt: new Date(),
      })
      .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Record status change in history
    await db.insert(statusHistory).values({
      applicationId,
      oldStatus: currentApp.status,
      newStatus: "submitted",
      changedBy: session.user.id,
      note: "Application submitted by applicant",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/applications/submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
