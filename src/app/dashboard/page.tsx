import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBox } from "@/components/search/SearchBox";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard — CheaperRx" };

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const pro =
    profile?.role === "pro" ||
    profile?.role === "admin" ||
    profile?.subscription_status === "active" ||
    user.email === process.env.ADMIN_EMAIL;

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  // Fetch pro data concurrently
  const [medsResult, alertsResult] = await Promise.all([
    pro
      ? supabase
          .from("saved_medications")
          .select("id, family_member, drug:drugs(id, brand_name, strength)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [] }),
    pro
      ? supabase
          .from("price_alerts")
          .select("id, target_price, drug:drugs(brand_name, strength)")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(3)
      : Promise.resolve({ data: [] }),
  ]);

  const savedMeds = (medsResult.data ?? []) as unknown as Array<{
    id: string;
    family_member: string;
    drug: { id: string; brand_name: string; strength: string } | null;
  }>;

  const alerts = (alertsResult.data ?? []) as unknown as Array<{
    id: string;
    target_price: number;
    drug: { brand_name: string; strength: string } | null;
  }>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* ── Greeting ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-[#1a1a2e]">
                Welcome back, {firstName}! 👋
              </h1>
              <p className="text-gray-500 text-lg mt-1">
                {pro
                  ? "You're on Pro — all pharmacy prices are visible."
                  : "Search any medication below. No account needed."}
              </p>
            </div>
            {pro && (
              <div className="inline-flex items-center gap-2 bg-[#0891B2] text-white rounded-full px-4 py-2 text-base font-semibold self-start sm:self-auto">
                ✓ Pro Member
              </div>
            )}
          </div>

          {/* ── Quick search ── */}
          <div className="card">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Search Medication Prices</h2>
            <SearchBox size="compact" placeholder="Search a medication..." />
          </div>

          {/* ── Free user upgrade CTA ── */}
          {!pro && (
            <div className="bg-gradient-to-br from-[#0891B2] to-[#0e7490] rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Unlock All Pharmacies</h2>
              <p className="text-blue-100 text-lg mb-6">
                You're seeing 3 of 8 pharmacies. Upgrade to Pro to see all prices, save medications,
                and get notified when prices drop — for just $7.99/month.
              </p>
              <Link
                href="/upgrade"
                className="inline-block bg-white text-[#0891B2] font-bold rounded-xl px-7 py-3 text-lg hover:bg-blue-50 transition-colors"
              >
                Start 7-day free trial →
              </Link>
              <p className="text-blue-200 text-sm mt-4">✓ No credit card required · ✓ Cancel anytime</p>
            </div>
          )}

          {/* ── Pro: saved medications ── */}
          {pro && (
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#1a1a2e]">My Medications</h2>
                <Link href="/medications" className="text-[#0891B2] font-semibold hover:underline">
                  Manage all →
                </Link>
              </div>
              {savedMeds.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3" aria-hidden="true">💊</p>
                  <p className="text-gray-500 text-lg mb-4">No medications saved yet.</p>
                  <Link href="/search" className="btn-primary inline-block">
                    Search a medication →
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {savedMeds.map((med) => (
                    <li
                      key={med.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <span className="font-semibold text-[#1a1a2e] text-lg">
                          {med.drug?.brand_name} {med.drug?.strength}
                        </span>
                        {med.family_member !== "You" && (
                          <span className="ml-2 text-sm bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
                            {med.family_member}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/search?q=${encodeURIComponent(med.drug?.brand_name ?? "")}`}
                        className="text-[#0891B2] font-semibold hover:underline text-sm"
                      >
                        Check prices →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ── Pro: price alerts ── */}
          {pro && (
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#1a1a2e]">Price Alerts</h2>
                <Link href="/alerts" className="text-[#0891B2] font-semibold hover:underline">
                  Manage all →
                </Link>
              </div>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3" aria-hidden="true">🔔</p>
                  <p className="text-gray-500 text-lg mb-4">No active price alerts.</p>
                  <Link href="/alerts" className="btn-primary inline-block">
                    Set an alert →
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {alerts.map((alert) => (
                    <li
                      key={alert.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <span className="font-semibold text-[#1a1a2e] text-lg">
                          {alert.drug?.brand_name} {alert.drug?.strength}
                        </span>
                        <p className="text-gray-400 text-sm">
                          Alert when price drops below ${Number(alert.target_price).toFixed(2)}
                        </p>
                      </div>
                      <span className="text-[#16A34A] text-sm font-semibold">● Active</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ── Quick nav grid ── */}
          <div className={`grid gap-4 ${pro ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
            {pro ? (
              <>
                {[
                  { href: "/medications", icon: "💊", label: "My Medications" },
                  { href: "/family", icon: "👨‍👩‍👧", label: "Family" },
                  { href: "/alerts", icon: "🔔", label: "Price Alerts" },
                  { href: "/settings", icon: "⚙️", label: "Settings" },
                ].map(({ href, icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="card text-center hover:border-[#0891B2] hover:shadow-md transition-all"
                  >
                    <span className="text-3xl block mb-2" aria-hidden="true">{icon}</span>
                    <span className="font-semibold text-[#1a1a2e]">{label}</span>
                  </Link>
                ))}
              </>
            ) : (
              <>
                {[
                  { href: "/settings", icon: "⚙️", label: "Settings" },
                  { href: "/upgrade", icon: "⭐", label: "Go Pro" },
                ].map(({ href, icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="card text-center hover:border-[#0891B2] hover:shadow-md transition-all"
                  >
                    <span className="text-3xl block mb-2" aria-hidden="true">{icon}</span>
                    <span className="font-semibold text-[#1a1a2e]">{label}</span>
                  </Link>
                ))}
              </>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
