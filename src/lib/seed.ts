import { db } from "./db";
import { users, applications, applicationData, documents } from "./db/schema";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  console.log("Seeding database...");

  const now = new Date().toISOString();

  // Create demo user
  const userId = uuidv4();
  const passwordHash = await hash("password123", 12);

  await db.insert(users).values({
    id: userId,
    email: "demo@visafy.com",
    passwordHash,
    fullName: "Maria Garcia",
    phone: "+34 612 345 678",
    role: "client",
    createdAt: now,
    updatedAt: now,
  });

  console.log("Created demo user: demo@visafy.com / password123");

  // Create a submitted application
  const appId = uuidv4();
  await db.insert(applications).values({
    id: appId,
    userId,
    visaType: "digital_nomad",
    status: "under_review",
    currentStep: 6,
    createdAt: now,
    updatedAt: now,
  });

  // Add application data
  const fields = [
    { step: 1, name: "visaType", value: "digital_nomad" },
    { step: 2, name: "fullName", value: "Maria Garcia" },
    { step: 2, name: "dateOfBirth", value: "1992-03-15" },
    { step: 2, name: "nationality", value: "United States" },
    { step: 2, name: "passportNumber", value: "AB1234567" },
    { step: 2, name: "passportExpiry", value: "2030-03-15" },
    { step: 2, name: "phone", value: "+34 612 345 678" },
    { step: 2, name: "email", value: "demo@visafy.com" },
    { step: 2, name: "country", value: "United States" },
    { step: 2, name: "city", value: "New York" },
    { step: 3, name: "workType", value: "Employee" },
    { step: 3, name: "companyName", value: "TechCorp Inc." },
    { step: 3, name: "companyCountry", value: "United States" },
    { step: 3, name: "monthlyIncome", value: "5500" },
    { step: 3, name: "remoteWorkDescription", value: "Senior Software Engineer" },
    { step: 4, name: "annualIncome", value: "66000" },
    { step: 4, name: "monthlyIncome", value: "5500" },
    { step: 4, name: "bankName", value: "Chase Bank" },
    { step: 4, name: "bankAccountCountry", value: "United States" },
    { step: 4, name: "sourceOfFunds", value: "employment" },
  ];

  for (const field of fields) {
    await db.insert(applicationData).values({
      id: uuidv4(),
      applicationId: appId,
      stepNumber: field.step,
      fieldName: field.name,
      fieldValue: field.value,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Add sample documents
  const docs = [
    { type: "passport" as const, name: "passport_scan.pdf", size: 245000 },
    { type: "photo" as const, name: "passport_photo.jpg", size: 150000 },
    { type: "proof_of_income" as const, name: "income_proof.pdf", size: 320000 },
    { type: "employment_contract" as const, name: "contract.pdf", size: 410000 },
    { type: "health_insurance" as const, name: "insurance_cert.pdf", size: 280000 },
  ];

  for (const doc of docs) {
    await db.insert(documents).values({
      id: uuidv4(),
      applicationId: appId,
      documentType: doc.type,
      fileUrl: `/uploads/${doc.name}`,
      fileName: doc.name,
      fileSize: doc.size,
      status: "pending",
      uploadedAt: now,
    });
  }

  // Create admin user
  const adminId = uuidv4();
  const adminHash = await hash("admin123", 12);

  await db.insert(users).values({
    id: adminId,
    email: "admin@visafy.com",
    passwordHash: adminHash,
    fullName: "Admin User",
    phone: "+34 600 000 000",
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });

  console.log("Created admin user: admin@visafy.com / admin123");
  console.log("Created sample application (Digital Nomad - Under Review)");
  console.log("Seeding complete!");
}

seed().catch(console.error);
