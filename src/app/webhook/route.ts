
// src/app/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/db/db";
import { sendTelegramMessage } from "@/lib/telegram";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)



export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) return new NextResponse("Missing signature", { status: 400 });
    if (!process.env.STRIPE_WEBHOOK_SECRET)
      return new NextResponse("Missing webhook secret", { status: 500 });

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      console.log("PaymentIntent succeeded");

      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Grab metadata from PaymentIntent
      const cartId = paymentIntent.metadata.cartId as string;
      const email = paymentIntent.receipt_email


      if (!cartId || !email) {
        console.error("Missing cartId or email in metadata");
        return new NextResponse("Missing data", { status: 400 });
      }

      // Find or create user
      let user = await db.user.findUnique({ where: { email }, select: { id: true } });
      if (!user) {
        user = await db.user.create({ data: { email }, select: { id: true } });
      }

      console.error("user found or created ");


      const cart = await db.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
      });

      if (!cart || cart.items.length === 0) {
        console.error("Cart not found or empty:", cartId);
        return new NextResponse("Cart not found or empty", { status: 400 });
      }

      // Create one order per cart item
      for (const cartItem of cart.items) {
        if (!cartItem.productId) continue; // skip if no linked product

        const item = await db.item.findUnique({ where: { id: cartItem.productId } });
        if (!item) continue;

        await db.order.create({
          data: {
            userId: user.id,
            productId: item.id,
            pricePaidInCents: (cartItem.price ?? 0) * (cartItem.quantity ?? 1),
          },
        });

      }
      // 🧾 Compose Telegram message
      const itemsList = cart.items
        .map(
          (it, idx) =>
            `${idx + 1}. ${it.name || "Unnamed"} × ${it.quantity ?? 1} — ${((it.price ?? 0) * (it.quantity ?? 1)) / 100}$`
        )
        .join("\n");

      const totalPrice =
        cart.items.reduce(
          (sum, it) => sum + ((it.price ?? 0) * (it.quantity ?? 1)),
          0
        ) / 100;

      const pickupDate = cart.items[0]?.pickupDay
        ? new Date(cart.items[0].pickupDay).toLocaleDateString()
        : "Unknown date";
      const pickupTime = cart.items[0]?.pickupTime || "Unknown time";

      const telegramMessage = `
🧾 <b>New Order Received</b>
📅 <b>Date:</b> ${pickupDate} at ${pickupTime}
🕒 <b>Pickup:</b> ${cart.items[0]?.pickupTime || "N/A"}
📧 <b>Email:</b> ${email}
🛍️ <b>Items:</b>
${itemsList}
`;

      // Make sure it's properly stringified before sending
      await sendTelegramMessage(telegramMessage.trim());


      console.log('message sent')

      // Empty the cart
      await db.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      console.log("Order created successfully for cart and cart emptied :", cartId);
      return new NextResponse("Order created", { status: 201 });

    }

    // If other events, just acknowledge
    console.log('other event')
    return new NextResponse("Event ignored", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
