import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { messages, applications, users, notifications } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { messageSchema } from "@/lib/validations";

// GET: get messages for an application
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

    // Verify access: must be owner or admin
    if (session.user.role !== "admin") {
      const [app] = await db
        .select({ id: applications.id })
        .from(applications)
        .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));

      if (!app) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }

    const appMessages = await db
      .select({
        id: messages.id,
        content: messages.content,
        createdAt: messages.createdAt,
        senderId: messages.senderId,
        senderName: users.fullName,
        senderRole: users.role,
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.applicationId, applicationId))
      .orderBy(desc(messages.createdAt));

    return NextResponse.json(appMessages);
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: send a message
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { applicationId, content } = parsed.data;

    // Verify access
    const [app] = await db
      .select({ id: applications.id, userId: applications.userId })
      .from(applications)
      .where(eq(applications.id, applicationId));

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Must be the owner or an admin
    if (session.user.role !== "admin" && app.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [msg] = await db.insert(messages).values({
      applicationId,
      senderId: session.user.id,
      content,
    }).returning();

    // Create notification for the other party
    const notifyUserId = session.user.role === "admin" ? app.userId : null;
    if (notifyUserId) {
      await db.insert(notifications).values({
        userId: notifyUserId,
        applicationId,
        type: "message",
        title: "New Message",
        message: content.slice(0, 200),
      });
    }

    return NextResponse.json({ success: true, message: msg });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
