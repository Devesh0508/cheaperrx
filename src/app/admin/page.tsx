import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin — CheaperRx" };

export default async function AdminOverviewPage() {
  await requireAdmin();
  const supabase = createClient();

  const [
    usersResult,
    proUsersResult,
    drugsResult,
    pharmaciesResult,
    pricesResult,
    pendingResult,
    recentUsersResult,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "pro"),
    supabase.from("drugs").select("id", { count: "exact", head: true }),
    supabase.from("pharmacies").select("id", { count: "exact", head: true }),
    supabase.from("prices").select("id", { count: "exact", head: true }),
    supabase.from("price_submissions").select("id", { count: "exact", head: true }).eq("verified", false),
    supabase
      .from("profiles")
      .select("id, email, full_name, role, subscription_status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const totalUsers = usersResult.count ?? 0;
  const proUsers = proUsersResult.count ?? 0;
  const totalDrugs = drugsResult.count ?? 0;
  const totalPharmacies = pharmaciesResult.count ?? 0;
  const totalPrices = pricesResult.count ?? 0;
  const pendingSubmissions = pendingResult.count ?? 0;
  const recentUsers = recentUsersResult.data ?? [];

  const stats = [
    { label: "Total Users", value: totalUsers, icon: "👥", href: "/admin/users", color: "text-blue-600" },
    { label: "Pro Users", value: proUsers, icon: "⭐", href: "/admin/users", color: "text-amber-600" },
    { label: "Total Drugs", value: totalDrugs, icon: "💊", href: "/admin/drugs", color: "text-green-600" },
    { label: "Pharmacies", value: totalPharmacies, icon: "🏪", href: "/admin/pharmacies", color: "text-purple-600" },
    { label: "Price Records", value: totalPrices, icon: "💲", href: "/admin/drugs", color: "text-teal-600" },
    { label: "Pending Submissions", value: pendingSubmissions, icon: "📬", href: "/admin/submissions", color: pendingSubmissions > 0 ? "text-red-600" : "text-gray-400" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Admin Overview</h1>
        <p className="text-gray-500 mt-1">Your CheaperRx database at a glance.</p>
      </div>

      {/* Stripe setup warning if keys missing */}
      {!process.env.STRIPE_SECRET_KEY && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 mb-8">
          <p className="font-semibold text-amber-800 text-base mb-1">⚠️ Stripe is not configured</p>
          <p className="text-amber-700 text-sm">
            Add <code className="bg-amber-100 px-1 rounded">STRIPE_SECRET_KEY</code>,{" "}
            <code className="bg-amber-100 px-1 rounded">STRIPE_PRICE_ID</code>,{" "}
            <code className="bg-amber-100 px-1 rounded">STRIPE_WEBHOOK_SECRET</code>, and{" "}
            <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>{" "}
            to <code className="bg-amber-100 px-1 rounded">.env.local</code> to enable the Pro checkout flow.
            Until then, use the Users page to manually grant Pro access.
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#0891B2] hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl" aria-hidden="true">{icon}</span>
              {label === "Pending Submissions" && value > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  Action needed
                </span>
              )}
            </div>
            <p className={`text-3xl font-bold mt-3 ${color}`}>{value.toLocaleString()}</p>
            <p className="text-gray-500 text-sm mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { href: "/admin/users", label: "Grant Pro Access", icon: "⭐" },
          { href: "/admin/submissions", label: "Review Submissions", icon: "📬" },
          { href: "/admin/drugs", label: "Add Drug", icon: "💊" },
          { href: "/admin/pharmacies", label: "Add Pharmacy", icon: "🏪" },
        ].map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="bg-[#0891B2] hover:bg-[#0e7490] text-white rounded-xl px-4 py-3 text-sm font-semibold text-center transition-colors flex items-center justify-center gap-2"
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* Recent users */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1a1a2e]">Recent Sign-ups</h2>
          <Link href="/admin/users" className="text-[#0891B2] text-sm font-semibold hover:underline">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentUsers.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No users yet.</p>
          ) : (
            recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {(u.full_name || u.email || "?")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1a1a2e] truncate">{u.email}</p>
                    <p className="text-xs text-gray-400">{u.full_name || "No name"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      u.role === "admin"
                        ? "bg-amber-100 text-amber-800"
                        : u.role === "pro" || u.subscription_status === "active"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {u.role === "admin" ? "Admin" : u.role === "pro" ? "Pro" : "Free"}
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(u.created_at).toLocaleDateString("en-CA")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
