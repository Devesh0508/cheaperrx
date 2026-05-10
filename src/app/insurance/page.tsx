import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBox } from "@/components/search/SearchBox";
import { PharmacyCard } from "@/components/search/PharmacyCard";
import { createClient } from "@/lib/supabase/server";
import { getUser, isPro } from "@/lib/auth";

export const metadata = { title: "Insurance Checker — CheaperRx" };

type InsurancePlan = "abc" | "odb" | "bc_pharmacare" | "none";

interface InsurancePageProps {
  searchParams: {
    q?: string;
    plan?: string;
  };
}

const PLAN_LABELS: Record<InsurancePlan, string> = {
  abc: "Alberta Blue Cross",
  odb: "Ontario Drug Benefit (ODB)",
  bc_pharmacare: "BC PharmaCare",
  none: "No insurance / Pay out of pocket",
};

const PLAN_FIELD: Record<InsurancePlan, string | null> = {
  abc: "accepts_alberta_blue_cross",
  odb: "accepts_odb",
  bc_pharmacare: "accepts_bc_pharmacare",
  none: null,
};

export default async function InsurancePage({ searchParams }: InsurancePageProps) {
  const query = (searchParams.q ?? "").trim();
  const plan = (searchParams.plan ?? "abc") as InsurancePlan;

  const [user, pro] = await Promise.all([getUser(), isPro()]);

  if (!pro) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 py-20">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-6xl mb-4" aria-hidden="true">🔒</p>
            <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3">
              Insurance Checker is a Pro Feature
            </h1>
            <p className="text-xl text-gray-500 mb-8">
              Filter pharmacies by your insurance plan and find the cheapest covered price — instantly.
            </p>
            <Link href="/upgrade" className="btn-primary inline-block">
              Unlock Insurance Checker →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const supabase = createClient();
  let results: Array<{
    pharmacy_id: string;
    pharmacy_name: string;
    chain: string | null;
    address: string;
    city: string;
    phone: string | null;
    has_delivery: boolean;
    delivery_fee: number | null;
    accepts_alberta_blue_cross: boolean;
    accepts_odb: boolean;
    price: number;
    quantity: number;
    last_updated: string;
  }> = [];

  let drugName = "";

  if (query) {
    // Find drug
    const { data: matches } = await supabase
      .from("drugs")
      .select("id, brand_name, strength")
      .or(`brand_name.ilike.%${query}%,generic_name.ilike.%${query}%`)
      .order("is_generic", { ascending: true })
      .limit(1);

    const drug = matches?.[0];
    if (drug) {
      drugName = `${drug.brand_name} ${drug.strength}`;

      const { data: rows } = await supabase.rpc("get_cheapest_prices", {
        p_drug_id: drug.id,
        p_city: "Calgary",
        p_limit: 50,
      });

      const allRows = (rows ?? []).map((p) => ({
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

      const filterField = PLAN_FIELD[plan];
      results =
        filterField === null
          ? allRows
          : allRows.filter((r) => r[filterField as keyof typeof r] === true);
    }
  }

  const mostExpensivePrice = results.length
    ? Math.max(...results.map((r) => r.price))
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-8">

          <div>
            <h1 className="text-3xl font-bold text-[#1a1a2e] mb-1">Insurance Checker</h1>
            <p className="text-xl text-gray-500">
              Find the cheapest pharmacy that accepts your insurance plan.
            </p>
          </div>

          {/* Plan selector + search in one card */}
          <div className="card space-y-5">
            {/* Insurance plan selector */}
            <div>
              <label className="block text-lg font-semibold text-[#1a1a2e] mb-3">
                Your insurance plan
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(PLAN_LABELS) as InsurancePlan[]).map((key) => (
                  <Link
                    key={key}
                    href={`/insurance?plan=${key}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                    className={`rounded-xl border-2 px-4 py-3 text-base font-medium transition-colors text-center ${
                      plan === key
                        ? "border-[#0891B2] bg-[#e0f2fe] text-[#0891B2]"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#0891B2]"
                    }`}
                  >
                    {PLAN_LABELS[key]}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="block text-lg font-semibold text-[#1a1a2e] mb-3">
                Search medication
              </label>
              <SearchBox
                size="compact"
                defaultValue={query}
                placeholder="e.g. Metformin, Lipitor..."
                action={`/insurance?plan=${plan}`}
              />
            </div>
          </div>

          {/* Results */}
          {query && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-5xl mb-3" aria-hidden="true">😕</p>
              <p className="text-xl font-semibold text-[#1a1a2e] mb-2">
                No pharmacies found for this combination
              </p>
              <p className="text-lg text-gray-500">
                Try a different plan or search for a different medication.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1a1a2e]">
                  {results.length} pharmacie{results.length !== 1 ? "s" : ""} accepting{" "}
                  <span className="text-[#0891B2]">{PLAN_LABELS[plan]}</span>
                </h2>
                <p className="text-gray-400 text-base">for {drugName}</p>
              </div>

              <div className="space-y-5">
                {results.map((result, index) => (
                  <PharmacyCard
                    key={result.pharmacy_id}
                    result={result}
                    rank={index + 1}
                    mostExpensivePrice={mostExpensivePrice}
                    isCheapest={index === 0}
                  />
                ))}
              </div>
            </>
          )}

          {!query && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-5xl mb-4" aria-hidden="true">💳</p>
              <p className="text-xl">Select your plan and search for a medication above.</p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
