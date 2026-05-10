import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const drugId = request.nextUrl.searchParams.get("drug_id");
  const pharmacyId = request.nextUrl.searchParams.get("pharmacy_id");

  if (!drugId || !pharmacyId) {
    return NextResponse.json([], { status: 400 });
  }

  const supabase = createClient();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data } = await supabase
    .from("price_history")
    .select("price, recorded_at")
    .eq("drug_id", drugId)
    .eq("pharmacy_id", pharmacyId)
    .gte("recorded_at", sixMonthsAgo.toISOString())
    .order("recorded_at", { ascending: true })
    .limit(30);

  return NextResponse.json(data ?? []);
}
