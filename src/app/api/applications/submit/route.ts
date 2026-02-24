import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
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

  const now = new Date().toISOString();

  await db
    .update(applications)
    .set({
      status: "submitted",
      currentStep: 6,
      updatedAt: now,
    })
    .where(eq(applications.id, applicationId));

  return NextResponse.json({ success: true });
}
