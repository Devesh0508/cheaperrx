import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBox } from "@/components/search/SearchBox";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

/* ─── Chain → accent colour + emoji ─────────────────────────────────────── */
const CHAIN_STYLE: Record<string, { color: string; bg: string; emoji: string }> = {
  Costco:                   { color: "text-blue-700",   bg: "bg-blue-50",   emoji: "🟦" },
  Shoppers:                 { color: "text-red-600",    bg: "bg-red-50",    emoji: "🔴" },
  Walmart:                  { color: "text-yellow-600", bg: "bg-yellow-50", emoji: "🟡" },
  Safeway:                  { color: "text-red-500",    bg: "bg-red-50",    emoji: "🛒" },
  "Co-op":                  { color: "text-teal-700",   bg: "bg-teal-50",   emoji: "🔵" },
  "Real Canadian Superstore":{ color: "text-green-700", bg: "bg-green-50",  emoji: "🟢" },
  Rexall:                   { color: "text-orange-600", bg: "bg-orange-50", emoji: "💊" },
  "London Drugs":           { color: "text-sky-700",    bg: "bg-sky-50",    emoji: "🧪" },
  Pharmasave:               { color: "text-purple-700", bg: "bg-purple-50", emoji: "💜" },
  IDA:                      { color: "text-indigo-600", bg: "bg-indigo-50", emoji: "🏥" },
  Guardian:                 { color: "text-cyan-700",   bg: "bg-cyan-50",   emoji: "🛡️" },
  "Medicine Shoppe":        { color: "text-pink-700",   bg: "bg-pink-50",   emoji: "⚕️" },
  Sobeys:                   { color: "text-orange-700", bg: "bg-orange-50", emoji: "🟠" },
  Loblaw:                   { color: "text-red-700",    bg: "bg-red-50",    emoji: "🏪" },
};
const DEFAULT_CHAIN_STYLE = { color: "text-gray-700", bg: "bg-gray-50", emoji: "🏥" };

/* ─── Drug type filter labels ────────────────────────────────────────────── */
const TYPE_FILTERS = [
  { key: "all",     label: "All drugs" },
  { key: "otc",     label: "OTC / Over-the-counter" },
  { key: "rx",      label: "Prescription (Rx)" },
  { key: "generic", label: "Generics" },
];

interface PageProps {
  params: { id: string };
  searchParams: { filter?: string; q?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: ph } = await supabase
    .from("pharmacies")
    .select("name, address, city")
    .eq("id", params.id)
    .single();

  if (!ph) return { title: "Pharmacy — CheaperRx" };
  return {
    title: `${ph.name} (${ph.address}) Drug Prices — CheaperRx`,
    description: `Browse all prescription and OTC drug prices at ${ph.name}, ${ph.address}, ${ph.city}. Compare with other Calgary pharmacies on CheaperRx.`,
  };
}

