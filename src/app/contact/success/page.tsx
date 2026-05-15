import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Message Sent — CheaperRx" };

export default function ContactSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-5" aria-hidden="true">✅</p>
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3">Message sent!</h1>
          <p className="text-xl text-gray-500 mb-8">
            Thanks for reaching out. We&apos;ll get back to you at your email within 24 hours on business days.
          </p>
          <div className="space-y-3">
            <Link
              href="/search"
              className="block bg-[#0891B2] hover:bg-[#0e7490] text-white font-bold rounded-xl px-6 py-3.5 text-lg transition-colors"
            >
              Search medication prices →
            </Link>
            <Link href="/" className="block text-[#0891B2] font-semibold hover:underline text-lg">
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
