import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, payments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { stripe, VISA_PRICES } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { applicationId, visaType } = parsed.data;

    // Verify ownership
    const [app] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, applicationId), eq(applications.userId, session.user.id)));

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (app.status !== "submitted") {
      return NextResponse.json({ error: "Application must be submitted before payment" }, { status: 400 });
    }

    const priceInfo = VISA_PRICES[visaType] || VISA_PRICES.work_visa;

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: priceInfo.label,
              description: "KORE Immigration Services - Application Processing Fee",
            },
            unit_amount: priceInfo.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=cancelled`,
      metadata: {
        applicationId,
        userId: session.user.id,
        visaType,
      },
    });

    // Create payment record
    await db.insert(payments).values({
      applicationId,
      userId: session.user.id,
      stripeCheckoutSessionId: checkoutSession.id,
      amount: priceInfo.amount,
      currency: "eur",
      status: "pending",
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("POST /api/payments/checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
