import { sendTelegramMessage } from "@/lib/telegram"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const endpointSecret = process.env.STRIPE_GIFTCARD_WEBHOOK_SECRET!

export async function POST(req: Request) {
    console.log('start')
    const payload = await req.text()
    const sig = req.headers.get("stripe-signature")!

    try {
        const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            const metadata = paymentIntent.metadata
    console.log('mrigla')

            // Send Telegram Message
            const message = `
🎁 New Gift Card Purchase
Amount: $${(paymentIntent.amount / 100).toFixed(2)}
From: ${metadata?.fromName || "N/A"}
To: ${metadata?.toName || "N/A"}
Note: ${metadata?.note || "None"}
Delivery: ${metadata?.delivery || "Now"}
Email: ${paymentIntent.receipt_email || "N/A"}
      `
      await sendTelegramMessage(message);
        }
            console.log('3alaama')


        return NextResponse.json({ received: true })
    } catch (err: any) {
        console.error("Webhook error:", err.message)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }
}
