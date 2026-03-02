import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  applications,
  applicationData,
  documents,
  users,
  statusHistory,
  adminNotes,
  payments,
} from "@/lib/db/schema";
import { eq, inArray, desc, and, like, sql } from "drizzle-orm";
import { adminStatusUpdateSchema } from "@/lib/validations";
import { sendStatusChangeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
// GET: list all applications with user info (admin only)
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const visaTypeFilter = searchParams.get("visaType");
    const search = searchParams.get("search");

    // Build conditions
    const conditions = [];
    if (statusFilter && statusFilter !== "all") {
      conditions.push(eq(applications.status, statusFilter as "draft"));
    }
    if (visaTypeFilter && visaTypeFilter !== "all") {
      conditions.push(eq(applications.visaType, visaTypeFilter as "work_visa"));
    }

    let allApps;
    if (conditions.length > 0) {
      allApps = await db
        .select()
        .from(applications)
        .where(and(...conditions))
        .orderBy(desc(applications.updatedAt));
    } else {
      allApps = await db
        .select()
        .from(applications)
        .orderBy(desc(applications.updatedAt));
    }

    if (allApps.length === 0) {
      return NextResponse.json([]);
    }

    // Batch fetch related data
    const appIds = allApps.map((a) => a.id);
    const userIds = [...new Set(allApps.map((a) => a.userId))];

    const [allUsers, allData, allDocs, allPayments] = await Promise.all([
      db.select({ id: users.id, fullName: users.fullName, email: users.email })
        .from(users)
        .where(inArray(users.id, userIds)),
      db.select().from(applicationData).where(inArray(applicationData.applicationId, appIds)),
      db.select().from(documents).where(inArray(documents.applicationId, appIds)),
      db.select().from(payments).where(inArray(payments.applicationId, appIds)),
    ]);

    const usersById = Object.fromEntries(allUsers.map((u) => [u.id, u]));
    const dataByApp = allData.reduce((acc, d) => {
      (acc[d.applicationId] ??= []).push(d);
      return acc;
    }, {} as Record<string, typeof allData>);
    const docsByApp = allDocs.reduce((acc, d) => {
      (acc[d.applicationId] ??= []).push(d);
      return acc;
    }, {} as Record<string, typeof allDocs>);
    const paymentsByApp = allPayments.reduce((acc, p) => {
      (acc[p.applicationId] ??= []).push(p);
      return acc;
    }, {} as Record<string, typeof allPayments>);

    let result = allApps.map((app) => {
      const data = dataByApp[app.id] || [];
      const fields: Record<string, string> = {};
      data.forEach((d) => { fields[d.fieldName] = d.fieldValue; });
      const user = usersById[app.userId];

      return {
        ...app,
        fields,
        documents: (docsByApp[app.id] || []).map((d) => ({
          id: d.id,
          fileName: d.fileName,
          fileUrl: d.fileUrl,
          documentType: d.documentType,
          status: d.status,
          rejectionReason: d.rejectionReason,
          uploadedAt: d.uploadedAt,
        })),
        payments: paymentsByApp[app.id] || [],
        user: user ? { fullName: user.fullName, email: user.email } : null,
      };
    });

    // Apply search filter on user name/email
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((app) =>
        app.user?.fullName.toLowerCase().includes(q) ||
        app.user?.email.toLowerCase().includes(q) ||
        app.id.includes(q)
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/admin/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH: update application status (admin only)
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = adminStatusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { applicationId, status, note } = parsed.data;

    // Get current application
    const [app] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId));

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const oldStatus = app.status;

    // Update status
    await db
      .update(applications)
      .set({ status, updatedAt: new Date() })
      .where(eq(applications.id, applicationId));

    // Record in status history
    await db.insert(statusHistory).values({
      applicationId,
      oldStatus,
      newStatus: status,
      changedBy: session.user.id,
      note: note || null,
    });

    // Get user info for email notification
    const [user] = await db
      .select({ email: users.email, fullName: users.fullName })
      .from(users)
      .where(eq(users.id, app.userId));

    if (user) {
      await sendStatusChangeEmail(
        user.email,
        user.fullName,
        applicationId,
        oldStatus,
        status,
        note
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
