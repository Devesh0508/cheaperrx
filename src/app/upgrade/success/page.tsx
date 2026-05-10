import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Welcome to Pro — CheaperRx" };

export default function UpgradeSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-20">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-7xl mb-6" aria-hidden="true">🎉</p>
          <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4">
            You&apos;re now a Pro member!
          </h1>
          <p className="text-xl text-gray-500 mb-8">
            Your 7-day free trial has started. You now have access to all pharmacies,
            the Insurance Checker, price alerts, and family tracking.
          </p>
          <div className="space-y-3">
            <Link href="/dashboard" className="btn-primary w-full inline-block text-center">
              Go to my dashboard →
            </Link>
            <Link
              href="/search"
              className="block text-[#0891B2] font-semibold text-lg hover:underline"
            >
              Search for a medication now
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
