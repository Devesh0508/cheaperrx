"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/** Service-role client — bypasses RLS */
function adminDb() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function grantPro(formData: FormData) {
  await requireAdmin();
  const userId = formData.get("user_id") as string;
  if (!userId) return;
  const db = adminDb();
  await db.from("profiles").update({
    role: "pro",
    subscription_status: "active",
  }).eq("id", userId);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function revokePro(formData: FormData) {
  await requireAdmin();
  const userId = formData.get("user_id") as string;
  if (!userId) return;
  const db = adminDb();
  await db.from("profiles").update({
    role: "free",
    subscription_status: "canceled",
    stripe_subscription_id: null,
  }).eq("id", userId);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function makeAdmin(formData: FormData) {
  await requireAdmin();
  const userId = formData.get("user_id") as string;
  if (!userId) return;
  const db = adminDb();
  await db.from("profiles").update({ role: "admin" }).eq("id", userId);
  revalidatePath("/admin/users");
}

// ─── Price Submissions ────────────────────────────────────────────────────────

export async function approveSubmission(formData: FormData) {
  await requireAdmin();
  const submissionId = formData.get("submission_id") as string;
  if (!submissionId) return;
  const db = adminDb();

  const { data: sub } = await db
    .from("price_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (!sub) return;

  // Upsert into prices table
  await db.from("prices").upsert({
    drug_id: sub.drug_id,
    pharmacy_id: sub.pharmacy_id,
    price: sub.price_paid,
    quantity: 30,
    source: "community",
    verified: true,
    last_updated: new Date().toISOString(),
  }, { onConflict: "drug_id,pharmacy_id" });

  // Mark submission verified
  await db.from("price_submissions").update({ verified: true }).eq("id", submissionId);

  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

export async function rejectSubmission(formData: FormData) {
  await requireAdmin();
  const submissionId = formData.get("submission_id") as string;
  if (!submissionId) return;
  const db = adminDb();
  await db.from("price_submissions").delete().eq("id", submissionId);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

// ─── Drugs ────────────────────────────────────────────────────────────────────

export async function addDrug(formData: FormData) {
  await requireAdmin();
  const db = adminDb();

  const brandName = (formData.get("brand_name") as string)?.trim();
  const genericName = (formData.get("generic_name") as string)?.trim();
  const strength = (formData.get("strength") as string)?.trim();
  const dosageForm = (formData.get("dosage_form") as string)?.trim() || "tablet";
  const drugClass = (formData.get("drug_class") as string)?.trim() || null;
  const isGeneric = formData.get("is_generic") === "true";

  if (!brandName || !genericName || !strength) return;

  await db.from("drugs").insert({
    brand_name: brandName,
    generic_name: genericName,
    strength,
    dosage_form: dosageForm,
    drug_class: drugClass,
    is_generic: isGeneric,
  });

  revalidatePath("/admin/drugs");
}

export async function deleteDrug(formData: FormData) {
  await requireAdmin();
  const drugId = formData.get("drug_id") as string;
  if (!drugId) return;
  const db = adminDb();

  // Delete associated data first to avoid FK violations
  await db.from("prices").delete().eq("drug_id", drugId);
  await db.from("price_history").delete().eq("drug_id", drugId);
  await db.from("saved_medications").delete().eq("drug_id", drugId);
  await db.from("price_alerts").delete().eq("drug_id", drugId);
  await db.from("price_submissions").delete().eq("drug_id", drugId);
  await db.from("drugs").delete().eq("id", drugId);

  revalidatePath("/admin/drugs");
}

// ─── Pharmacies ───────────────────────────────────────────────────────────────

export async function addPharmacy(formData: FormData) {
  await requireAdmin();
  const db = adminDb();

  const name = (formData.get("name") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  if (!name || !address) return;

  await db.from("pharmacies").insert({
    name,
    chain: (formData.get("chain") as string)?.trim() || null,
    address,
    city: (formData.get("city") as string)?.trim() || "Calgary",
    province: (formData.get("province") as string)?.trim() || "AB",
    phone: (formData.get("phone") as string)?.trim() || null,
    has_delivery: formData.get("has_delivery") === "true",
    delivery_fee: formData.get("delivery_fee") ? Number(formData.get("delivery_fee")) : null,
    accepts_alberta_blue_cross: formData.get("accepts_abc") === "true",
    accepts_odb: formData.get("accepts_odb") === "true",
  });

  revalidatePath("/admin/pharmacies");
}

export async function deletePharmacy(formData: FormData) {
  await requireAdmin();
  const pharmacyId = formData.get("pharmacy_id") as string;
  if (!pharmacyId) return;
  const db = adminDb();

  await db.from("prices").delete().eq("pharmacy_id", pharmacyId);
  await db.from("price_history").delete().eq("pharmacy_id", pharmacyId);
  await db.from("price_submissions").delete().eq("pharmacy_id", pharmacyId);
  await db.from("pharmacies").delete().eq("id", pharmacyId);

  revalidatePath("/admin/pharmacies");
}
