import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, applicationData } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET: fetch user's application(s)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userApps = await db
    .select()
    .from(applications)
    .where(eq(applications.userId, session.user.id));

  // For each application, get its data
  const appsWithData = await Promise.all(
    userApps.map(async (app) => {
      const data = await db
        .select()
        .from(applicationData)
        .where(eq(applicationData.applicationId, app.id));

      const fields: Record<string, string> = {};
      data.forEach((d) => {
        fields[d.fieldName] = d.fieldValue;
      });

      return { ...app, fields };
    })
  );

  return NextResponse.json(appsWithData);
}

// POST: create a new application or update existing
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { applicationId, step, fields, visaType, currentStep } = body;

  const now = new Date().toISOString();

  let appId = applicationId;

  if (!appId) {
    // Create new application
    appId = uuidv4();
    await db.insert(applications).values({
      id: appId,
      userId: session.user.id,
      visaType: visaType || null,
      status: "draft",
      currentStep: currentStep || 1,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    // Update existing application
    const updates: Record<string, unknown> = { updatedAt: now };
    if (visaType !== undefined) updates.visaType = visaType;
    if (currentStep !== undefined) updates.currentStep = currentStep;

    await db
      .update(applications)
      .set(updates)
      .where(eq(applications.id, appId));
  }

  // Save field data for this step
  if (fields && step) {
    for (const [fieldName, fieldValue] of Object.entries(fields)) {
      const existing = await db
        .select()
        .from(applicationData)
        .where(
          and(
            eq(applicationData.applicationId, appId),
            eq(applicationData.fieldName, fieldName)
          )
        )
        .get();

      if (existing) {
        await db
          .update(applicationData)
          .set({ fieldValue: fieldValue as string, updatedAt: now })
          .where(eq(applicationData.id, existing.id));
      } else {
        await db.insert(applicationData).values({
          id: uuidv4(),
          applicationId: appId,
          stepNumber: step,
          fieldName,
          fieldValue: fieldValue as string,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  }

  return NextResponse.json({ success: true, applicationId: appId });
}
