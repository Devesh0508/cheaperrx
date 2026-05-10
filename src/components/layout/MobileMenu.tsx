"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth";

interface MobileMenuProps {
  firstName: string | null;
  isPro: boolean;
  isAdmin: boolean;
}

export function MobileMenu({ firstName, isPro, isAdmin }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-lg text-gray-600 hover:text-[#1a1a2e] hover:bg-gray-100 transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span className="text-2xl" aria-hidden="true">
          {open ? "✕" : "☰"}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-16 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex-1 overflow-y-auto py-6 px-5 space-y-1">
          <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            {firstName ? `Hi, ${firstName}` : "My Account"}
          </div>

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors text-lg"
          >
            🏠 Dashboard
          </Link>
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors text-lg"
          >
            🔍 Search Prices
          </Link>

          {isPro && (
            <>
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-5 mb-2 px-2">
                Pro Features
              </div>
              <Link
                href="/medications"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors text-lg"
              >
                💊 My Medications
              </Link>
              <Link
                href="/family"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors text-lg"
              >
                👨‍👩‍👧 Family
              </Link>
              <Link
                href="/alerts"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors text-lg"
              >
                🔔 Price Alerts
              </Link>
              <Link
                href="/insurance"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors text-lg"
              >
                🏥 Insurance Checker
              </Link>
            </>
          )}

          {!isPro && (
            <Link
              href="/upgrade"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#0891B2] text-white font-semibold hover:bg-[#0e7490] transition-colors text-lg mt-4"
            >
              ⭐ Upgrade to Pro
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-amber-700 font-medium hover:bg-amber-50 transition-colors text-lg mt-2"
            >
              🛡️ Admin Dashboard
            </Link>
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-4 space-y-2">
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-base"
          >
            ⚙️ Settings
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 font-medium hover:bg-gray-50 transition-colors text-base"
            >
              → Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
