import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, applicationData, documents } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { applicationPostSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET: fetch user's application(s) with fields and documents
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userApps = await db
      .select()
      .from(applications)
      .where(eq(applications.userId, session.user.id));

    if (userApps.length === 0) {
      return NextResponse.json([]);
    }

    const allAppIds = userApps.map((app) => app.id);
    const allData = await db
      .select()
      .from(applicationData)
      .where(inArray(applicationData.applicationId, allAppIds));

    const dataByAppId = allData.reduce((acc, d) => {
      (acc[d.applicationId] ??= []).push(d);
      return acc;
    }, {} as Record<string, typeof allData>);

    const allDocs = await db
      .select()
      .from(documents)
      .where(inArray(documents.applicationId, allAppIds));

    const docsByAppId = allDocs.reduce((acc, d) => {
      (acc[d.applicationId] ??= []).push(d);
      return acc;
    }, {} as Record<string, typeof allDocs>);

    const appsWithData = userApps.map((app) => {
      const data = dataByAppId[app.id] || [];
      const fields: Record<string, string> = {};
      data.forEach((d) => {
        fields[d.fieldName] = d.fieldValue;
      });

      const appDocs = (docsByAppId[app.id] || []).map((d) => ({
        id: d.id,
        fileName: d.fileName,
        fileUrl: d.fileUrl,
        documentType: d.documentType,
        status: d.status,
      }));

      return { ...app, fields, documents: appDocs };
    });

    return NextResponse.json(appsWithData);
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: create a new application or update existing
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = applicationPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { applicationId, step, fields, visaType, currentStep } = parsed.data;

    let appId = applicationId;

    if (!appId) {
      const [newApp] = await db.insert(applications).values({
        userId: session.user.id,
        visaType: visaType || null,
        status: "draft",
        currentStep: currentStep || 1,
      }).returning({ id: applications.id });
      appId = newApp.id;
    } else {
      const updates: Record<string, unknown> = { updatedAt: new Date() };
      if (visaType !== undefined) updates.visaType = visaType;
      if (currentStep !== undefined) updates.currentStep = currentStep;

      const result = await db
        .update(applications)
        .set(updates)
        .where(and(eq(applications.id, appId), eq(applications.userId, session.user.id)));

      if (result.rowCount === 0) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
      }
    }

    // Save field data for this step (batch upsert for atomicity)
    if (fields && step) {
      const fieldNames = Object.keys(fields);
      if (fieldNames.length > 0) {
        // Fetch all existing fields for this app in one query
        const existing = await db
          .select({ id: applicationData.id, fieldName: applicationData.fieldName })
          .from(applicationData)
          .where(
            and(
              eq(applicationData.applicationId, appId),
              inArray(applicationData.fieldName, fieldNames)
            )
          );
        const existingMap = new Map(existing.map((e) => [e.fieldName, e.id]));

        // Batch updates and inserts
        const updates = [];
        const inserts = [];
        for (const [fieldName, fieldValue] of Object.entries(fields)) {
          const existingId = existingMap.get(fieldName);
          if (existingId) {
            updates.push(
              db
                .update(applicationData)
                .set({ fieldValue: fieldValue as string, updatedAt: new Date() })
                .where(eq(applicationData.id, existingId))
            );
          } else {
            inserts.push({
              applicationId: appId,
              stepNumber: step,
              fieldName,
              fieldValue: fieldValue as string,
            });
          }
        }

        // Execute all updates in parallel, insert all new rows in one query
        await Promise.all([
          ...updates,
          ...(inserts.length > 0 ? [db.insert(applicationData).values(inserts)] : []),
        ]);
      }
    }

    return NextResponse.json({ success: true, applicationId: appId });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
