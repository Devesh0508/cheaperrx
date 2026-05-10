"use server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAlert(formData: FormData) {
  const user = await requireAuth();
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, subscription_status")
    .eq("id", user.id)
    .single();

  const pro =
    profile?.role === "pro" ||
    profile?.role === "admin" ||
    profile?.subscription_status === "active" ||
    user.email === process.env.ADMIN_EMAIL;

  if (!pro) redirect("/upgrade");

  const drugName = (formData.get("drug_name") as string)?.trim();
  const targetPrice = parseFloat(formData.get("target_price") as string);

  if (!drugName || isNaN(targetPrice) || targetPrice <= 0) return;

  const { data: drugs } = await supabase
    .from("drugs")
    .select("id")
    .or(`brand_name.ilike.${drugName}%,generic_name.ilike.${drugName}%`)
    .order("is_generic", { ascending: true })
    .limit(1);

  const drug = drugs?.[0];
  if (!drug) return;

  await supabase.from("price_alerts").insert({
    user_id: user.id,
    drug_id: drug.id,
    target_price: targetPrice,
  });

  revalidatePath("/alerts");
  revalidatePath("/dashboard");
}

export async function deleteAlert(formData: FormData) {
  const user = await requireAuth();
  const supabase = createClient();

  const id = formData.get("id") as string;
  if (!id) return;

  await supabase
    .from("price_alerts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/alerts");
  revalidatePath("/dashboard");
}
