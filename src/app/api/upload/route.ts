import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = path.extname(file.name);
    const uniqueName = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    // Write file
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Save to database
    const docId = uuidv4();
    const now = new Date().toISOString();

    await db.insert(documents).values({
      id: docId,
      applicationId,
      documentType: documentType as typeof documents.$inferInsert.documentType,
      fileUrl: `/uploads/${uniqueName}`,
      fileName: file.name,
      fileSize: file.size,
      status: "pending",
      uploadedAt: now,
    });

    return NextResponse.json({
      success: true,
      document: {
        id: docId,
        fileName: file.name,
        fileUrl: `/uploads/${uniqueName}`,
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
