import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { MobileMenu } from "@/components/layout/MobileMenu";

export async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  let isAdmin = false;
  let isPro = false;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role, subscription_status")
      .eq("id", user.id)
      .single();
    profile = data;
    isAdmin =
      profile?.role === "admin" || user.email === process.env.ADMIN_EMAIL;
    isPro =
      isAdmin ||
      profile?.role === "pro" ||
      profile?.subscription_status === "active";
  }

  const firstName = profile?.full_name?.split(" ")[0] || null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0891B2] rounded-lg"
          aria-label="CheaperRx home"
        >
          <span className="text-2xl" aria-hidden="true">💊</span>
          <span className="text-xl font-bold text-[#1a1a2e]">CheaperRx</span>
        </Link>

        {/* Nav links — desktop only */}
        <div className="hidden md:flex items-center gap-5 text-base font-medium">
          {/* Always visible */}
          <Link href="/pharmacies" className="text-gray-600 hover:text-[#0891B2] transition-colors">
            Pharmacies
          </Link>
          {/* Pro-only */}
          {user && isPro && (
            <>
              <Link href="/medications" className="text-gray-600 hover:text-[#0891B2] transition-colors">
                My Meds
              </Link>
              <Link href="/family" className="text-gray-600 hover:text-[#0891B2] transition-colors">
                Family
              </Link>
              <Link href="/alerts" className="text-gray-600 hover:text-[#0891B2] transition-colors">
                Alerts
              </Link>
              <Link href="/insurance" className="text-gray-600 hover:text-[#0891B2] transition-colors">
                Insurance
              </Link>
            </>
          )}
        </div>

        {/* Right side — desktop */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <span className="hidden sm:inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-800">
              Admin
            </span>
          )}

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:block text-[#1a1a2e] font-medium hover:text-[#0891B2] transition-colors text-base"
              >
                {firstName ? `Hi, ${firstName}` : "My Account"}
              </Link>
              <Link
                href="/settings"
                className="hidden sm:block text-gray-500 hover:text-[#1a1a2e] transition-colors text-base"
                aria-label="Account settings"
              >
                ⚙️
              </Link>
              <form action={signOut} className="hidden sm:block">
                <button
                  type="submit"
                  className="text-gray-500 hover:text-[#1a1a2e] transition-colors text-base min-h-0"
                >
                  Sign out
                </button>
              </form>

              {/* Mobile: hamburger */}
              <MobileMenu
                firstName={firstName}
                isPro={isPro}
                isAdmin={isAdmin}
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#1a1a2e] font-medium hover:text-[#0891B2] transition-colors text-base"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-[#0891B2] text-white font-semibold rounded-lg px-4 py-2 text-base hover:bg-[#0e7490] transition-colors"
              >
                Sign up free
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
