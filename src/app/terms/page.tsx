import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service — CheaperRx",
  description: "CheaperRx Terms of Service — the rules and conditions for using our medication price comparison platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Terms of Service</h1>
          <p className="text-gray-400 text-sm mb-2">Last updated: May 15, 2026</p>
          <p className="text-gray-500 text-sm mb-8">
            Questions? <Link href="/contact" className="text-[#0891B2] hover:underline">Contact us</Link> or email{" "}
            <a href="mailto:help@cheaperx.ca" className="text-[#0891B2] hover:underline">help@cheaperx.ca</a>
          </p>

          <div className="space-y-8 text-gray-700 text-base leading-relaxed">

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-amber-800 font-semibold mb-1">⚕️ Important medical disclaimer</p>
              <p className="text-amber-700 text-sm">
                CheaperRx is a price comparison tool only. We are <strong>not a pharmacy, doctor, or healthcare provider</strong>.
                Nothing on this site constitutes medical advice. Always consult a licensed pharmacist or
                physician before making any medication decisions.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">1. Acceptance of terms</h2>
              <p>
                By accessing or using CheaperRx (&ldquo;the Service&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;),
                you agree to be bound by these Terms of Service and our{" "}
                <Link href="/privacy" className="text-[#0891B2] hover:underline">Privacy Policy</Link>.
                If you do not agree with any part of these terms, please do not use the Service.
              </p>
              <p className="mt-2">
                We may update these terms at any time. Continued use of the Service after changes
                are posted means you accept the updated terms. We will notify registered users
                by email for material changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">2. What CheaperRx is</h2>
              <p>
                CheaperRx is a Canadian medication price comparison platform. We display drug prices
                sourced from publicly available information and community submissions. We are{" "}
                <strong>not a pharmacy, not a licensed drug retailer, and not a healthcare provider.</strong>
              </p>
              <p className="mt-2">
                Prices shown are for <strong>informational purposes only</strong>. Actual prices at the
                pharmacy may differ due to insurance, dispensing fees, generic substitutions, or
                recent price changes. Always confirm the current price directly with the pharmacy
                before purchasing.
              </p>
              <p className="mt-2">
                CheaperRx currently serves the Calgary, Alberta area and is expanding to more
                Canadian cities over time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">3. Eligibility</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must be at least 13 years of age to use this Service.</li>
                <li>You must be a resident of Canada or accessing the Service from Canada.</li>
                <li>You must have the legal capacity to enter into a binding agreement.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">4. User accounts</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You are responsible for keeping your account credentials secure.</li>
                <li>You may not share, sell, or transfer your account to another person.</li>
                <li>You must provide accurate information when creating your account.</li>
                <li>You are responsible for all activity that occurs under your account.</li>
                <li>
                  We reserve the right to suspend or permanently terminate accounts that violate
                  these terms, engage in fraud, or misuse the Service.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">5. Pro subscription</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>The Pro plan is billed at <strong>$7.99 CAD per month</strong>, charged to your credit card.</li>
                <li>
                  New subscribers receive a <strong>7-day free trial</strong>. Your card will not be charged
                  until the trial period ends. You can cancel before the trial ends at no cost.
                </li>
                <li>
                  Subscriptions automatically renew monthly. You can cancel at any time from your
                  account settings. Cancellation takes effect at the end of the current billing period —
                  you retain Pro access until then.
                </li>
                <li>
                  We do not provide refunds for partial months, except where required by applicable
                  Canadian consumer protection law.
                </li>
                <li>
                  We reserve the right to change subscription pricing with at least 30 days&apos; notice
                  to existing subscribers.
                </li>
                <li>Payments are processed securely by Stripe. We do not store your card details.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">6. Community price submissions</h2>
              <p>
                Registered users may submit medication prices they have personally paid at a pharmacy.
                By submitting a price, you:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Confirm the price is accurate to the best of your knowledge.</li>
                <li>
                  Grant CheaperRx a non-exclusive, royalty-free, perpetual licence to display,
                  modify, and use that submission on our platform.
                </li>
                <li>Agree not to submit false, misleading, or fraudulent prices.</li>
              </ul>
              <p className="mt-2">
                We reserve the right to reject, edit, verify, or remove any submission at our
                sole discretion. Repeated submission of inaccurate prices may result in account suspension.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">7. Accuracy and liability</h2>
              <p>
                While we make reasonable efforts to keep price data accurate and up to date,
                CheaperRx makes <strong>no warranties</strong> — express or implied — regarding the
                accuracy, completeness, or timeliness of any price information displayed.
              </p>
              <p className="mt-2">
                CheaperRx shall not be liable for any loss, damage, or harm resulting from:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Reliance on inaccurate or outdated price information</li>
                <li>Medication decisions made based on information from our platform</li>
                <li>Service interruptions or technical errors</li>
                <li>Unauthorized access to your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">8. Prohibited conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Scrape, copy, or systematically download our price data without written permission</li>
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Submit spam, malware, or harmful content</li>
                <li>Impersonate another person or entity</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Use automated bots to interact with the Service without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">9. Intellectual property</h2>
              <p>
                All content, design, code, trademarks, and data on CheaperRx are owned by or
                licensed to CheaperRx. You may not copy, reproduce, distribute, or create
                derivative works without our express written permission.
              </p>
              <p className="mt-2">
                User-submitted prices remain the property of the submitter but are licensed
                to us as described in Section 6.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">10. Limitation of liability</h2>
              <p>
                To the maximum extent permitted by applicable Canadian law, CheaperRx&apos;s total
                liability to you for any claim arising from use of the Service shall not exceed
                the greater of (a) the amount you paid us in the 3 months preceding the claim,
                or (b) $10 CAD.
              </p>
              <p className="mt-2">
                We are not liable for any indirect, incidental, special, punitive, or
                consequential damages, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">11. Governing law & disputes</h2>
              <p>
                These terms are governed by the laws of the Province of Alberta and the federal
                laws of Canada applicable therein, without regard to conflict of law principles.
              </p>
              <p className="mt-2">
                Any dispute arising from these terms or your use of the Service shall first be
                attempted to be resolved informally by contacting us at{" "}
                <a href="mailto:help@cheaperx.ca" className="text-[#0891B2] hover:underline">
                  help@cheaperx.ca
                </a>. If unresolved after 30 days, disputes shall be submitted to the courts
                of Calgary, Alberta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">12. Contact</h2>
              <p>
                For questions about these terms, please{" "}
                <Link href="/contact" className="text-[#0891B2] hover:underline">
                  contact us
                </Link>{" "}
                or email{" "}
                <a href="mailto:help@cheaperx.ca" className="text-[#0891B2] hover:underline">
                  help@cheaperx.ca
                </a>.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
