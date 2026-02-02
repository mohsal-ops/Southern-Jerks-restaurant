import { NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_GIFTCARD_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log("Received request for webhook");
  console.log(req.headers);

  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("Missing stripe-signature header");
    return new NextResponse("Missing stripe-signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    console.log("Attempting to parse payload and verify signature");
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    console.log("Event verified successfully");
  } catch (err: any) {
    console.error("Webhook verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    console.log("Payment intent succeeded, processing the event...");

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata;

      const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
    
        await transporter.sendMail({
          from: `"Southern Jerks Gift Card" <${process.env.SMTP_USER}>`,
          to: process.env.CATERING_EMAIL,
          subject: "New Gift Card Purchase",
          html: `
            <h2>New Gift Card Purchase</h2>
            <p><b>Amount:</b> $${(paymentIntent.amount / 100).toFixed(2)}</p>
            <p><b>From:</b> ${metadata.fromName ?? "N/A"}</p>
            <p><b>To:</b> ${metadata.toName ?? "N/A"}</p>
            <p><b>Note:</b> ${metadata.note || "None"}</p>
            <p><b>Delivery:</b> ${metadata.delivery ?? "Now"}</p>
            <p><b>Email:</b> ${paymentIntent.receipt_email ?? "N/A"}</p>
          `,
        });
    
        return NextResponse.json(
          { message: "Email sent successfully" },
          { status: 200 }
        );
  }

  console.log("Webhook processed successfully");
  return NextResponse.json({ received: true });
}
