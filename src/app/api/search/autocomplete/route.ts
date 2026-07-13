import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) return NextResponse.json([]);

  const supabase = await createClient();

  // Search drugs AND pharmacies in parallel
  const [{ data: drugs }, { data: pharmacies }] = await Promise.all([
    supabase
      .from("drugs")
      .select("id, brand_name, generic_name, strength, is_generic")
      .or(`brand_name.ilike.${q}%,generic_name.ilike.${q}%`)
      .order("is_generic", { ascending: true })
      .order("brand_name", { ascending: true })
      .limit(6),
    supabase
      .from("pharmacies")
      .select("id, name, chain, address, city")
      .or(`name.ilike.%${q}%,chain.ilike.%${q}%`)
      .order("name", { ascending: true })
      .limit(3),
  ]);

  // De-duplicate drug suggestions
  const seen = new Set<string>();
  const drugSuggestions = (drugs ?? [])
    .filter((d) => {
      const key = `${d.is_generic ? d.generic_name : d.brand_name}|${d.strength}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((d) => ({
      id: d.id,
      display_name: d.is_generic ? d.generic_name : d.brand_name,
      subtitle: d.is_generic ? `Generic · ${d.strength}` : `Brand · ${d.strength}`,
      href: `/search?q=${encodeURIComponent(d.is_generic ? d.generic_name : d.brand_name)}`,
      type: "drug" as const,
    }));

  // Pharmacy suggestions — de-duplicate by chain+address
  const seenPh = new Set<string>();
  const pharmacySuggestions = (pharmacies ?? [])
    .filter((p) => {
      const key = `${p.name}|${p.address}`;
      if (seenPh.has(key)) return false;
      seenPh.add(key);
      return true;
    })
    .map((p) => ({
      id: p.id,
      display_name: p.name,
      subtitle: `🏥 Pharmacy · ${p.address}, ${p.city}`,
      href: `/pharmacy/${p.id}`,
      type: "pharmacy" as const,
    }));

  return NextResponse.json([...drugSuggestions, ...pharmacySuggestions]);
}
