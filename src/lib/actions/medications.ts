"use server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveMedication(formData: FormData) {
  const user = await requireAuth();
  const supabase = createClient();

  // Pro check
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

  const drugId = formData.get("drug_id") as string;
  const familyMember = (formData.get("family_member") as string)?.trim() || "You";

  if (!drugId) return;

  await supabase.from("saved_medications").insert({
    user_id: user.id,
    drug_id: drugId,
    family_member: familyMember,
  });

  revalidatePath("/medications");
  revalidatePath("/dashboard");
}

export async function removeMedication(formData: FormData) {
  const user = await requireAuth();
  const supabase = createClient();

  const id = formData.get("id") as string;
  if (!id) return;

  await supabase
    .from("saved_medications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/medications");
  revalidatePath("/dashboard");
}
