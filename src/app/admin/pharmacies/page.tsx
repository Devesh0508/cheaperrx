import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { addPharmacy, deletePharmacy } from "@/lib/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const metadata = { title: "Pharmacies — Admin" };

export default async function AdminPharmaciesPage() {
  await requireAdmin();
  const supabase = createClient();

  const { data: pharmacies = [] } = await supabase
    .from("pharmacies")
    .select("*")
    .order("city", { ascending: true })
    .order("name", { ascending: true });

  // Price counts per pharmacy
  const { data: priceCounts = [] } = await supabase
    .from("prices")
    .select("pharmacy_id")
    .eq("verified", true);

  const countMap: Record<string, number> = {};
  (priceCounts ?? []).forEach((p) => {
    countMap[p.pharmacy_id] = (countMap[p.pharmacy_id] || 0) + 1;
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Pharmacies</h1>
        <p className="text-gray-500 mt-1">{(pharmacies ?? []).length} pharmacies in database</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pharmacy list */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    <th className="px-4 py-3">Pharmacy</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Features</th>
                    <th className="px-4 py-3">Prices</th>
                    <th className="px-4 py-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(pharmacies ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-10">
                        No pharmacies yet.
                      </td>
                    </tr>
                  ) : (
                    (pharmacies ?? []).map((ph) => (
                      <tr key={ph.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#1a1a2e]">{ph.name}</p>
                          {ph.chain && (
                            <p className="text-gray-400 text-xs">{ph.chain}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <p>{ph.city}, {ph.province}</p>
                          <p className="text-xs text-gray-300 truncate max-w-[140px]">{ph.address}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {ph.has_delivery && (
                              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                Delivery
                              </span>
                            )}
                            {ph.accepts_alberta_blue_cross && (
                              <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                                ABC
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm">
                          {countMap[ph.id] ?? 0} drugs
                        </td>
                        <td className="px-4 py-3 text-right">
                          <form action={deletePharmacy}>
                            <input type="hidden" name="pharmacy_id" value={ph.id} />
                            <ConfirmButton
                              message={`Delete ${ph.name}? This permanently removes all associated prices.`}
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

        {/* Right: Add pharmacy form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
            <h2 className="font-bold text-[#1a1a2e] mb-5">Add New Pharmacy</h2>
            <form action={addPharmacy} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name *</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Shoppers Drug Mart"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Chain</label>
                <input
                  name="chain"
                  placeholder="e.g. Shoppers"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address *</label>
                <input
                  name="address"
                  required
                  placeholder="123 Main St SW"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
                  <input
                    name="city"
                    defaultValue="Calgary"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Province</label>
                  <input
                    name="province"
                    defaultValue="AB"
                    maxLength={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
                <input
                  name="phone"
                  placeholder="(403) 555-0100"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Delivery</label>
                <select
                  name="has_delivery"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                >
                  <option value="false">No delivery</option>
                  <option value="true">Has delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Delivery Fee ($)</label>
                <input
                  name="delivery_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0891B2]"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" name="accepts_abc" value="true" className="rounded" />
                  Alberta Blue Cross
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" name="accepts_odb" value="true" className="rounded" />
                  ODB
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0891B2] hover:bg-[#0e7490] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-1"
              >
                + Add Pharmacy
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
