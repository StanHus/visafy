import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { payments, applications, users, statusHistory } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendPaymentConfirmationEmail } from "@/lib/email";
import type Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { applicationId, userId, visaType } = session.metadata || {};

      if (applicationId && session.id) {
        // Update payment status
        await db
          .update(payments)
          .set({
            status: "completed",
            stripePaymentId: session.payment_intent as string,
          })
          .where(eq(payments.stripeCheckoutSessionId, session.id));

        // Update application status to under_review
        const [app] = await db
          .select()
          .from(applications)
          .where(eq(applications.id, applicationId));

        if (app) {
          await db
            .update(applications)
            .set({ status: "under_review", updatedAt: new Date() })
            .where(eq(applications.id, applicationId));

          // Record status change
          await db.insert(statusHistory).values({
            applicationId,
            oldStatus: app.status,
            newStatus: "under_review",
            note: "Payment received - application moved to review",
          });
        }

        // Send confirmation email
        if (userId) {
          const [user] = await db
            .select({ email: users.email, fullName: users.fullName })
            .from(users)
            .where(eq(users.id, userId));

          if (user) {
            await sendPaymentConfirmationEmail(
              user.email,
              user.fullName,
              session.amount_total || 49900,
              visaType || "visa"
            );
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
