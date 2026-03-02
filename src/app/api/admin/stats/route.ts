import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, payments, users } from "@/lib/db/schema";
import { eq, sql, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Applications by status
    const byStatus = await db
      .select({
        status: applications.status,
        count: count(),
      })
      .from(applications)
      .groupBy(applications.status);

    // Applications by visa type
    const byVisaType = await db
      .select({
        visaType: applications.visaType,
        count: count(),
      })
      .from(applications)
      .groupBy(applications.visaType);

    // Total revenue
    const [revenue] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
        count: count(),
      })
      .from(payments)
      .where(eq(payments.status, "completed"));

    // Total users
    const [userCount] = await db
      .select({ count: count() })
      .from(users);

    // Total applications
    const [appCount] = await db
      .select({ count: count() })
      .from(applications);

    const statusMap = Object.fromEntries(byStatus.map((s) => [s.status, s.count]));
    const visaTypeMap = Object.fromEntries(byVisaType.map((v) => [v.visaType || "unknown", v.count]));

    return NextResponse.json({
      totalApplications: appCount.count,
      totalUsers: userCount.count,
      totalRevenue: revenue.total,
      totalPayments: revenue.count,
      byStatus: statusMap,
      byVisaType: visaTypeMap,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
