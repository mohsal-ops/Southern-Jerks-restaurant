// app/api/GiftCard/create-intent/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { amount } = await req.json();

  if (!amount) {
    return NextResponse.json({ error: "Amount is required" }, { status: 400 });
  }

  try {
    // Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { tempId: Date.now().toString() }, // Temporary ID for later retrieval
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json({ error: "Payment intent creation failed" }, { status: 500 });
  }
}
