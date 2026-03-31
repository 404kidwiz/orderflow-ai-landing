import { NextResponse } from "next/server";
import Stripe from "stripe";

// ADD STRIPE KEYS: https://dashboard.stripe.com/test/apikeys
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;
if (STRIPE_SECRET_KEY && !STRIPE_SECRET_KEY.includes("placeholder")) {
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function POST(req: Request) {
  const { plan, trialLength = 14 } = await req.json();

  // If Stripe isn't configured, return no URL (caller handles fallback)
  if (!stripe) {
    return NextResponse.json({ url: null, error: "Stripe not configured" }, { status: 400 });
  }

  const prices: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro: process.env.STRIPE_PRICE_PRO,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
  };

  const priceId = prices[plan];
  if (!priceId || priceId.includes("placeholder")) {
    return NextResponse.json({ url: null, error: "Price ID not configured" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: trialLength,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ url: null, error: "Stripe error" }, { status: 500 });
  }
}
