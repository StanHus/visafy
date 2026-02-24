import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, applicationData, documents } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

// GET: fetch user's application(s) with fields and documents (H1, H2)
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

    // Fix H2: batch fetch all application data instead of N+1
    const allAppIds = userApps.map((app) => app.id);
    const allData = await db
      .select()
      .from(applicationData)
      .where(inArray(applicationData.applicationId, allAppIds));

    const dataByAppId = allData.reduce((acc, d) => {
      (acc[d.applicationId] ??= []).push(d);
      return acc;
    }, {} as Record<string, typeof allData>);

    // Fix H1: include documents
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

// POST: create a new application or update existing (C1, C8)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, step, fields, visaType, currentStep } = body;

    let appId = applicationId;

    if (!appId) {
      // Create new application
      const [newApp] = await db.insert(applications).values({
        userId: session.user.id,
        visaType: visaType || null,
        status: "draft",
        currentStep: currentStep || 1,
      }).returning({ id: applications.id });
      appId = newApp.id;
    } else {
      // Fix C1: add userId ownership check
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

    // Save field data for this step
    if (fields && step) {
      for (const [fieldName, fieldValue] of Object.entries(fields)) {
        const [existing] = await db
          .select()
          .from(applicationData)
          .where(
            and(
              eq(applicationData.applicationId, appId),
              eq(applicationData.fieldName, fieldName)
            )
          );

        if (existing) {
          await db
            .update(applicationData)
            .set({ fieldValue: fieldValue as string, updatedAt: new Date() })
            .where(eq(applicationData.id, existing.id));
        } else {
          await db.insert(applicationData).values({
            applicationId: appId,
            stepNumber: step,
            fieldName,
            fieldValue: fieldValue as string,
          });
        }
      }
    }

    return NextResponse.json({ success: true, applicationId: appId });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
