import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { isPro } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Upgrade to Pro — CheaperRx",
  description:
    "Unlock all 20+ pharmacies, save medications, set price drop alerts, and track your family — for just $7.99/month. 7-day free trial, cancel anytime.",
  alternates: { canonical: "/upgrade" },
};

const FREE_FEATURES = [
  "Search any medication",
  "See cheapest pharmacy (1 of 8)",
  "Call pharmacies to confirm",
];

const PRO_FEATURES = [
  "See ALL pharmacies & prices",
  "Save medications & get refill reminders",
  "Family medication manager",
  "Price drop alerts via email",
  "Insurance filter (Blue Cross, ODB)",
  "Price history charts",
  "Priority support",
];

export default async function UpgradePage() {
  const pro = await isPro();
  if (pro) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4">
              See every pharmacy price in seconds
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Free users see 1 pharmacy. Pro users see all 8 — including Costco, which is often
              50% cheaper than Shoppers Drug Mart.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">

            {/* Free card */}
            <div className="card border-gray-200">
              <p className="text-lg font-semibold text-gray-400 mb-1">Free</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold text-[#1a1a2e]">$0</span>
                <span className="text-gray-400 text-lg">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-gray-600 text-lg">
                    <span className="text-gray-400 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
                <li className="flex items-start gap-2 text-gray-400 text-lg line-through">
                  <span className="mt-0.5">✗</span>
                  See all pharmacies
                </li>
                <li className="flex items-start gap-2 text-gray-400 text-lg line-through">
                  <span className="mt-0.5">✗</span>
                  Save medications
                </li>
              </ul>
              <div className="btn-outline text-center block cursor-default opacity-60">
                Current plan
              </div>
            </div>

            {/* Pro card */}
            <div className="relative card border-[#0891B2] shadow-lg shadow-blue-50">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0891B2] text-white text-sm font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                ⭐ Most Popular
              </div>
              <p className="text-lg font-semibold text-[#0891B2] mb-1 mt-2">Pro</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold text-[#1a1a2e]">$7.99</span>
                <span className="text-gray-400 text-lg">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[#1a1a2e] text-lg">
                    <span className="text-[#16A34A] mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {/* Stripe checkout will be wired here in Step 15 */}
              <Link
                href="/upgrade/checkout"
                className="btn-primary w-full text-center block"
                aria-label="Start 7-day free trial of Pro"
              >
                Start free 7-day trial →
              </Link>
              <p className="text-gray-400 text-sm text-center mt-3">
                ✓ No credit card needed · ✓ Cancel anytime
              </p>
            </div>

          </div>

          {/* Savings example */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <p className="text-4xl mb-3" aria-hidden="true">💰</p>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">
              The math is simple
            </h2>
            <p className="text-gray-600 text-lg">
              Lipitor 40mg costs <strong>$40.95</strong> at Costco vs <strong>$83.85</strong> at Shoppers.
              <br />
              That&apos;s a <strong className="text-[#16A34A]">$42.90 saving per month</strong> —
              more than 5× the cost of Pro.
            </p>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-[#1a1a2e] text-center">Common questions</h2>
            {[
              {
                q: "Do I need a credit card for the trial?",
                a: "No. The 7-day trial is completely free. You only provide payment details when the trial ends.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel with one click from your account settings. No questions asked.",
              },
              {
                q: "How many family members can I add?",
                a: "Unlimited. Add medications for everyone in your household.",
              },
              {
                q: "How does the price alert work?",
                a: "Set a target price for any drug. We email you the moment a pharmacy in your city drops below it.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="card">
                <p className="font-semibold text-[#1a1a2e] text-lg mb-1">{q}</p>
                <p className="text-gray-500 text-lg">{a}</p>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
