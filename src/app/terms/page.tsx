"use client";

import Navbar from "@/components/Navbar";
import FadeIn from "@/components/animations/FadeIn";
import { useLanguage } from "@/lib/i18n-context";

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-28 pb-20 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <FadeIn duration={500} direction="up">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              {t.terms.title}
            </h1>
            <p className="text-sm text-gray-400 mb-10">
              {t.terms.lastUpdated}: March 1, 2026
            </p>
          </FadeIn>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the KORE platform (&quot;Service&quot;), operated by Expanova S.L. (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p>
                KORE provides an online platform that assists users with Spain immigration processes, including but not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Visa application guidance and document management</li>
                <li>Connection with local immigration guides (&quot;Captains&quot;)</li>
                <li>Access to visa-friendly housing listings</li>
              </ul>
              <p className="mt-2">
                KORE is not a law firm and does not provide legal advice. Our Captains are independent contractors who share their personal experience with immigration processes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. User Accounts</h2>
              <p>
                To use certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate, current, and complete information during registration and keep your account information updated.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Visa Application Services</h2>
              <p>
                Our platform assists you in organizing and submitting visa applications for Spain. We do not guarantee the approval of any visa application. Outcomes are determined solely by Spanish immigration authorities. We are not responsible for decisions made by government entities.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Captains Network</h2>
              <p>
                Captains are verified independent guides who offer consultation services through our platform. KORE facilitates the connection but is not liable for advice given by Captains. Session fees are processed through our platform, with Captains receiving 85% and KORE retaining a 15% platform fee.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Housing Marketplace</h2>
              <p>
                Property listings are provided by third-party landlords. KORE verifies listings where possible but does not guarantee the accuracy of all listing information. Rental agreements are made directly between tenants and landlords. KORE is not a party to any rental contract.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Payments and Refunds</h2>
              <p>
                All payments are processed securely through Stripe. Prices are displayed in EUR. Refund eligibility depends on the specific service purchased and the stage of processing. Application fees are non-refundable once processing has begun.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Document Storage</h2>
              <p>
                Documents uploaded to KORE are stored securely and used solely for the purpose of processing your immigration application. We retain documents for the duration of your application and for a period of 5 years after completion, in compliance with Spanish regulatory requirements.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Intellectual Property</h2>
              <p>
                All content, design, and functionality of the KORE platform are the property of Expanova S.L. and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, KORE shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to visa denials, housing disputes, or advice received from Captains.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Governing Law</h2>
              <p>
                These Terms are governed by the laws of Spain. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Madrid, Spain.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the platform. Continued use of the Service after modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">13. Contact</h2>
              <p>
                For questions about these Terms, please contact us at{" "}
                <a href="mailto:legal@expanova.io" className="text-brand-600 hover:text-brand-700 underline">
                  legal@expanova.io
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
