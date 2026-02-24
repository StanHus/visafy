import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID required" },
        { status: 400 }
      );
    }

    // Fix C2: add userId ownership check
    const result = await db
      .update(applications)
      .set({
        status: "submitted",
        currentStep: 6,
        updatedAt: new Date(),
      })
      .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));

    // Fix M7: check if row was actually updated
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/applications/submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
