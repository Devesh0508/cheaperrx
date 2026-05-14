import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  const navLinks = [
    { href: "/admin", label: "Overview", icon: "📊" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/drugs", label: "Drugs", icon: "💊" },
    { href: "/admin/pharmacies", label: "Pharmacies", icon: "🏪" },
    { href: "/admin/submissions", label: "Submissions", icon: "📬" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#1a1a2e] text-white flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="text-xl font-bold text-white hover:text-[#38bdf8] transition-colors">
            CheaperRx
          </Link>
          <p className="text-xs text-white/50 mt-1 font-medium uppercase tracking-widest">Admin</p>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <span className="text-base" aria-hidden="true">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <Link
            href="/search"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-medium"
          >
            ← Back to app
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
