import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const VISA_PRICES: Record<string, { amount: number; label: string }> = {
  work_visa: { amount: 49900, label: "Work Visa Application" },
  golden_visa: { amount: 49900, label: "Golden Visa Application" },
  student_visa: { amount: 49900, label: "Student Visa Application" },
  family_reunification: { amount: 49900, label: "Family Reunification Application" },
  digital_nomad: { amount: 49900, label: "Digital Nomad Visa Application" },
  non_lucrative: { amount: 49900, label: "Non-Lucrative Visa Application" },
};
