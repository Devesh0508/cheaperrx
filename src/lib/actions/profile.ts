"use server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const user = await requireAuth();
  const supabase = createClient();

  const fullName = (formData.get("full_name") as string)?.trim() || null;
  const city = (formData.get("city") as string)?.trim() || null;
  const province = (formData.get("province") as string)?.trim() || null;

  await supabase
    .from("profiles")
    .update({ full_name: fullName, city, province })
    .eq("id", user.id);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  redirect("/settings?saved=1");
}
