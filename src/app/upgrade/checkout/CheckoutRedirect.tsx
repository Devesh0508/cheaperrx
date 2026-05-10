"use client";
import { useEffect, useState } from "react";

export function CheckoutRedirect() {
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stripe/create-checkout", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError(data.error ?? "Something went wrong. Please try again.");
        }
      })
      .catch(() => setError("Network error. Please check your connection and try again."));
  }, []);

  if (error) {
    return (
      <div className="text-center">
        <p className="text-5xl mb-4" aria-hidden="true">⚠️</p>
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-3">Checkout unavailable</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <a href="/upgrade" className="btn-primary inline-block">
          Back to plans →
        </a>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div
        className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin mx-auto mb-6"
        aria-label="Loading"
      />
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
        Setting up your checkout…
      </h1>
      <p className="text-gray-500">You&apos;ll be redirected to Stripe in a moment.</p>
    </div>
  );
}
