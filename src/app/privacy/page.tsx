import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Privacy Policy — CheaperRx" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto prose prose-gray">

          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: May 13, 2026</p>

          <div className="space-y-8 text-gray-700 text-base leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">1. Who we are</h2>
              <p>
                CheaperRx (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a Canadian medication price comparison service
                operated in Calgary, Alberta. We help Canadians find the lowest prescription
                and over-the-counter drug prices at pharmacies near them.
              </p>
              <p className="mt-2">
                Questions? Email us at{" "}
                <a href="mailto:help@cheaperrx.ca" className="text-[#0891B2] hover:underline">
                  help@cheaperrx.ca
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">2. Information we collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Account information:</strong> Your email address and name when you create an account.
                </li>
                <li>
                  <strong>Usage data:</strong> Medications you search for, pharmacies you view, and features you use.
                </li>
                <li>
                  <strong>Saved medications:</strong> Drug names and family member labels you choose to save (Pro feature).
                </li>
                <li>
                  <strong>Price submissions:</strong> Prices you voluntarily submit for medications at pharmacies.
                </li>
                <li>
                  <strong>Payment information:</strong> Processed securely by Stripe. We never store your card number.
                </li>
                <li>
                  <strong>Technical data:</strong> IP address, browser type, and device information collected automatically.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">3. How we use your information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To provide and improve the CheaperRx service</li>
                <li>To manage your account and Pro subscription</li>
                <li>To send price alerts you have requested</li>
                <li>To process payments through Stripe</li>
                <li>To respond to your support requests</li>
                <li>To detect and prevent fraud or abuse</li>
              </ul>
              <p className="mt-3">
                We do <strong>not</strong> sell your personal information to third parties.
                We do <strong>not</strong> use your medication data for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">4. Data sharing</h2>
              <p>We share your data only with:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Supabase</strong> — our database and authentication provider (servers in Canada/US)
                </li>
                <li>
                  <strong>Stripe</strong> — payment processing (PCI-DSS compliant)
                </li>
                <li>
                  <strong>Vercel</strong> — hosting provider
                </li>
                <li>
                  <strong>Law enforcement</strong> — only when legally required
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">5. Your rights (PIPEDA)</h2>
              <p>
                Under Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA),
                you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate information</li>
                <li>Withdraw consent and request deletion of your account and data</li>
                <li>File a complaint with the Office of the Privacy Commissioner of Canada</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email{" "}
                <a href="mailto:help@cheaperrx.ca" className="text-[#0891B2] hover:underline">
                  help@cheaperrx.ca
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">6. Data retention</h2>
              <p>
                We retain your account data for as long as your account is active. If you delete
                your account, we remove your personal data within 30 days, except where we are
                legally required to retain it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">7. Cookies</h2>
              <p>
                We use essential cookies only — to keep you logged in and maintain your session.
                We do not use advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">8. Security</h2>
              <p>
                All data is transmitted over HTTPS. Passwords are hashed and never stored in
                plain text. Payment data is handled entirely by Stripe and never touches our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">9. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. We will notify you by email or
                by posting a notice on the site. Continued use after changes means you accept
                the updated policy.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
