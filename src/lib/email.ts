import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "KORE <noreply@kore.app>";

export async function sendStatusChangeEmail(
  to: string,
  userName: string,
  applicationId: string,
  oldStatus: string,
  newStatus: string,
  note?: string
) {
  const statusLabels: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    under_review: "Under Review",
    additional_info_needed: "Additional Info Needed",
    approved: "Approved",
    rejected: "Rejected",
  };

  const newLabel = statusLabels[newStatus] || newStatus;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Application Update: ${newLabel}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 16px;">Application Status Update</h2>
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6;">
            Hello ${userName},
          </p>
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6;">
            Your visa application <strong>(${applicationId.slice(0, 8)})</strong> status has been updated to:
          </p>
          <div style="background: #f5f3ff; border-left: 4px solid #302a7e; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
            <p style="color: #302a7e; font-size: 18px; font-weight: 600; margin: 0;">${newLabel}</p>
          </div>
          ${note ? `
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.05em;">Note from reviewer</p>
            <p style="color: #1a1a1a; font-size: 14px; margin: 0; line-height: 1.5;">${note}</p>
          </div>
          ` : ""}
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6;">
            Log in to your dashboard to see full details.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">
            KORE Immigration Platform
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send status change email:", error);
  }
}

export async function sendPaymentConfirmationEmail(
  to: string,
  userName: string,
  amount: number,
  visaType: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Payment Confirmation - KORE",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 16px;">Payment Confirmed</h2>
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6;">
            Hello ${userName},
          </p>
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6;">
            Your payment of <strong>&euro;${(amount / 100).toFixed(2)}</strong> for your ${visaType.replace(/_/g, " ")} application has been received.
          </p>
          <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6;">
            Our team will begin reviewing your application shortly.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">
            KORE Immigration Platform
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
  }
}
