import Link from "next/link";
import type { PharmacyResult } from "@/lib/mock-data";

interface LockedResultsProps {
  hiddenResults: PharmacyResult[];
}

export function LockedResults({ hiddenResults }: LockedResultsProps) {
  const count = hiddenResults.length;
  if (count === 0) return null;

  const lowestHidden = Math.min(...hiddenResults.map((r) => r.price));

  return (
    <div className="relative mt-2">
      {/* Blurred preview cards */}
      <div className="space-y-4 select-none" aria-hidden="true">
        {hiddenResults.slice(0, 2).map((r) => (
          <div
            key={r.pharmacy_id}
            className="rounded-2xl border-2 border-gray-200 p-6 bg-white blur-sm opacity-60 pointer-events-none"
          >
            <div className="h-6 bg-gray-200 rounded w-48 mb-3" />
            <div className="h-10 bg-gray-200 rounded w-24 mb-3" />
            <div className="h-5 bg-gray-100 rounded w-64" />
          </div>
        ))}
      </div>

      {/* Overlay unlock card */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border-2 border-[#0891B2] shadow-xl p-8 text-center max-w-md w-full">
          <p className="text-4xl mb-3" aria-hidden="true">🔒</p>
          <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">
            {count} more {count === 1 ? "pharmacy" : "pharmacies"} found nearby
          </h3>
          {lowestHidden < hiddenResults[0]?.price && (
            <p className="text-[#16A34A] font-semibold text-xl mb-3">
              One might be even cheaper than what you see above!
            </p>
          )}
          <p className="text-gray-500 text-xl mb-6">
            Unlock all results for just $7.99/month.
          </p>
          <Link
            href="/upgrade"
            className="btn-green w-full text-center block"
            aria-label="Upgrade to Pro to see all pharmacy prices"
          >
            See All Prices →
          </Link>
          <p className="text-gray-400 text-lg mt-4">
            ✓ Cancel anytime &nbsp;·&nbsp; ✓ 7-day free trial
          </p>
        </div>
      </div>

      {/* Spacer so page doesn't collapse */}
      <div className="h-64" aria-hidden="true" />
    </div>
  );
}
