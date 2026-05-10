import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { removeMedication } from "@/lib/actions/medications";

export const metadata = { title: "Family Medications — CheaperRx" };

export default async function FamilyPage() {
  const user = await requireAuth();
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, subscription_status")
    .eq("id", user.id)
    .single();

  const pro =
    profile?.role === "pro" ||
    profile?.role === "admin" ||
    profile?.subscription_status === "active" ||
    user.email === process.env.ADMIN_EMAIL;

  if (!pro) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-6xl mb-6" aria-hidden="true">🔒</p>
            <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3">Family Manager is a Pro feature</h1>
            <p className="text-xl text-gray-500 mb-8">
              Track medications for your spouse, parents, and children — all in one place.
            </p>
            <Link href="/upgrade" className="btn-green inline-block">
              Upgrade to Pro — $7.99/month →
            </Link>
            <p className="text-gray-400 text-lg mt-4">✓ 7-day free trial · ✓ Cancel anytime</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { data: meds } = await supabase
    .from("saved_medications")
    .select(`
      id,
      family_member,
      nickname,
      refill_day,
      drug:drugs(id, brand_name, generic_name, strength)
    `)
    .eq("user_id", user.id)
    .order("family_member", { ascending: true })
    .order("created_at", { ascending: false });

  const medications = (meds ?? []) as unknown as Array<{
    id: string;
    family_member: string;
    nickname: string | null;
    refill_day: number | null;
    drug: { id: string; brand_name: string; generic_name: string; strength: string } | null;
  }>;

  // Exclude "You" — that's shown on /medications
  const familyMeds = medications.filter((m) => m.family_member !== "You");

  // Group by family member
  const grouped = familyMeds.reduce<Record<string, typeof familyMeds>>((acc, med) => {
    const key = med.family_member;
    if (!acc[key]) acc[key] = [];
    acc[key].push(med);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1a1a2e]">Family Medications</h1>
              <p className="text-gray-500 text-lg mt-1">
                Track prescriptions for your family members.
              </p>
            </div>
            <Link href="/search" className="btn-primary">
              + Add medication
            </Link>
          </div>

          {familyMeds.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-5xl mb-4" aria-hidden="true">👨‍👩‍👧</p>
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">No family medications saved</h2>
              <p className="text-gray-500 text-lg mb-6">
                Search for a medication and choose &ldquo;Save for a family member&rdquo; when saving.
              </p>
              <Link href="/search" className="btn-primary inline-block">
                Search medications →
              </Link>
            </div>
          ) : (
            Object.entries(grouped).map(([member, meds]) => (
              <div key={member} className="card">
                <h2 className="text-xl font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                  <span aria-hidden="true">👤</span>
                  {member}
                </h2>
                <ul className="space-y-3">
                  {meds.map((med) => (
                    <li
                      key={med.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1a1a2e] text-lg truncate">
                          {med.nickname || med.drug?.brand_name} {med.drug?.strength}
                        </p>
                        {med.refill_day && (
                          <p className="text-gray-400 text-sm">
                            🗓 Refill day {med.refill_day} of the month
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Link
                          href={`/search?q=${encodeURIComponent(med.drug?.brand_name ?? "")}`}
                          className="text-[#0891B2] font-semibold hover:underline text-sm"
                        >
                          Prices →
                        </Link>
                        <form action={removeMedication}>
                          <input type="hidden" name="id" value={med.id} />
                          <button
                            type="submit"
                            className="text-red-400 hover:text-red-600 text-sm font-semibold"
                            aria-label={`Remove ${med.drug?.brand_name} for ${member}`}
                          >
                            Remove
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
