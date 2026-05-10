import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/actions/profile";
import { resetPassword } from "@/lib/actions/auth";

export const metadata = { title: "Settings — CheaperRx" };

const CA_PROVINCES = [
  ["AB", "Alberta"],
  ["BC", "British Columbia"],
  ["MB", "Manitoba"],
  ["NB", "New Brunswick"],
  ["NL", "Newfoundland & Labrador"],
  ["NS", "Nova Scotia"],
  ["NT", "Northwest Territories"],
  ["NU", "Nunavut"],
  ["ON", "Ontario"],
  ["PE", "Prince Edward Island"],
  ["QC", "Quebec"],
  ["SK", "Saskatchewan"],
  ["YT", "Yukon"],
];

interface SettingsPageProps {
  searchParams: { saved?: string };
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const user = await requireAuth();
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-2xl mx-auto space-y-8">

          <h1 className="text-3xl font-bold text-[#1a1a2e]">Account Settings</h1>

          {/* Success banner */}
          {searchParams.saved && (
            <div
              className="bg-green-50 border border-green-200 text-[#16A34A] rounded-xl px-5 py-4 text-lg font-medium"
              role="alert"
            >
              ✓ Settings saved successfully!
            </div>
          )}

          {/* Profile form */}
          <div className="card">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Profile</h2>
            <form action={updateProfile} className="space-y-5">
              <div>
                <label htmlFor="full_name" className="block text-lg font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  defaultValue={profile?.full_name ?? ""}
                  placeholder="Your full name"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-lg font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={profile?.city ?? ""}
                  placeholder="e.g. Calgary"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label htmlFor="province" className="block text-lg font-medium text-gray-700 mb-1">
                  Province
                </label>
                <select
                  id="province"
                  name="province"
                  defaultValue={profile?.province ?? "AB"}
                  className="input-field w-full"
                >
                  {CA_PROVINCES.map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>

          {/* Account info */}
          <div className="card">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Account</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Email address</p>
                <p className="text-[#1a1a2e] text-lg font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Account type</p>
                <p className="text-[#1a1a2e] text-lg font-medium capitalize">
                  {profile?.role === "admin"
                    ? "Administrator"
                    : profile?.role === "pro"
                    ? "Pro"
                    : "Free"}
                </p>
              </div>
            </div>
          </div>

          {/* Password reset */}
          <div className="card">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Password</h2>
            <p className="text-gray-500 text-lg mb-4">
              We&apos;ll send a password reset link to <strong>{user.email}</strong>.
            </p>
            <form action={resetPassword}>
              <input type="hidden" name="email" value={user.email ?? ""} />
              <button type="submit" className="btn-outline">
                Send password reset email
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
