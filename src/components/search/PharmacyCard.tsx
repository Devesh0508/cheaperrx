import { PriceSparkline } from "@/components/search/PriceSparkline";
import type { PharmacyResult } from "@/lib/mock-data";

interface PharmacyCardProps {
  result: PharmacyResult;
  rank: number;
  mostExpensivePrice: number;
  isCheapest: boolean;
  /** Pass drug ID to show the price-trend sparkline (Pro users only) */
  drugId?: string;
}

export function PharmacyCard({
  result,
  rank,
  mostExpensivePrice,
  isCheapest,
  drugId,
}: PharmacyCardProps) {
  const savings = mostExpensivePrice - result.price;
  const updatedDate = new Date(result.last_updated).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article
      className={`relative rounded-2xl border-2 p-6 bg-white transition-shadow hover:shadow-md ${
        isCheapest
          ? "border-[#16A34A] shadow-md shadow-green-100"
          : "border-gray-200"
      }`}
      aria-label={`${result.pharmacy_name} — $${result.price.toFixed(2)} CAD`}
    >
      {/* Cheapest badge */}
      {isCheapest && (
        <div className="absolute -top-4 left-6 bg-[#16A34A] text-white text-base font-bold px-4 py-1 rounded-full flex items-center gap-1">
          <span aria-hidden="true">🏆</span> CHEAPEST NEARBY
        </div>
      )}

      <div className={`${isCheapest ? "mt-2" : ""}`}>
        {/* Pharmacy name + address */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-[#1a1a2e]">
            {result.pharmacy_name}
          </h3>
          <p className="text-gray-500 text-lg">
            {result.address}, {result.city}
          </p>
        </div>

        {/* Price — the main number */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold text-[#1a1a2e]">
            ${result.price.toFixed(2)}
          </span>
          <span className="text-gray-400 text-lg">
            🍁 CAD for {result.quantity} tablets
          </span>
        </div>

        {/* Sparkline (Pro users — only renders if history data exists) */}
        {drugId && (
          <PriceSparkline
            drugId={drugId}
            pharmacyId={result.pharmacy_id}
            currentPrice={result.price}
          />
        )}

        {/* Savings callout */}
        {savings > 0 && (
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-[#16A34A] rounded-xl px-4 py-2 text-lg font-semibold mb-5 mt-3">
            <span aria-hidden="true">💰</span>
            You save ${savings.toFixed(2)} vs the most expensive nearby
          </div>
        )}

        {/* Tags row */}
        <ul className="space-y-2 mb-5 mt-3" aria-label="Pharmacy details">
          {result.accepts_alberta_blue_cross && (
            <li className="flex items-center gap-2 text-lg text-gray-700">
              <span aria-hidden="true" className="text-[#16A34A]">✅</span>
              Accepts Alberta Blue Cross
            </li>
          )}
          {result.accepts_odb && (
            <li className="flex items-center gap-2 text-lg text-gray-700">
              <span aria-hidden="true" className="text-[#16A34A]">✅</span>
              Accepts Ontario Drug Benefit (ODB)
            </li>
          )}
          {result.has_delivery && (
            <li className="flex items-center gap-2 text-lg text-gray-700">
              <span aria-hidden="true">📦</span>
              {result.delivery_fee === 0
                ? "Free delivery available"
                : `Delivery available — $${result.delivery_fee?.toFixed(2)}`}
            </li>
          )}
          <li className="text-gray-400 text-base mt-1">
            Price last verified {updatedDate}
          </li>
        </ul>

        {/* Call to confirm button */}
        {result.phone && (
          <a
            href={`tel:${result.phone.replace(/\D/g, "")}`}
            className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#1a1a2e] font-semibold rounded-xl px-5 py-3 text-lg transition-colors min-h-[56px]"
            aria-label={`Call ${result.pharmacy_name} to confirm price: ${result.phone}`}
          >
            <span aria-hidden="true">📞</span>
            Call to Confirm: {result.phone}
          </a>
        )}
      </div>
    </article>
  );
}
