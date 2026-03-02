import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { inquiries, inquiryMessages, users } from "@/lib/db/schema";
import { eq, and, or, sql } from "drizzle-orm";
import { inquiryMessageSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET: list messages in inquiry
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: inquiryId } = await params;

    // Verify access
    const [inquiry] = await db
      .select()
      .from(inquiries)
      .where(
        and(
          eq(inquiries.id, inquiryId),
          or(
            eq(inquiries.tenantId, session.user.id),
            eq(inquiries.landlordId, session.user.id)
          )
        )
      );

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const messages = await db
      .select({
        id: inquiryMessages.id,
        message: inquiryMessages.message,
        createdAt: inquiryMessages.createdAt,
        senderId: inquiryMessages.senderId,
        senderName: users.fullName,
      })
      .from(inquiryMessages)
      .innerJoin(users, eq(inquiryMessages.senderId, users.id))
      .where(eq(inquiryMessages.inquiryId, inquiryId))
      .orderBy(sql`${inquiryMessages.createdAt} ASC`);

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET /api/inquiries/[id]/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: send message in inquiry
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: inquiryId } = await params;

    // Verify access
    const [inquiry] = await db
      .select()
      .from(inquiries)
      .where(
        and(
          eq(inquiries.id, inquiryId),
          or(
            eq(inquiries.tenantId, session.user.id),
            eq(inquiries.landlordId, session.user.id)
          )
        )
      );

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = inquiryMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const [msg] = await db
      .insert(inquiryMessages)
      .values({
        inquiryId,
        senderId: session.user.id,
        message: parsed.data.message,
      })
      .returning();

    // Update inquiry status if landlord is replying
    if (session.user.id === inquiry.landlordId && inquiry.status === "new") {
      await db
        .update(inquiries)
        .set({ status: "replied" })
        .where(eq(inquiries.id, inquiryId));
    }

    return NextResponse.json({ success: true, message: msg });
  } catch (error) {
    console.error("POST /api/inquiries/[id]/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
