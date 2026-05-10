import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { submitPrice } from "@/lib/actions/prices";

export const metadata = { title: "Submit a Price — CheaperRx" };

interface SubmitPricePageProps {
  searchParams: { q?: string; submitted?: string };
}

export default async function SubmitPricePage({ searchParams }: SubmitPricePageProps) {
  const query = (searchParams.q ?? "").trim();
  const supabase = createClient();

  // Fetch pharmacies for the dropdown
  const { data: pharmacies } = await supabase
    .from("pharmacies")
    .select("id, name, address, city")
    .order("name", { ascending: true });

  // Pre-fill drug if query provided
  let drug = null;
  if (query) {
    const { data: drugs } = await supabase
      .from("drugs")
      .select("id, brand_name, generic_name, strength")
      .or(`brand_name.ilike.%${query}%,generic_name.ilike.%${query}%`)
      .order("is_generic", { ascending: true })
      .limit(1);
    drug = drugs?.[0] ?? null;
  }

  // Fetch all drugs for the dropdown
  const { data: allDrugs } = await supabase
    .from("drugs")
    .select("id, brand_name, generic_name, strength, is_generic")
    .order("is_generic", { ascending: true })
    .order("brand_name", { ascending: true });

  if (searchParams.submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 py-20">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-6xl mb-4" aria-hidden="true">🎉</p>
            <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3">Thank you!</h1>
            <p className="text-xl text-gray-500 mb-8">
              Your price submission helps other Canadians save money on their prescriptions.
              Our team will review and update prices within 24 hours.
            </p>
            <a
              href="/search"
              className="btn-primary inline-block"
            >
              Search more medications →
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Submit a Price</h1>
            <p className="text-xl text-gray-500">
              Did you pay a different price at your pharmacy? Help others save money by sharing
              what you paid.
            </p>
          </div>

          <div className="card">
            <form action={submitPrice} className="space-y-5">

              {/* Drug selection */}
              <div>
                <label htmlFor="drug_id" className="block text-lg font-medium text-gray-700 mb-1">
                  Medication <span className="text-red-500">*</span>
                </label>
                <select
                  id="drug_id"
                  name="drug_id"
                  required
                  defaultValue={drug?.id ?? ""}
                  className="input-field w-full"
                >
                  <option value="">Select a medication...</option>
                  {(allDrugs ?? []).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.brand_name} {d.strength}
                      {d.is_generic ? " (Generic)" : " (Brand)"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pharmacy selection */}
              <div>
                <label htmlFor="pharmacy_id" className="block text-lg font-medium text-gray-700 mb-1">
                  Pharmacy <span className="text-red-500">*</span>
                </label>
                <select
                  id="pharmacy_id"
                  name="pharmacy_id"
                  required
                  className="input-field w-full"
                >
                  <option value="">Select a pharmacy...</option>
                  {(pharmacies ?? []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.address}, {p.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price paid */}
              <div>
                <label htmlFor="price_paid" className="block text-lg font-medium text-gray-700 mb-1">
                  Price you paid (CAD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">$</span>
                  <input
                    id="price_paid"
                    name="price_paid"
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className="input-field w-full pl-8"
                    aria-label="Price paid in Canadian dollars"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-primary w-full">
                  Submit price →
                </button>
              </div>

              <p className="text-gray-400 text-sm text-center">
                Prices are reviewed by our team before going live. Thank you for contributing!
              </p>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
