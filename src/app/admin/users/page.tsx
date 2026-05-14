import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { grantPro, revokePro, makeAdmin } from "@/lib/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const metadata = { title: "Users — Admin" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  await requireAdmin();
  const supabase = createClient();
  const query = (searchParams.q ?? "").trim().toLowerCase();

  let usersQuery = supabase
    .from("profiles")
    .select("id, email, full_name, role, subscription_status, stripe_subscription_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (query) {
    usersQuery = usersQuery.ilike("email", `%${query}%`);
  }

  const { data: users = [] } = await usersQuery;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Users</h1>
          <p className="text-gray-500 mt-1">{users?.length ?? 0} users shown</p>
        </div>
      </div>

      {/* Search */}
      <form method="GET" className="mb-6">
        <div className="flex gap-2 max-w-md">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by email…"
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
              href="/admin/users"
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Clear
            </a>
          )}
        </div>
      </form>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-left text-gray-500 text-xs font-semibold uppercase tracking-wide">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Subscription</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(users ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-12">
                    No users found.
                  </td>
                </tr>
              ) : (
                (users ?? []).map((u) => {
                  const isPro = u.role === "pro" || u.subscription_status === "active";
                  const isAdminRole = u.role === "admin";
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#1a1a2e]">{u.email}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{u.full_name || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isAdminRole
                              ? "bg-amber-100 text-amber-800"
                              : isPro
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isAdminRole ? "Admin" : isPro ? "Pro" : "Free"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {u.subscription_status || "—"}
                        {u.stripe_subscription_id && (
                          <p className="text-xs text-gray-300 font-mono truncate max-w-[120px]">
                            {u.stripe_subscription_id.slice(0, 14)}…
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(u.created_at).toLocaleDateString("en-CA")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {!isAdminRole && !isPro && (
                            <form action={grantPro}>
                              <input type="hidden" name="user_id" value={u.id} />
                              <button
                                type="submit"
                                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Grant Pro
                              </button>
                            </form>
                          )}
                          {isPro && !isAdminRole && (
                            <form action={revokePro}>
                              <input type="hidden" name="user_id" value={u.id} />
                              <button
                                type="submit"
                                className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Revoke Pro
                              </button>
                            </form>
                          )}
                          {!isAdminRole && (
                            <form action={makeAdmin}>
                              <input type="hidden" name="user_id" value={u.id} />
                              <ConfirmButton
                                message={`Make ${u.email} an admin? This gives full backend access.`}
                                className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Make Admin
                              </ConfirmButton>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
