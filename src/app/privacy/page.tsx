"use client";

import Navbar from "@/components/Navbar";
import FadeIn from "@/components/animations/FadeIn";
import { useLanguage } from "@/lib/i18n-context";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-28 pb-20 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <FadeIn duration={500} direction="up">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              {t.privacy.title}
            </h1>
            <p className="text-sm text-gray-400 mb-10">
              {t.privacy.lastUpdated}: March 1, 2026
            </p>
          </FadeIn>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Data Controller</h2>
              <p>
                Expanova S.L. (&quot;KORE&quot;, &quot;we&quot;, &quot;us&quot;) is the data controller responsible for your personal data. We are committed to protecting your privacy in accordance with the General Data Protection Regulation (GDPR) — Regulation (EU) 2016/679 — and Spanish data protection law (LOPDGDD).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Data We Collect</h2>
              <p>We collect the following categories of personal data:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Identity data:</strong> Full name, date of birth, nationality, passport number, passport expiry date</li>
                <li><strong>Contact data:</strong> Email address, phone number, current address</li>
                <li><strong>Immigration data:</strong> Visa type, employment details, financial information, sponsor information, education details</li>
                <li><strong>Documents:</strong> Passport copies, photos, proof of income, bank statements, health insurance, criminal record checks, accommodation proof, employment contracts</li>
                <li><strong>Payment data:</strong> Payment method details (processed by Stripe; we do not store card numbers)</li>
                <li><strong>Usage data:</strong> Login activity, pages visited, booking history, inquiry messages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Legal Basis for Processing</h2>
              <p>We process your data based on the following legal grounds under GDPR Article 6:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Contract performance (Art. 6(1)(b)):</strong> Processing necessary to provide our visa application, Captain booking, and housing services</li>
                <li><strong>Legal obligation (Art. 6(1)(c)):</strong> Compliance with Spanish immigration and financial regulations</li>
                <li><strong>Legitimate interest (Art. 6(1)(f)):</strong> Platform security, fraud prevention, service improvement</li>
                <li><strong>Consent (Art. 6(1)(a)):</strong> Marketing communications (you may withdraw consent at any time)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Purpose of Data Processing</h2>
              <p>Your personal data is processed for:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Processing and managing your visa application(s)</li>
                <li>Storing and organizing immigration documents securely</li>
                <li>Facilitating Captain consultation bookings</li>
                <li>Enabling housing inquiries and landlord communication</li>
                <li>Processing payments through Stripe</li>
                <li>Sending application status updates and notifications</li>
                <li>Providing customer support</li>
                <li>Improving our platform and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Document Storage</h2>
              <p>
                Documents uploaded to KORE for visa applications are stored securely using encrypted storage. Documents are retained for the active duration of your application and for up to 5 years after application completion, in compliance with Spanish regulatory requirements. You may request early deletion of documents after your application is finalized (see Section 8).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Data Sharing</h2>
              <p>We share your personal data only with:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Stripe:</strong> Payment processing (PCI-DSS compliant)</li>
                <li><strong>Resend:</strong> Transactional email delivery</li>
                <li><strong>Captains:</strong> Relevant booking information for your scheduled sessions</li>
                <li><strong>Landlords:</strong> Contact details shared only when you initiate a housing inquiry</li>
                <li><strong>Spanish authorities:</strong> Only when required by law or upon your explicit request for visa processing</li>
              </ul>
              <p className="mt-2">
                We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. International Data Transfers</h2>
              <p>
                Your data is primarily stored within the EU. Where data is transferred outside the EEA (e.g., to service providers), we ensure adequate safeguards through Standard Contractual Clauses (SCCs) or adequacy decisions as required by GDPR Chapter V.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Your Rights (GDPR Articles 15–22)</h2>
              <p>Under GDPR, you have the following rights:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Right of access (Art. 15):</strong> Request a copy of your personal data</li>
                <li><strong>Right to rectification (Art. 16):</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to erasure (Art. 17):</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
                <li><strong>Right to restriction (Art. 18):</strong> Restrict processing in certain circumstances</li>
                <li><strong>Right to data portability (Art. 20):</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Right to object (Art. 21):</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to withdraw consent (Art. 7(3)):</strong> Withdraw consent at any time without affecting prior processing</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:privacy@expanova.io" className="text-brand-600 hover:text-brand-700 underline">
                  privacy@expanova.io
                </a>. We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Data Retention</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Account data: retained while your account is active, and for 2 years after deletion</li>
                <li>Application documents: 5 years after application completion</li>
                <li>Payment records: 7 years (Spanish tax requirements)</li>
                <li>Booking and review data: 3 years after creation</li>
                <li>Usage logs: 12 months</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data, including encryption at rest and in transit, access controls, regular security assessments, and secure payment processing through Stripe.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Cookies</h2>
              <p>
                KORE uses essential cookies for authentication and language preferences. We do not use tracking or advertising cookies. Your language preference is stored in localStorage under the key &quot;kore-language&quot;.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Supervisory Authority</h2>
              <p>
                You have the right to lodge a complaint with the Spanish Data Protection Agency (Agencia Española de Protección de Datos — AEPD) at{" "}
                <a href="https://www.aepd.es" className="text-brand-600 hover:text-brand-700 underline" target="_blank" rel="noopener noreferrer">
                  www.aepd.es
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">13. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the platform. The date at the top of this page indicates when this policy was last revised.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">14. Contact</h2>
              <p>
                For questions about this Privacy Policy or your personal data, contact our Data Protection Officer at{" "}
                <a href="mailto:privacy@expanova.io" className="text-brand-600 hover:text-brand-700 underline">
                  privacy@expanova.io
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
