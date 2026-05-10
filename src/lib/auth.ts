import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/supabase/types";

/** Get the current session user — returns null if not logged in */
export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Get the full profile row — returns null if not logged in */
export async function getProfile(): Promise<Profile | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

/**
 * Server-side admin check.
 * Uses ADMIN_EMAIL env var as a hard bypass — never trusts client.
 * Falls back to role column for flexibility.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  // Hard bypass via env var — server-side only, never sent to browser
  if (
    process.env.ADMIN_EMAIL &&
    user.email === process.env.ADMIN_EMAIL
  ) {
    return true;
  }

  const profile = await getProfile();
  return profile?.role === "admin";
}

/** Server-side Pro check */
export async function isPro(): Promise<boolean> {
  if (await isAdmin()) return true;

  const profile = await getProfile();
  return profile?.role === "pro" || profile?.subscription_status === "active";
}

/** Redirect to login if not authenticated */
export async function requireAuth() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/** Redirect to upgrade page if not Pro */
export async function requirePro() {
  const user = await requireAuth();
  const pro = await isPro();
  if (!pro) redirect("/upgrade");
  return user;
}

/** Redirect with 403 if not admin */
export async function requireAdmin() {
  const user = await requireAuth();
  const admin = await isAdmin();
  if (!admin) redirect("/");
  return user;
}
