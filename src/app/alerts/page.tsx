import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAlert, deleteAlert } from "@/lib/actions/alerts";

export const metadata = { title: "Price Alerts — CheaperRx" };

export default async function AlertsPage() {
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
            <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3">Price Alerts is a Pro feature</h1>
            <p className="text-xl text-gray-500 mb-8">
              Get emailed the moment a medication drops below your target price at any pharmacy near you.
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

  const { data: alerts } = await supabase
    .from("price_alerts")
    .select(`
      id,
      target_price,
      is_active,
      last_triggered,
      created_at,
      drug:drugs(id, brand_name, generic_name, strength)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const priceAlerts = (alerts ?? []) as unknown as Array<{
    id: string;
    target_price: number;
    is_active: boolean;
    last_triggered: string | null;
    created_at: string;
    drug: { id: string; brand_name: string; generic_name: string; strength: string } | null;
  }>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-8">

          <div>
            <h1 className="text-3xl font-bold text-[#1a1a2e]">Price Alerts</h1>
            <p className="text-gray-500 text-lg mt-1">
              Get emailed when a medication drops below your target price.
            </p>
          </div>

          {/* Add alert form */}
          <div className="card">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">Add a new alert</h2>
            <form action={createAlert} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="drug_name" className="sr-only">Medication name</label>
                <input
                  id="drug_name"
                  name="drug_name"
                  type="text"
                  required
                  placeholder="Medication name (e.g. Lipitor)"
                  className="input-field w-full"
                  aria-label="Medication name"
                />
              </div>
              <div className="w-full sm:w-40">
                <label htmlFor="target_price" className="sr-only">Target price in CAD</label>
                <input
                  id="target_price"
                  name="target_price"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="$ target price"
                  className="input-field w-full"
                  aria-label="Target price in CAD"
                />
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                Set alert
              </button>
            </form>
            <p className="text-gray-400 text-sm mt-3">
              We&apos;ll email you at <strong>{user.email}</strong> when the price drops below your target.
            </p>
          </div>

          {/* Alert list */}
          {priceAlerts.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-4xl mb-3" aria-hidden="true">🔔</p>
              <p className="text-gray-500 text-lg">No price alerts yet. Add one above.</p>
            </div>
          ) : (
            <div className="card">
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">
                Your alerts ({priceAlerts.length})
              </h2>
              <ul className="space-y-3">
                {priceAlerts.map((alert) => (
                  <li
                    key={alert.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1a1a2e] text-lg">
                        {alert.drug?.brand_name} {alert.drug?.strength}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Alert below{" "}
                        <strong className="text-[#16A34A]">
                          ${Number(alert.target_price).toFixed(2)}
                        </strong>
                        {alert.last_triggered && (
                          <> · Last triggered {new Date(alert.last_triggered).toLocaleDateString("en-CA")}</>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span
                        className={`text-sm font-semibold ${
                          alert.is_active ? "text-[#16A34A]" : "text-gray-400"
                        }`}
                      >
                        {alert.is_active ? "● Active" : "○ Paused"}
                      </span>
                      <form action={deleteAlert}>
                        <input type="hidden" name="id" value={alert.id} />
                        <button
                          type="submit"
                          className="text-red-400 hover:text-red-600 text-sm font-semibold"
                          aria-label={`Delete alert for ${alert.drug?.brand_name}`}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
