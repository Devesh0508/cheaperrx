import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin Dashboard — CheaperRx" };

export default async function AdminPage() {
  await requireAdmin();
  const supabase = createClient();

  const [usersResult, submissionsResult, drugsResult, pharmaciesResult] =
    await Promise.all([
      supabase.from("profiles").select("id, email, full_name, role, subscription_status, created_at").order("created_at", { ascending: false }).limit(20),
      supabase.from("price_submissions").select(`
        id, price_paid, verified, submitted_at,
        drug:drugs(brand_name, strength),
        pharmacy:pharmacies(name, city)
      `).eq("verified", false).order("submitted_at", { ascending: false }).limit(20),
      supabase.from("drugs").select("id", { count: "exact", head: true }),
      supabase.from("pharmacies").select("id", { count: "exact", head: true }),
    ]);

  const users = usersResult.data ?? [];
  const pendingSubmissions = (submissionsResult.data ?? []) as unknown as Array<{
    id: string;
    price_paid: number;
    verified: boolean;
    submitted_at: string;
    drug: { brand_name: string; strength: string } | null;
    pharmacy: { name: string; city: string } | null;
  }>;

  const totalUsers = users.length;
  const proUsers = users.filter((u) => u.role === "pro" || u.subscription_status === "active").length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">

          <div>
            <h1 className="text-3xl font-bold text-[#1a1a2e]">Admin Dashboard</h1>
            <p className="text-gray-500 text-lg mt-1">Server-side admin access only.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total users", value: totalUsers },
              { label: "Pro users", value: proUsers },
              { label: "Total drugs", value: drugsResult.count ?? 0 },
              { label: "Pharmacies", value: pharmaciesResult.count ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} className="card text-center">
                <p className="text-4xl font-bold text-[#0891B2]">{value}</p>
                <p className="text-gray-500 text-base mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Pending price submissions */}
          <div className="card">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">
              Pending Price Submissions ({pendingSubmissions.length})
            </h2>
            {pendingSubmissions.length === 0 ? (
              <p className="text-gray-500 text-lg">No pending submissions. 🎉</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="pb-3 pr-4">Drug</th>
                      <th className="pb-3 pr-4">Pharmacy</th>
                      <th className="pb-3 pr-4">Price Paid</th>
                      <th className="pb-3 pr-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pendingSubmissions.map((sub) => (
                      <tr key={sub.id} className="py-3">
                        <td className="py-3 pr-4 font-medium text-[#1a1a2e]">
                          {sub.drug?.brand_name} {sub.drug?.strength}
                        </td>
                        <td className="py-3 pr-4 text-gray-600">
                          {sub.pharmacy?.name}, {sub.pharmacy?.city}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-[#16A34A]">
                          ${Number(sub.price_paid).toFixed(2)}
                        </td>
                        <td className="py-3 pr-4 text-gray-400">
                          {new Date(sub.submitted_at).toLocaleDateString("en-CA")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent users */}
          <div className="card">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">
              Recent Users (last 20)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3 pr-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 pr-4 font-medium text-[#1a1a2e] truncate max-w-[200px]">
                        {u.email}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{u.full_name || "—"}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === "admin"
                              ? "bg-amber-100 text-amber-800"
                              : u.role === "pro" || u.subscription_status === "active"
                              ? "bg-blue-100 text-[#0891B2]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {u.role === "admin" ? "Admin" : u.role === "pro" ? "Pro" : "Free"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-400">
                        {new Date(u.created_at).toLocaleDateString("en-CA")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
