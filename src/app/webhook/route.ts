import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/db/db";
import { google } from "googleapis";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Google Sheets client
const key = JSON.parse(process.env.GOOGLE_SERVICE_KEY as string);

const auth = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function POST(req: NextRequest) {
  console.log("WEBHOOK HIT maaa nigga ");

  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) return new NextResponse("Missing signature", { status: 400 });

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );

    if (event.type !== "payment_intent.succeeded") {
      return new NextResponse("Ignored", { status: 200 });
    }

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const cartId = paymentIntent.metadata.cartId;
    const email = paymentIntent.receipt_email || "N/A";

    const cart = await db.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return new NextResponse("Cart empty", { status: 400 });
    }
    // Find or create user
    let user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!user) {
      user = await db.user.create({ data: { email }, select: { id: true } });
    }

    console.error("user found or created ");

    // Create orders
    for (const cartItem of cart.items) {
      if (!cartItem.productId) continue;

      await db.order.create({
        data: {
          userId: user.id, // or your real user logic
          productId: cartItem.productId,
          pricePaidInCents: (cartItem.price ?? 0) * (cartItem.quantity ?? 1),
        },
      })
      console.log("order created for cart item ")
    }

    const first = cart.items[0];

    const itemsList = cart.items
      .map(
        (it) =>
          `${it.name} x${it.quantity} ($${(
            ((it.price ?? 0) * (it.quantity ?? 1)) /
            100
          ).toFixed(2)})`,
      )
      .join(" | ");

    const total =
      cart.items.reduce(
        (sum, it) => sum + (it.price ?? 0) * (it.quantity ?? 1),
        0,
      ) / 100;
      console.log("lng",first.deliveryLat, "lat",first.deliveryLng);

    const row = [
      cart.id, // Order ID
      first.orderType || "pickup", // Type
      first.customerName || "",
      first.customerPhone || "",
      email,
      first.deliveryAddress || "",
      first.deliveryLat || "Lat",
      first.deliveryLng || "Lng",
      first.apt || "",
      first.instructions || "",
      first.pickupDay ? new Date(first.pickupDay).toDateString() : "",
      first.pickupTime || "",
      itemsList,
      total,
      new Date().toLocaleString(),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    })
    console.log("Order saved to sheet:");

    // Empty cart
    await db.cartItem.deleteMany({ where: { cartId } })
    console.log("Order saved to sheet and cart emptied:");

    return new NextResponse("Order saved to sheet", { status: 201 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}

// // src/app/webhook/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import db from "@/db/db";
// import { sendTelegramMessage } from "@/lib/telegram";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

// export async function POST(req: NextRequest) {
//   try {
//     const sig = req.headers.get("stripe-signature");
//     if (!sig) return new NextResponse("Missing signature", { status: 400 });
//     if (!process.env.STRIPE_WEBHOOK_SECRET)
//       return new NextResponse("Missing webhook secret", { status: 500 });

//     const body = await req.text();
//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("Webhook signature verification failed:", err);
//       return new NextResponse("Invalid signature", { status: 400 });
//     }

//     // Handle the event
//     if (event.type === "payment_intent.succeeded") {
//       console.log("PaymentIntent succeeded");

//       const paymentIntent = event.data.object as Stripe.PaymentIntent;

//       // Grab metadata from PaymentIntent
//       const cartId = paymentIntent.metadata.cartId as string;
//       const email = paymentIntent.receipt_email

//       if (!cartId || !email) {
//         console.error("Missing cartId or email in metadata");
//         return new NextResponse("Missing data", { status: 400 });
//       }

//       // Find or create user
//       let user = await db.user.findUnique({ where: { email }, select: { id: true } });
//       if (!user) {
//         user = await db.user.create({ data: { email }, select: { id: true } });
//       }

//       console.error("user found or created ");

//       const cart = await db.cart.findUnique({
//         where: { id: cartId },
//         include: { items: true },
//       });

//       if (!cart || cart.items.length === 0) {
//         console.error("Cart not found or empty:", cartId);
//         return new NextResponse("Cart not found or empty", { status: 400 });
//       }

//       // Create one order per cart item
//       for (const cartItem of cart.items) {
//         if (!cartItem.productId) continue; // skip if no linked product

//         const item = await db.item.findUnique({ where: { id: cartItem.productId } });
//         if (!item) continue;

//         await db.order.create({
//           data: {
//             userId: user.id,
//             productId: item.id,
//             pricePaidInCents: (cartItem.price ?? 0) * (cartItem.quantity ?? 1),
//           },
//         });

//       }
//       // 🧾 Compose Telegram message
//       const itemsList = cart.items
//         .map(
//           (it, idx) =>
//             `${idx + 1}. ${it.name || "Unnamed"} × ${it.quantity ?? 1} — ${((it.price ?? 0) * (it.quantity ?? 1)) / 100}$`
//         )
//         .join("\n");

//       const totalPrice =
//         cart.items.reduce(
//           (sum, it) => sum + ((it.price ?? 0) * (it.quantity ?? 1)),
//           0
//         ) / 100;

//       const pickupDate = cart.items[0]?.pickupDay
//         ? new Date(cart.items[0].pickupDay).toLocaleDateString()
//         : "Unknown date";
//       const pickupTime = cart.items[0]?.pickupTime || "Unknown time";

//       const telegramMessage = `
// 🧾 <b>New Order Received</b>
// 📅 <b>Date:</b> ${pickupDate} at ${pickupTime}
// 🕒 <b>Pickup:</b> ${cart.items[0]?.pickupTime || "N/A"}
// 📧 <b>Email:</b> ${email}
// 🛍️ <b>Items:</b>
// ${itemsList}
// `;

//       // Make sure it's properly stringified before sending
//       await sendTelegramMessage(telegramMessage.trim());

//       console.log('message sent')

//       // Empty the cart
//       await db.cartItem.deleteMany({
//         where: { cartId: cart.id },
//       });
//       console.log("Order created successfully for cart and cart emptied :", cartId);
//       return new NextResponse("Order created", { status: 201 });

//     }

//     // If other events, just acknowledge
//     console.log('other event')
//     return new NextResponse("Event ignored", { status: 200 });
//   } catch (err) {
//     console.error("Webhook error:", err);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// }
