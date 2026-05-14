import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { approveSubmission, rejectSubmission } from "@/lib/actions/admin";

export const metadata = { title: "Submissions — Admin" };

export default async function AdminSubmissionsPage() {
  await requireAdmin();
  const supabase = createClient();

  const { data: pending = [] } = await supabase
    .from("price_submissions")
    .select(`
      id, price_paid, verified, submitted_at,
      drug:drugs(brand_name, generic_name, strength),
      pharmacy:pharmacies(name, city),
      submitter:profiles(email)
    `)
    .eq("verified", false)
    .order("submitted_at", { ascending: false })
    .limit(50);

  const { data: recent = [] } = await supabase
    .from("price_submissions")
    .select(`
      id, price_paid, verified, submitted_at,
      drug:drugs(brand_name, strength),
      pharmacy:pharmacies(name, city)
    `)
    .eq("verified", true)
    .order("submitted_at", { ascending: false })
    .limit(10);

  type Sub = {
    id: string;
    price_paid: number;
    verified: boolean;
    submitted_at: string;
    drug: { brand_name: string; generic_name?: string; strength: string } | null;
    pharmacy: { name: string; city: string } | null;
    submitter?: { email: string } | null;
  };

  const pendingSubs = (pending ?? []) as unknown as Sub[];
  const recentSubs = (recent ?? []) as unknown as Sub[];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Price Submissions</h1>
        <p className="text-gray-500 mt-1">
          {pendingSubs.length} pending review
        </p>
      </div>

      {/* Pending submissions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 bg-red-50 flex items-center gap-2">
          <span className="text-red-500 font-bold text-sm">●</span>
          <h2 className="font-bold text-[#1a1a2e]">Pending ({pendingSubs.length})</h2>
        </div>

        {pendingSubs.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            🎉 No pending submissions. You&apos;re all caught up!
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {pendingSubs.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a1a2e]">
                    {sub.drug?.brand_name} {sub.drug?.strength}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {sub.pharmacy?.name}, {sub.pharmacy?.city}
                  </p>
                  {sub.submitter && (
                    <p className="text-gray-400 text-xs mt-0.5">{sub.submitter.email}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-[#16A34A]">
                    ${Number(sub.price_paid).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(sub.submitted_at).toLocaleDateString("en-CA")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={approveSubmission}>
                    <input type="hidden" name="submission_id" value={sub.id} />
                    <button
                      type="submit"
                      className="bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      ✓ Approve
                    </button>
                  </form>
                  <form action={rejectSubmission}>
                    <input type="hidden" name="submission_id" value={sub.id} />
                    <button
                      type="submit"
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      ✕ Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently approved */}
      {recentSubs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#1a1a2e]">Recently Approved</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentSubs.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between px-6 py-3 text-sm">
                <span className="text-[#1a1a2e] font-medium">
                  {sub.drug?.brand_name} {sub.drug?.strength} — {sub.pharmacy?.name}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[#16A34A] font-semibold">
                    ${Number(sub.price_paid).toFixed(2)}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(sub.submitted_at).toLocaleDateString("en-CA")}
                  </span>
                  <span className="text-green-600 text-xs font-semibold">✓ Approved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