export default async function PharmacyPage({ params, searchParams }: PageProps) {
  const supabase = createClient();
  const filter = searchParams.filter ?? "all";
  const inlineQ = (searchParams.q ?? "").toLowerCase();

  /* ── Fetch pharmacy ─────────────────────────────────────────────────────── */
  const { data: pharmacy, error: phErr } = await supabase
    .from("pharmacies")
    .select("*")
    .eq("id", params.id)
    .single();

  if (phErr || !pharmacy) notFound();

  /* ── Fetch all prices at this pharmacy + all drug info ─────────────────── */
  const [{ data: rawPrices }, { data: allDrugs }] = await Promise.all([
    supabase
      .from("prices")
      .select("drug_id, price, quantity, last_updated")
      .eq("pharmacy_id", params.id)
      .eq("verified", true)
      .order("price", { ascending: true }),
    supabase
      .from("drugs")
      .select("id, brand_name, generic_name, strength, dosage_form, drug_class, is_generic"),
  ]);

  // Build drug lookup map
  type DrugInfo = {
    id: string; brand_name: string; generic_name: string;
    strength: string; dosage_form: string; drug_class: string | null; is_generic: boolean;
  };
  const drugMap = new Map<string, DrugInfo>(
    (allDrugs ?? []).map((d) => [d.id, d as DrugInfo])
  );

  // Join prices with drugs
  type PriceRow = {
    drug_id: string; price: number; quantity: number;
    last_updated: string; drugs: DrugInfo | null;
  };
  const priceRows: PriceRow[] = (rawPrices ?? []).map((p) => ({
    drug_id: p.drug_id,
    price: Number(p.price),
    quantity: p.quantity ?? 0,
    last_updated: p.last_updated ?? new Date().toISOString(),
    drugs: drugMap.get(p.drug_id) ?? null,
  }));

  /* ── Apply type filter ───────────────────────────────────────────────────── */
  let filtered: PriceRow[] = priceRows;

  if (filter === "otc") {
    filtered = filtered.filter((r) => r.drugs && !r.drugs.is_generic &&
      (r.drugs.brand_name.match(/Tylenol|Advil|Aspirin|Aleve|Reactine|Claritin|Benadryl|Aerius|Allegra|Pepto|Imodium|Gravol|Zantac|Tums|Melatonin|Vitamin|Zinc|Fish Oil|Robitussin|Mucinex|Sudafed|Polysporin|Hydrocortisone|Plan B|Canesten|Monistat|Voltaren|Robaxacet|NyQuil|DayQuil|Vicks|Buckley|Neo Citran|Strepsils|Halls|Drixoral|Dristan|Flonase|Otrivin|Visine|Systane|RestoraLax|Dulcolax|Metamucil|Colace|Gaviscon|Nicorette|Nicoderm|Rogaine|Preparation H|Abreva|Compound W|Centrum|Jamieson|Magnesium|CoQ10|Folic|Calcium|Children|Infants|First Response|COVID|Differin|Tylenol Arthritis|Advil Liqui|Glucosamine|Gas-X|Align|Lansoprazole|Benadryl Cream|Benzoyl|Alli|Pedialyte|A535/i)));
  } else if (filter === "rx") {
    filtered = filtered.filter((r) => r.drugs && !r.drugs.is_generic &&
      !r.drugs.brand_name.match(/Tylenol|Advil|Aspirin|Aleve|Reactine|Claritin|Benadryl|Aerius|Allegra|Pepto|Imodium|Gravol|Zantac|Tums|Melatonin|Vitamin|Zinc|Fish Oil|Robitussin|Mucinex|Sudafed|Polysporin|Hydrocortisone|Plan B|Canesten|Monistat|Voltaren|Robaxacet|NyQuil|DayQuil|Vicks|Buckley|Neo Citran|Strepsils|Halls|Drixoral|Dristan|Flonase|Otrivin|Visine|Systane|RestoraLax|Dulcolax|Metamucil|Colace|Gaviscon|Nicorette|Nicoderm|Rogaine|Preparation H|Abreva|Compound W|Centrum|Jamieson|Magnesium|CoQ10|Folic|Calcium|Children|Infants|First Response|COVID|Differin|Tylenol Arthritis|Advil Liqui|Glucosamine|Gas-X|Align|Lansoprazole|Benadryl Cream|Benzoyl|Alli|Pedialyte|A535/i));
  } else if (filter === "generic") {
    filtered = filtered.filter((r) => r.drugs?.is_generic);
  }

  /* ── Apply inline drug name search ─────────────────────────────────────── */
  if (inlineQ.length >= 2) {
    filtered = filtered.filter((r) =>
      r.drugs &&
      (r.drugs.brand_name.toLowerCase().includes(inlineQ) ||
       r.drugs.generic_name.toLowerCase().includes(inlineQ))
    );
  }

  /* ── Stats ──────────────────────────────────────────────────────────────── */
  const totalCount = priceRows.length;
  const minPrice = filtered.length ? Math.min(...filtered.map((r) => r.price)) : 0;
  const maxPrice = filtered.length ? Math.max(...filtered.map((r) => r.price)) : 0;
  const lastUpdated = priceRows[0]
    ? new Date(priceRows[0].last_updated).toLocaleDateString("en-CA", {
        month: "short", day: "numeric", year: "numeric",
      })
    : null;

  const style = CHAIN_STYLE[pharmacy.chain ?? ""] ?? DEFAULT_CHAIN_STYLE;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ── STICKY TOP SEARCH BAR ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            href="/search"
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-[#0891B2] text-gray-500 hover:text-[#0891B2] transition-colors text-2xl"
            aria-label="Back to search"
          >
            ←
          </Link>
          <div className="flex-1">
            <SearchBox
              size="compact"
              placeholder="Search a drug or another pharmacy..."
            />
          </div>
        </div>
      </div>

      <main id="main-content" className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── PHARMACY HEADER ── */}
          <div className={`rounded-2xl border-2 p-6 ${style.bg} border-gray-200`}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div
                className={`text-5xl flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100`}
                aria-hidden="true"
              >
                {style.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold uppercase tracking-wide mb-0.5 ${style.color}`}>
                  {pharmacy.chain}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] leading-tight mb-1">
                  {pharmacy.name}
                </h1>
                <p className="text-gray-500 text-lg">{pharmacy.address}, {pharmacy.city}, {pharmacy.province}</p>

                {/* Badges row */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {pharmacy.accepts_alberta_blue_cross && (
                    <span className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-700 text-sm font-medium rounded-full px-3 py-1">
                      ✓ Alberta Blue Cross
                    </span>
                  )}
                  {pharmacy.has_delivery && (
                    <span className="inline-flex items-center gap-1 bg-white border border-green-200 text-green-700 text-sm font-medium rounded-full px-3 py-1">
                      🚚 Delivery {pharmacy.delivery_fee === 0 ? "(free)" : `($${pharmacy.delivery_fee})`}
                    </span>
                  )}
                  {pharmacy.phone && (
                    <a
                      href={`tel:${pharmacy.phone}`}
                      className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-full px-3 py-1 hover:border-[#0891B2] hover:text-[#0891B2] transition-colors"
                    >
                      📞 {pharmacy.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Stat pill */}
              <div className="flex-shrink-0 text-center bg-white rounded-2xl border border-gray-200 px-5 py-3 shadow-sm">
                <p className="text-3xl font-bold text-[#1a1a2e]">{totalCount}</p>
                <p className="text-gray-400 text-sm font-medium">drugs available</p>
              </div>
            </div>
          </div>

          {/* ── STATS BAR ── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Cheapest drug", value: filtered.length ? `$${minPrice.toFixed(2)}` : "—" },
              { label: "Most expensive", value: filtered.length ? `$${maxPrice.toFixed(2)}` : "—" },
              { label: "Prices updated", value: lastUpdated ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <p className="text-xl font-bold text-[#1a1a2e]">{value}</p>
                <p className="text-gray-400 text-sm">{label}</p>
              </div>
            ))}
          </div>

          {/* ── FILTER TABS + INLINE SEARCH ── */}
          <div className="space-y-3">
            {/* Type filter tabs */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by drug type">
              {TYPE_FILTERS.map((f) => (
                <Link
                  key={f.key}
                  href={`/pharmacy/${params.id}?filter=${f.key}${inlineQ ? `&q=${encodeURIComponent(inlineQ)}` : ""}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                    filter === f.key
                      ? "bg-[#0891B2] text-white border-[#0891B2]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#0891B2] hover:text-[#0891B2]"
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>

            {/* Inline search-within */}
            <form method="GET" action={`/pharmacy/${params.id}`} className="relative">
              <input type="hidden" name="filter" value={filter} />
              <input
                type="search"
                name="q"
                defaultValue={searchParams.q ?? ""}
                placeholder={`Search within ${pharmacy.name}…`}
                className="w-full rounded-xl border-2 border-gray-200 focus:border-[#0891B2] outline-none px-5 py-3 text-lg text-[#1a1a2e] placeholder-gray-400 bg-white"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0891B2] text-white rounded-lg px-4 py-1.5 text-sm font-semibold"
              >
                Search
              </button>
            </form>
          </div>

          {/* ── RESULTS COUNT ── */}
          <p className="text-gray-500 text-base">
            Showing <strong className="text-[#1a1a2e]">{filtered.length}</strong> drug{filtered.length !== 1 ? "s" : ""}
            {filter !== "all" && ` (${TYPE_FILTERS.find((f) => f.key === filter)?.label})`}
            {inlineQ && ` matching "${inlineQ}"`}
            {" "}— sorted cheapest first
          </p>

          {/* ── DRUG PRICE LIST ── */}
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((row, i) => {
                const d = row.drugs;
                if (!d) return null;
                const price = row.price;

                return (
                  <div
                    key={`${d.id}-${i}`}
                    className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm hover:shadow-md hover:border-[#0891B2] transition-all group"
                  >
                    {/* Rank */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i === 0
                          ? "bg-[#16A34A] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>

                    {/* Drug info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h2 className="text-lg font-bold text-[#1a1a2e] group-hover:text-[#0891B2] transition-colors">
                          {d.brand_name}
                        </h2>
                        <span className="text-gray-400 text-base">{d.strength}</span>
                        {d.is_generic && (
                          <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                            Generic
                          </span>
                        )}
                        {d.drug_class && (
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                            {d.drug_class}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">
                        {d.generic_name} · {d.dosage_form} · {row.quantity} per fill
                      </p>
                    </div>

                    {/* Price + action */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#1a1a2e]">
                          ${price.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-xs">per fill</p>
                      </div>
                      <Link
                        href={`/search?q=${encodeURIComponent(d.brand_name)}`}
                        className="flex-shrink-0 text-sm font-semibold text-[#0891B2] hover:text-white hover:bg-[#0891B2] border border-[#0891B2] rounded-xl px-3 py-2 transition-colors whitespace-nowrap"
                        aria-label={`Compare ${d.brand_name} prices at other pharmacies`}
                      >
                        Compare →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-5xl mb-4" aria-hidden="true">🔍</p>
              <p className="text-xl font-semibold text-[#1a1a2e] mb-2">No drugs found</p>
              <p className="text-gray-500 mb-4">
                {inlineQ
                  ? `No drugs matching "${inlineQ}" at this pharmacy.`
                  : "Try a different filter."}
              </p>
              <Link
                href={`/pharmacy/${params.id}`}
                className="text-[#0891B2] font-semibold hover:underline"
              >
                Clear filters
              </Link>
            </div>
          )}

          {/* ── BOTTOM CTA ── */}
          <div className="bg-[#f0f9ff] border border-[#0891B2]/20 rounded-2xl p-6 text-center">
            <p className="text-[#1a1a2e] font-semibold text-lg mb-1">
              💡 Want to know if another pharmacy is cheaper?
            </p>
            <p className="text-gray-500 mb-4">
              Click <strong>Compare →</strong> on any drug above to see all 36 Calgary pharmacies side by side.
            </p>
            <Link href="/search" className="btn-primary inline-block">
              Search all pharmacies
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
