import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Browse Calgary Pharmacies — CheaperRx",
  description:
    "See all 36 pharmacies in Calgary we track prices for — Costco, Shoppers Drug Mart, Walmart, Safeway, Real Canadian Superstore, Co-op, Rexall, London Drugs, and more.",
  alternates: { canonical: "/pharmacies" },
};

const CHAIN_STYLE: Record<string, { color: string; border: string; bg: string; emoji: string }> = {
  Costco:                    { color: "text-blue-700",   border: "border-blue-200",   bg: "bg-blue-50",   emoji: "🟦" },
  Shoppers:                  { color: "text-red-600",    border: "border-red-200",    bg: "bg-red-50",    emoji: "🔴" },
  Walmart:                   { color: "text-yellow-700", border: "border-yellow-200", bg: "bg-yellow-50", emoji: "🟡" },
  Safeway:                   { color: "text-red-500",    border: "border-red-200",    bg: "bg-red-50",    emoji: "🛒" },
  "Co-op":                   { color: "text-teal-700",   border: "border-teal-200",   bg: "bg-teal-50",   emoji: "🔵" },
  "Real Canadian Superstore":{ color: "text-green-700",  border: "border-green-200",  bg: "bg-green-50",  emoji: "🟢" },
  Rexall:                    { color: "text-orange-600", border: "border-orange-200", bg: "bg-orange-50", emoji: "💊" },
  "London Drugs":            { color: "text-sky-700",    border: "border-sky-200",    bg: "bg-sky-50",    emoji: "🧪" },
  Pharmasave:                { color: "text-purple-700", border: "border-purple-200", bg: "bg-purple-50", emoji: "💜" },
  IDA:                       { color: "text-indigo-600", border: "border-indigo-200", bg: "bg-indigo-50", emoji: "🏥" },
  Guardian:                  { color: "text-cyan-700",   border: "border-cyan-200",   bg: "bg-cyan-50",   emoji: "🛡️" },
  "Medicine Shoppe":         { color: "text-pink-700",   border: "border-pink-200",   bg: "bg-pink-50",   emoji: "⚕️" },
  Sobeys:                    { color: "text-orange-700", border: "border-orange-200", bg: "bg-orange-50", emoji: "🟠" },
  Loblaw:                    { color: "text-red-700",    border: "border-red-200",    bg: "bg-red-50",    emoji: "🏪" },
  "Community Natural Foods": { color: "text-green-600",  border: "border-green-200",  bg: "bg-green-50",  emoji: "🌿" },
};
const DEFAULT = { color: "text-gray-700", border: "border-gray-200", bg: "bg-gray-50", emoji: "🏥" };

export default async function PharmaciesPage() {
  const supabase = createClient();

  const { data: pharmacies } = await supabase
    .from("pharmacies")
    .select("id, name, chain, address, city, province, phone, has_delivery, delivery_fee, accepts_alberta_blue_cross")
    .order("chain", { ascending: true })
    .order("address", { ascending: true });

  // Group by chain
  const grouped = new Map<string, typeof pharmacies>();
  for (const ph of pharmacies ?? []) {
    const chain = ph.chain ?? "Other";
    if (!grouped.has(chain)) grouped.set(chain, []);
    grouped.get(chain)!.push(ph);
  }

  // Sort chains: Costco first (cheapest), then alphabetically
  const chainOrder = ["Costco", "Real Canadian Superstore", "Walmart", "Loblaw", "Safeway", "Sobeys", "Co-op"];
  const chains = [
    ...chainOrder.filter((c) => grouped.has(c)),
    ...[...grouped.keys()].filter((c) => !chainOrder.includes(c)).sort(),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main id="main-content" className="flex-1 px-4 sm:px-6 py-12">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#1a1a2e] mb-3">
              Browse Calgary Pharmacies
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              We track prices at <strong>{pharmacies?.length ?? 0} pharmacies</strong> across Calgary.
              Click any location to see all drug prices at that store.
            </p>
          </div>

          {/* Cheapest tip */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="text-4xl flex-shrink-0" aria-hidden="true">💡</span>
            <div>
              <p className="font-semibold text-[#1a1a2e] text-lg">
                Costco Pharmacy is usually the cheapest — up to 40% less than Shoppers Drug Mart.
              </p>
              <p className="text-gray-500 text-base mt-0.5">
                Membership required to pick up, but prescriptions are open to everyone at many locations.
              </p>
            </div>
          </div>

          {/* Pharmacy groups */}
          <div className="space-y-10">
            {chains.map((chain) => {
              const locations = grouped.get(chain) ?? [];
              const s = CHAIN_STYLE[chain] ?? DEFAULT;
              return (
                <section key={chain} aria-labelledby={`chain-${chain}`}>
                  {/* Chain header */}
                  <div className={`flex items-center gap-3 mb-4 pb-3 border-b-2 ${s.border}`}>
                    <span className="text-3xl" aria-hidden="true">{s.emoji}</span>
                    <h2 id={`chain-${chain}`} className={`text-2xl font-bold ${s.color}`}>
                      {chain}
                    </h2>
                    <span className="ml-auto text-sm font-medium text-gray-400">
                      {locations.length} location{locations.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Location cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {locations.map((ph) => (
                      <Link
                        key={ph.id}
                        href={`/pharmacy/${ph.id}`}
                        className={`group rounded-xl border-2 ${s.border} p-5 bg-white hover:${s.bg} transition-colors shadow-sm hover:shadow-md`}
                      >
                        <p className="font-semibold text-[#1a1a2e] text-base group-hover:text-[#0891B2] transition-colors mb-1 leading-snug">
                          {ph.address}
                        </p>
                        <p className="text-gray-400 text-sm mb-3">
                          {ph.city}, {ph.province}
                        </p>
                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {ph.accepts_alberta_blue_cross && (
                            <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
                              AB Blue Cross
                            </span>
                          )}
                          {ph.has_delivery && (
                            <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                              🚚 {ph.delivery_fee === 0 ? "Free delivery" : `Delivery $${ph.delivery_fee}`}
                            </span>
                          )}
                          {ph.phone && (
                            <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                              📞 {ph.phone}
                            </span>
                          )}
                        </div>
                        <p className="text-[#0891B2] text-sm font-semibold mt-3 group-hover:underline">
                          See all drug prices →
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <p className="text-gray-500 text-lg mb-4">
              Looking for the cheapest pharmacy for a specific drug?
            </p>
            <Link href="/search" className="btn-primary inline-block text-lg px-8 py-4">
              Search by medication name →
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
