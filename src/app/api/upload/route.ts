import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
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

    // Fix C3: verify application ownership
    const [app] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Fix C6: file size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 413 }
      );
    }

    // Fix C7: file type validation
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

    // Fix C4/C5: use Vercel Blob storage instead of local filesystem
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
