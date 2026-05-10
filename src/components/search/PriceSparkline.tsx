"use client";
import { useEffect, useState } from "react";

interface DataPoint {
  price: number;
  recorded_at: string;
}

interface PriceSparklineProps {
  drugId: string;
  pharmacyId: string;
  currentPrice: number;
}

export function PriceSparkline({ drugId, pharmacyId, currentPrice }: PriceSparklineProps) {
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/prices/history?drug_id=${drugId}&pharmacy_id=${pharmacyId}`)
      .then((r) => r.json())
      .then((data: DataPoint[]) => {
        setPoints(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [drugId, pharmacyId]);

  // Need at least 2 points to draw a line
  const allPoints = [...points, { price: currentPrice, recorded_at: new Date().toISOString() }];
  if (loading || allPoints.length < 2) return null;

  const W = 120;
  const H = 36;
  const prices = allPoints.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const coords = allPoints.map((p, i) => {
    const x = (i / (allPoints.length - 1)) * W;
    const y = H - ((p.price - min) / range) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polyline = coords.join(" ");

  const first = allPoints[0].price;
  const last = allPoints[allPoints.length - 1].price;
  const trending = last < first ? "down" : last > first ? "up" : "flat";
  const color = trending === "down" ? "#16A34A" : trending === "up" ? "#DC2626" : "#9CA3AF";
  const label = trending === "down" ? "↓ price dropping" : trending === "up" ? "↑ price rising" : "stable";

  return (
    <div className="flex items-center gap-3 mt-3" aria-label={`Price trend: ${label}`}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-hidden="true"
      >
        <polyline
          points={polyline}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Current price dot */}
        {coords.length > 0 && (
          <circle
            cx={parseFloat(coords[coords.length - 1].split(",")[0])}
            cy={parseFloat(coords[coords.length - 1].split(",")[1])}
            r="3"
            fill={color}
          />
        )}
      </svg>
      <span className="text-sm font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
