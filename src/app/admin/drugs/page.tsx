import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { addDrug, deleteDrug } from "@/lib/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const metadata = { title: "Drugs — Admin" };

export default async function AdminDrugsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  await requireAdmin();
  const supabase = createClient();
  const query = (searchParams.q ?? "").trim();

  let drugsQuery = supabase
    .from("drugs")
    .select("id, brand_name, generic_name, strength, dosage_form, drug_class, is_generic, created_at")
    .order("brand_name", { ascending: true })
    .limit(100);

  if (query) {
    drugsQuery = drugsQuery.or(
      `brand_name.ilike.%${query}%,generic_name.ilike.%${query}%`
    );
  }

  const { data: drugs = [], count } = await drugsQuery;

  // Get price counts per drug
  const { data: priceCounts = [] } = await supabase
    .from("prices")
    .select("drug_id")
    .eq("verified", true);

  const priceCountMap: Record<string, number> = {};
  (priceCounts ?? []).forEach((p) => {
    priceCountMap[p.drug_id] = (priceCountMap[p.drug_id] || 0) + 1;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Drug Catalog</h1>
          <p className="text-gray-500 mt-1">{(drugs ?? []).length} drugs shown</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Drug list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <form method="GET">
            <div className="flex gap-2">
              <input
                name="q"
                defaultValue={query}
                placeholder="Search drugs…"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0891B2]"
              />
              <button
                type="submit"
                className="bg-[#0891B2] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#0e7490] transition-colors"
              >
                Search
              </button>
              {query && (
                <a
                  href="/admin/drugs"
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </a>
              )}
            </div>
          </form>

          {/* Drugs table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    <th className="px-4 py-3">Drug</th>
                    <th className="px-4 py-3">Strength</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Prices</th>
                    <th className="px-4 py-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(drugs ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-10">
                        No drugs found.
                      </td>
                    </tr>
                  ) : (
                    (drugs ?? []).map((drug) => (
                      <tr key={drug.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#1a1a2e]">{drug.brand_name}</p>
                          <p className="text-gray-400 text-xs">{drug.generic_name}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{drug.strength}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              drug.is_generic
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {drug.is_generic ? "Generic" : "Brand"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm">
                          {priceCountMap[drug.id] ?? 0} pharmacies
                        </td>
                        <td className="px-4 py-3 text-right">
                          <form action={deleteDrug}>
                            <input type="hidden" name="drug_id" value={drug.id} />
                            <ConfirmButton
                              message={`Delete ${drug.brand_name}? This permanently removes all associated prices.`}
                              className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors"
                            >
                              Delete
                            </ConfirmButton>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Add drug form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
            <h2 className="font-bold text-[#1a1a2e] mb-5">Add New Drug</h2>
            <form action={addDrug} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Brand Name *</label>
                <input
                  name="brand_name"
                  required
                  placeholder="e.g. Tylenol"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Generic Name *</label>
                <input
                  name="generic_name"
                  required
                  placeholder="e.g. Acetaminophen"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Strength *</label>
                <input
                  name="strength"
                  required
                  placeholder="e.g. 500mg"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Dosage Form</label>
                <select
                  name="dosage_form"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                >
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="liquid">Liquid</option>
                  <option value="topical">Topical</option>
                  <option value="patch">Patch</option>
                  <option value="inhaler">Inhaler</option>
                  <option value="injection">Injection</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Drug Class</label>
                <input
                  name="drug_class"
                  placeholder="e.g. Analgesic"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
                <select
                  name="is_generic"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                >
                  <option value="false">Brand drug</option>
                  <option value="true">Generic drug</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0891B2] hover:bg-[#0e7490] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2"
              >
                + Add Drug
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
