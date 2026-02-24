import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, documents } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { ALLOWED_UPLOAD_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const applicationId = formData.get("applicationId") as string;
    const documentType = formData.get("documentType") as string;

    if (!file || !applicationId || !documentType) {
      return NextResponse.json(
        { error: "File, application ID, and document type are required" },
        { status: 400 }
      );
    }

    // Verify application ownership
    const [app] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 413 }
      );
    }

    // File type validation
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_UPLOAD_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: "File type not allowed. Only PDF, JPG, and PNG files are accepted." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Only PDF, JPG, and PNG files are accepted." },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob storage
    const blob = await put(`documents/${applicationId}/${crypto.randomUUID()}${ext}`, file, {
      access: "public",
    });

    // Save to database
    const [doc] = await db.insert(documents).values({
      applicationId,
      documentType: documentType as typeof documents.$inferInsert.documentType,
      fileUrl: blob.url,
      fileName: file.name,
      fileSize: file.size,
      status: "pending",
    }).returning({ id: documents.id });

    return NextResponse.json({
      success: true,
      document: {
        id: doc.id,
        fileName: file.name,
        fileUrl: blob.url,
        documentType,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { documentId, applicationId } = await request.json();

    if (!documentId || !applicationId) {
      return NextResponse.json(
        { error: "Document ID and application ID are required" },
        { status: 400 }
      );
    }

    // Verify application ownership
    const [app] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Fetch the document to get the blob URL
    const [doc] = await db
      .select({ id: documents.id, fileUrl: documents.fileUrl })
      .from(documents)
      .where(and(eq(documents.id, documentId), eq(documents.applicationId, applicationId)));

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Delete from Vercel Blob
    try {
      await del(doc.fileUrl);
    } catch {
      // If blob deletion fails, still remove from DB
      console.error("Failed to delete blob, continuing with DB cleanup");
    }

    // Delete from database
    await db.delete(documents).where(eq(documents.id, documentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
