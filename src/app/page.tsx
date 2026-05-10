import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBox } from "@/components/search/SearchBox";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">

        {/* ── HERO ── */}
        <section
          className="relative bg-gradient-to-br from-[#e0f7fa] via-white to-[#e8f5e9] px-4 sm:px-6 pt-16 pb-20 text-center"
          aria-labelledby="hero-heading"
        >
          {/* Decorative blobs — clipped to section only, not the content */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#0891B2] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#16A34A] opacity-5 rounded-full translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="relative max-w-3xl mx-auto space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-[#0891B2] text-[#0891B2] rounded-full px-4 py-2 text-base font-semibold shadow-sm">
              <span aria-hidden="true">🍁</span> Used by Canadians in 50+ cities
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a2e] leading-tight"
            >
              Find the{" "}
              <span className="text-[#0891B2]">cheapest pharmacy</span>
              <br /> for your prescription
            </h1>

            <p className="text-xl sm:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              We compare prices at pharmacies near you — in seconds.
              No account needed to search.
            </p>

            {/* Search box */}
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBox size="hero" />
            </div>

            {/* Reassurance row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-400 text-lg pt-2">
              <span className="flex items-center gap-1"><span aria-hidden="true">🔒</span> No account needed</span>
              <span className="hidden sm:inline text-gray-200">|</span>
              <span className="flex items-center gap-1"><span aria-hidden="true">📍</span> Calgary &amp; more cities</span>
              <span className="hidden sm:inline text-gray-200">|</span>
              <span className="flex items-center gap-1"><span aria-hidden="true">⚡</span> Results in seconds</span>
            </div>
          </div>
        </section>

        {/* ── SAVINGS TEASER ── */}
        <section className="bg-[#16A34A] px-4 sm:px-6 py-5" aria-label="Sample savings">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-center">
            <p className="text-white text-xl font-semibold">
              💊 Metformin 500mg — <span className="line-through text-green-200">$34 at Shoppers</span> → <span className="font-bold text-yellow-200">$12.50 at Costco</span>
            </p>
            <p className="text-green-100 text-lg font-medium">You save $21.50 🎉</p>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          className="bg-gray-50 px-4 sm:px-6 py-20"
          aria-labelledby="how-heading"
        >
          <div className="max-w-4xl mx-auto">
            <h2
              id="how-heading"
              className="text-center text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4"
            >
              How it works
            </h2>
            <p className="text-center text-xl text-gray-500 mb-14">
              Three simple steps. Under 30 seconds.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  icon: "💊",
                  step: "1",
                  title: "Type your medication name",
                  desc: "Just start typing — we'll help you find the right one.",
                  color: "bg-blue-50 border-blue-100",
                  numColor: "bg-[#0891B2]",
                },
                {
                  icon: "📍",
                  step: "2",
                  title: "We find pharmacies near you",
                  desc: "We check prices at every major pharmacy in your city.",
                  color: "bg-green-50 border-green-100",
                  numColor: "bg-[#16A34A]",
                },
                {
                  icon: "💰",
                  step: "3",
                  title: "You see where to pay the least",
                  desc: "The cheapest option is shown first. Simple as that.",
                  color: "bg-amber-50 border-amber-100",
                  numColor: "bg-[#D97706]",
                },
              ].map(({ icon, step, title, desc, color, numColor }) => (
                <div
                  key={step}
                  className={`relative text-center rounded-2xl p-8 border-2 shadow-sm ${color}`}
                >
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 ${numColor} text-white rounded-full flex items-center justify-center font-bold text-base`} aria-hidden="true">
                    {step}
                  </div>
                  <div className="text-5xl mb-4 mt-2" aria-hidden="true">{icon}</div>
                  <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">{title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP ── */}
        <section className="bg-[#1a1a2e] px-4 sm:px-6 py-8" aria-label="Trust indicators">
          <div className="max-w-5xl mx-auto">
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { icon: "🏛️", text: "Data from Government of Canada" },
                { icon: "🔒", text: "Your information is never sold" },
                { icon: "💳", text: "Secured by Stripe" },
                { icon: "❌", text: "Cancel anytime — no questions" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex flex-col items-center gap-2">
                  <span className="text-3xl" aria-hidden="true">{icon}</span>
                  <span className="text-white text-base font-medium leading-snug">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section
          className="bg-white px-4 sm:px-6 py-20"
          aria-labelledby="pricing-heading"
        >
          <div className="max-w-4xl mx-auto">
            <h2
              id="pricing-heading"
              className="text-center text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4"
            >
              Simple, honest pricing
            </h2>
            <p className="text-center text-xl text-gray-500 mb-14">
              Start free. Upgrade when you&apos;re ready.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">

              {/* FREE */}
              <div className="rounded-2xl border-2 border-gray-200 p-8 flex flex-col bg-white">
                <div className="mb-8">
                  <p className="text-base font-semibold text-gray-400 uppercase tracking-wide mb-1">Free forever</p>
                  <p className="text-5xl font-bold text-[#1a1a2e]">$0</p>
                  <p className="text-gray-400 text-lg mt-1">No credit card needed</p>
                </div>
                <ul className="space-y-4 flex-1 mb-8" role="list">
                  {[
                    "Search any medication",
                    "See the 3 cheapest pharmacies",
                    "See how much you save",
                    "Generic drug suggestions",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-lg text-[#1a1a2e]">
                      <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-sm font-bold flex-shrink-0" aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                  {[
                    "Save your medication list",
                    "Price drop email alerts",
                    "See all pharmacies",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-lg text-gray-300">
                      <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center text-sm font-bold flex-shrink-0" aria-hidden="true">✗</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/search"
                  className="btn-outline text-center"
                  aria-label="Start searching for free — no account needed"
                >
                  Start Searching — It&apos;s Free
                </Link>
              </div>

              {/* PRO */}
              <div className="rounded-2xl border-2 border-[#0891B2] p-8 flex flex-col bg-white relative shadow-lg shadow-[#0891B2]/10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0891B2] text-white text-sm font-bold px-5 py-1.5 rounded-full whitespace-nowrap">
                  ⭐ Most Popular
                </div>
                <div className="mb-8 mt-2">
                  <p className="text-base font-semibold text-[#0891B2] uppercase tracking-wide mb-1">Pro plan</p>
                  <p className="text-5xl font-bold text-[#1a1a2e]">$7.99
                    <span className="text-xl font-normal text-gray-400">/month</span>
                  </p>
                  <p className="text-gray-500 text-lg mt-1">That&apos;s 26 cents a day</p>
                </div>
                <ul className="space-y-4 flex-1 mb-8" role="list">
                  {[
                    "Everything in Free",
                    "See ALL pharmacies and prices",
                    "Save your medication list",
                    "Email alerts when prices drop",
                    "Check if insurance covers you",
                    "Manage medications for your family",
                    "Monthly refill reminders",
                    "Price history charts",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-lg text-[#1a1a2e]">
                      <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-sm font-bold flex-shrink-0" aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/upgrade"
                  className="btn-green text-center"
                  aria-label="Try Pro free for 7 days"
                >
                  Try Pro Free for 7 Days
                </Link>
                <p className="text-center text-gray-400 text-base mt-3">
                  Cancel anytime — no questions asked
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL STRIP ── */}
        <section className="bg-gray-50 px-4 sm:px-6 py-16" aria-label="Customer quotes">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                quote: "I saved $34 a month on my blood pressure medication. I had no idea Costco was so much cheaper!",
                name: "Margaret T., Calgary",
              },
              {
                quote: "My husband and I use it for all five of our prescriptions. We save over $80 a month now.",
                name: "Linda K., Edmonton",
              },
              {
                quote: "So simple even I can use it. Type the name, see the price. That's it.",
                name: "Robert M., Red Deer",
              },
            ].map(({ quote, name }) => (
              <figure key={name} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <blockquote className="text-gray-600 text-lg leading-relaxed mb-4">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <figcaption className="font-semibold text-[#1a1a2e] text-base">— {name}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="bg-[#0891B2] px-4 sm:px-6 py-20 text-center" aria-label="Search call to action">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to start saving?
            </h2>
            <p className="text-xl text-blue-100">
              Search your medication right now — no account needed.
            </p>
            <div className="bg-white rounded-2xl p-2 shadow-xl">
              <SearchBox size="hero" placeholder="Search a medication to get started..." />
            </div>
            <p className="text-blue-200 text-lg">
              🍁 Serving Canadians since 2026 · help@cheaperrx.ca
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
