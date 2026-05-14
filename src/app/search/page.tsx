import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBox } from "@/components/search/SearchBox";
import { PharmacyCard } from "@/components/search/PharmacyCard";
import { LockedResults } from "@/components/search/LockedResults";
import { isPro, getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { saveMedication } from "@/lib/actions/medications";
import type { DrugResult, PharmacyResult } from "@/lib/mock-data";

const FREE_RESULTS_LIMIT = 3;

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q ?? "").trim();
  const supabase = createClient();
  const [user, pro] = await Promise.all([getUser(), isPro()]);

  let drug: DrugResult | null = null;
  let allResults: PharmacyResult[] = [];

  if (query) {
    // Find the best matching drug (brand drugs first)
    const { data: matches } = await supabase
      .from("drugs")
      .select("*")
      .or(`brand_name.ilike.%${query}%,generic_name.ilike.%${query}%`)
      .order("is_generic", { ascending: true })
      .limit(1);

    const found = matches?.[0] ?? null;

    if (found) {
      // Find generic alternative (only for brand drugs)
      let genericAlternative: DrugResult["generic_alternative"] = null;
      if (!found.is_generic) {
        const { data: generics } = await supabase
          .from("drugs")
          .select("id, brand_name, generic_name, strength")
          .eq("brand_drug_id", found.id)
          .eq("is_generic", true)
          .limit(1);

        if (generics?.[0]) {
          const g = generics[0];
          const { data: gPrices } = await supabase
            .from("prices")
            .select("price")
            .eq("drug_id", g.id)
            .eq("verified", true);

          const avgPrice =
            gPrices && gPrices.length > 0
              ? gPrices.reduce((s, p) => s + Number(p.price), 0) / gPrices.length
              : 0;

          genericAlternative = {
            id: g.id,
            brand_name: g.brand_name,
            generic_name: g.generic_name,
            strength: g.strength,
            avg_price: avgPrice,
          };
        }
      }

      drug = {
        id: found.id,
        brand_name: found.brand_name,
        generic_name: found.generic_name,
        strength: found.strength,
        dosage_form: found.dosage_form,
        is_generic: found.is_generic,
        generic_alternative: genericAlternative,
      };

      // Get pharmacy prices sorted cheapest first
      const { data: priceRows } = await supabase.rpc("get_cheapest_prices", {
        p_drug_id: found.id,
        p_city: "Calgary",
        p_limit: 20,
      });

      allResults = (priceRows ?? []).map((p) => ({
        pharmacy_id: p.pharmacy_id,
        pharmacy_name: p.pharmacy_name,
        chain: p.chain,
        address: p.address,
        city: p.city,
        phone: p.phone,
        has_delivery: p.has_delivery,
        delivery_fee: p.delivery_fee != null ? Number(p.delivery_fee) : null,
        accepts_alberta_blue_cross: p.accepts_alberta_blue_cross,
        accepts_odb: p.accepts_odb,
        price: Number(p.price),
        quantity: p.quantity,
        last_updated: p.last_updated,
      }));
    }
  }

  const mostExpensivePrice = allResults.length
    ? Math.max(...allResults.map((r) => r.price))
    : 0;

  const visibleResults = pro ? allResults : allResults.slice(0, FREE_RESULTS_LIMIT);
  const hiddenResults = pro ? [] : allResults.slice(FREE_RESULTS_LIMIT);

  const hasGeneric = drug && !drug.is_generic && drug.generic_alternative;

  const lastUpdated = allResults[0]
    ? new Date(allResults[0].last_updated).toLocaleDateString("en-CA", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ── TOP SEARCH BAR ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-[#0891B2] text-gray-500 hover:text-[#0891B2] transition-colors text-2xl"
            aria-label="Go back to home page"
          >
            ←
          </Link>
          <div className="flex-1">
            <SearchBox
              size="compact"
              defaultValue={query}
              placeholder="Search another medication..."
            />
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto">

          {/* ── NO QUERY STATE ── */}
          {!query && (
            <div className="text-center py-20">
              <p className="text-6xl mb-4" aria-hidden="true">💊</p>
              <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3">
                What medication do you need?
              </h1>
              <p className="text-xl text-gray-500 mb-8">
                Type a medication name above to see prices near you.
              </p>
            </div>
          )}

          {/* ── QUERY WITH RESULTS ── */}
          {query && drug && allResults.length > 0 && (
            <>
              {/* Generic savings banner */}
              {hasGeneric && (
                <div
                  className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-3"
                  role="note"
                  aria-label="Generic alternative available"
                >
                  <div className="flex-1">
                    <p className="text-xl font-semibold text-[#16A34A] mb-1">
                      💡 Good news! A generic version is available
                    </p>
                    <p className="text-lg text-gray-600">
                      <strong>{drug.generic_alternative!.brand_name}</strong> costs about{" "}
                      <strong className="text-[#16A34A]">
                        ${drug.generic_alternative!.avg_price.toFixed(2)}
                      </strong>{" "}
                      — that&apos;s{" "}
                      <strong className="text-[#16A34A]">
                        ${(allResults[0].price - drug.generic_alternative!.avg_price).toFixed(2)} less
                      </strong>{" "}
                      per month and works exactly the same way.
                    </p>
                  </div>
                  <Link
                    href={`/search?q=${encodeURIComponent(drug.generic_alternative!.generic_name)}`}
                    className="flex-shrink-0 bg-[#16A34A] hover:bg-[#15803d] text-white font-semibold rounded-xl px-5 py-3 text-lg transition-colors min-h-[56px] flex items-center whitespace-nowrap"
                  >
                    Show me the generic →
                  </Link>
                </div>
              )}

              {/* Results header */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h1 className="text-3xl font-bold text-[#1a1a2e] mb-1">
                      Prices for {drug.brand_name} {drug.strength} near Calgary
                    </h1>
                    <div className="flex flex-wrap gap-x-4 text-gray-400 text-lg">
                      {lastUpdated && <span>Prices last updated: {lastUpdated}</span>}
                      <span>Showing prices for {allResults[0].quantity}-day supply</span>
                    </div>
                  </div>
                  {user && (
                    <form action={saveMedication} className="flex-shrink-0">
                      <input type="hidden" name="drug_id" value={drug.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#1a1a2e] font-semibold rounded-xl px-4 py-2.5 text-base transition-colors"
                        aria-label={`Save ${drug.brand_name} to My Medications`}
                      >
                        💊 Save to My Meds
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Pro badge */}
              {pro && (
                <div className="inline-flex items-center gap-2 bg-[#0891B2] text-white rounded-full px-4 py-1.5 text-base font-semibold mb-5">
                  ✓ Pro — seeing all {allResults.length} pharmacies
                </div>
              )}

              {/* Pharmacy cards */}
              <div className="space-y-5">
                {visibleResults.map((result, index) => (
                  <PharmacyCard
                    key={result.pharmacy_id}
                    result={result}
                    rank={index + 1}
                    mostExpensivePrice={mostExpensivePrice}
                    isCheapest={index === 0}
                    drugId={pro ? drug.id : undefined}
                  />
                ))}
              </div>

              {/* Locked section for free users */}
              {!pro && hiddenResults.length > 0 && (
                <LockedResults hiddenResults={hiddenResults} />
              )}
            </>
          )}

          {/* ── QUERY WITH NO RESULTS ── */}
          {query && (!drug || allResults.length === 0) && (
            <div className="text-center py-16">
              <p className="text-6xl mb-4" aria-hidden="true">💊</p>
              <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
                We don&apos;t have prices for &ldquo;{query}&rdquo; yet
              </h1>
              <p className="text-lg text-gray-500 mb-8">
                Be the first to submit a price and help other Calgarians save money.
              </p>

              {/* Primary CTA */}
              <Link
                href={`/submit-price?q=${encodeURIComponent(query)}`}
                className="inline-flex items-center gap-2 bg-[#0891B2] hover:bg-[#0e7490] text-white font-semibold rounded-xl px-6 py-3.5 text-lg transition-colors mb-10"
              >
                📬 Submit a price for &ldquo;{query}&rdquo;
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-200 my-8" />

              {/* Suggestions */}
              <p className="text-base text-gray-400 mb-4">Or try searching for one of these:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Tylenol", "Advil", "Ibuprofen", "Metformin", "Atorvastatin", "Lisinopril", "Omeprazole", "Amoxicillin"].map((name) => (
                  <Link
                    key={name}
                    href={`/search?q=${encodeURIComponent(name)}`}
                    className="bg-white border border-gray-200 hover:border-[#0891B2] rounded-xl px-4 py-2 text-[#1a1a2e] hover:text-[#0891B2] transition-colors font-medium text-base"
                  >
                    {name}
                  </Link>
                ))}
              </div>

              {/* Spelling hint */}
              <p className="text-sm text-gray-400 mt-6">
                Tip: try the generic name (e.g. &ldquo;acetaminophen&rdquo; instead of &ldquo;Tylenol&rdquo;) or just the first few letters.
              </p>
            </div>
          )}

        </div>
      </main>

      {/* ── STICKY BOTTOM BAR ── */}
      {query && allResults.length > 0 && (
        <div
          className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg px-4 py-3 z-40"
          role="complementary"
          aria-label="Help improve prices"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <p className="text-gray-500 text-lg">
              Did you pay a different price at your pharmacy?
            </p>
            <Link
              href={`/submit-price?q=${encodeURIComponent(query)}`}
              className="flex-shrink-0 text-[#0891B2] font-semibold text-lg hover:underline flex items-center gap-1"
            >
              Help others →
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
