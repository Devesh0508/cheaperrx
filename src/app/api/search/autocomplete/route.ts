import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) return NextResponse.json([]);

  const supabase = await createClient();
  const { data } = await supabase
    .from("drugs")
    .select("id, brand_name, generic_name, strength, is_generic")
    .or(`brand_name.ilike.${q}%,generic_name.ilike.${q}%`)
    .order("is_generic", { ascending: true })
    .order("brand_name", { ascending: true })
    .limit(8);

  const seen = new Set<string>();
  const suggestions = (data ?? [])
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
      search_term: d.is_generic ? d.generic_name : d.brand_name,
    }));

  return NextResponse.json(suggestions);
}
