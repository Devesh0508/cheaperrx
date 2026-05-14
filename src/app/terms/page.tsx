import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Terms of Service — CheaperRx" };

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Terms of Service</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: May 13, 2026</p>

          <div className="space-y-8 text-gray-700 text-base leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">1. Acceptance of terms</h2>
              <p>
                By accessing or using CheaperRx (&ldquo;the Service&rdquo;), you agree to be bound by
                these Terms of Service. If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">2. What CheaperRx is</h2>
              <p>
                CheaperRx is a medication price comparison tool. We display prices that have been
                scraped from publicly available sources or submitted by our users. We are
                <strong> not a pharmacy, not a healthcare provider, and not a drug retailer.</strong>
              </p>
              <p className="mt-2">
                Prices shown are for informational purposes only. Actual prices at the pharmacy
                may differ. Always confirm the price with the pharmacy before purchasing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">3. Medical disclaimer</h2>
              <p>
                Nothing on CheaperRx constitutes medical advice. Do not make decisions about
                your medication based solely on our price data. Always consult a licensed
                pharmacist or physician before changing, switching, or stopping any medication.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">4. User accounts</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must be 13 years or older to create an account.</li>
                <li>You are responsible for maintaining the security of your account.</li>
                <li>You may not share your account with others.</li>
                <li>You may not use the Service for any illegal purpose.</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">5. Pro subscription</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>The Pro plan costs $7.99 CAD per month, billed monthly.</li>
                <li>A 7-day free trial is available for new subscribers. No charge during the trial.</li>
                <li>You may cancel at any time. Access continues until the end of the billing period.</li>
                <li>Refunds are not provided for partial months, except where required by law.</li>
                <li>We reserve the right to change pricing with 30 days&apos; notice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">6. Price submissions</h2>
              <p>
                When you submit a price, you confirm it is accurate to the best of your knowledge.
                Submitting false or misleading prices is prohibited. We reserve the right to
                reject, edit, or remove any submission.
              </p>
              <p className="mt-2">
                By submitting a price, you grant CheaperRx a non-exclusive, royalty-free licence
                to display that price on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">7. Accuracy of information</h2>
              <p>
                We make reasonable efforts to keep prices accurate and up to date, but we make
                no guarantees. Price data may be outdated, incomplete, or incorrect. CheaperRx
                is not liable for any losses resulting from reliance on our price data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">8. Intellectual property</h2>
              <p>
                All content, design, and code on CheaperRx is owned by CheaperRx or its
                licensors. You may not copy, reproduce, or distribute any part of the Service
                without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">9. Limitation of liability</h2>
              <p>
                To the maximum extent permitted by applicable law, CheaperRx shall not be liable
                for any indirect, incidental, special, or consequential damages arising from your
                use of the Service. Our total liability shall not exceed the amount you paid us
                in the 3 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">10. Governing law</h2>
              <p>
                These terms are governed by the laws of the Province of Alberta and the federal
                laws of Canada applicable therein. Any disputes shall be resolved in the courts
                of Calgary, Alberta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">11. Contact</h2>
              <p>
                Questions about these terms? Email us at{" "}
                <a href="mailto:help@cheaperrx.ca" className="text-[#0891B2] hover:underline">
                  help@cheaperrx.ca
                </a>
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
