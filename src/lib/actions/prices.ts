"use server";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function submitPrice(formData: FormData) {
  const supabase = createClient();
  const user = await getUser();

  const drugId = formData.get("drug_id") as string;
  const pharmacyId = formData.get("pharmacy_id") as string;
  const pricePaid = parseFloat(formData.get("price_paid") as string);

  if (!drugId || !pharmacyId || isNaN(pricePaid) || pricePaid <= 0) return;

  await supabase.from("price_submissions").insert({
    user_id: user?.id ?? null,
    drug_id: drugId,
    pharmacy_id: pharmacyId,
    price_paid: pricePaid,
  });

  redirect("/submit-price?submitted=1");
}
