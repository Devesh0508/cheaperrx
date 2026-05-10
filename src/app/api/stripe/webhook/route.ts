import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

// Service-role client — bypasses RLS for webhook updates
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = adminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      if (userId) {
        await supabase.from("profiles").update({
          role: "pro",
          subscription_status: "active",
          stripe_subscription_id: session.subscription as string,
        }).eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(sub.customer as string);
      if (customer.deleted) break;
      const userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
      if (userId) {
        const isActive = sub.status === "active" || sub.status === "trialing";
        await supabase.from("profiles").update({
          role: isActive ? "pro" : "free",
          subscription_status: sub.status,
        }).eq("id", userId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(sub.customer as string);
      if (customer.deleted) break;
      const userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
      if (userId) {
        await supabase.from("profiles").update({
          role: "free",
          subscription_status: "canceled",
          stripe_subscription_id: null,
        }).eq("id", userId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
