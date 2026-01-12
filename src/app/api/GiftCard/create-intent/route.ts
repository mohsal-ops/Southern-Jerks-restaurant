import { NextResponse } from "next/server"
import Stripe from "stripe"


export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe secret key missing" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { amount } = await req.json()

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
