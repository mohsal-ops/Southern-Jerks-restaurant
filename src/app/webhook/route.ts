import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/db/db";
import { google } from "googleapis";
import { revalidatePath, revalidateTag } from "next/cache";

const formatSides = (sides: any[]) => {
  if (!sides || sides.length === 0) return "";

  // group by sideGroupId
  const grouped: Record<string, any[]> = {};

  for (const s of sides) {
    if (!grouped[s.sideGroupId]) grouped[s.sideGroupId] = [];
    grouped[s.sideGroupId].push(s);
  }

  return Object.values(grouped)
    .map((group) => {
      const options = group
        .map((o) =>
          o.priceInCents
            ? `${o.label} (+$${(o.priceInCents / 100).toFixed(2)})`
            : o.label,
        )
        .join(", ");

      return options;
    })
    .join(" | ");
};

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
      include: {
        items: {
          include: {
            sides: true,
          },
        },
      },
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
      });
      console.log("order created for cart item ");
    }

    const first = cart.items[0];

    const itemsList = cart.items
      .map((it) => {
        if (!it.name) return null; // skip items without a name
        const quantity = it.quantity ?? 1;
        const basePrice = (it.price ?? 0) * quantity;
        const sidesTotal = it.sides.reduce(
          (sum, s) => sum + (s.priceInCents ?? 0),
          0,
        );
        const totalPrice = (basePrice + sidesTotal) / 100;

        // sides as string
        const sidesStr = it.sides.map((s) => s.label).join(" | ");
        return (
          `${it.name} x${quantity} ($${totalPrice.toFixed(2)})` +
          (sidesStr ? " → " + sidesStr : "")
        );
      })
      .filter(Boolean) // remove nulls
      .join(" | ");

    const total =
      cart.items.reduce((sum, it) => {
        const base = (it.price ?? 0) * (it.quantity ?? 1);

        const sides = it.sides.reduce(
          (s, side) => s + (side.priceInCents ?? 0),
          0,
        );

        return sum + base + sides;
      }, 0) / 100;

    console.log("lng", first.deliveryLat, "lat", first.deliveryLng);

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
    });
    console.log("Order saved to sheet:");

    // Empty cart
    await db.cartItem.deleteMany({ where: { cartId } })
    revalidatePath("/Menu")
    revalidatePath("/stripe/purchase-success")
    console.log("Order saved to sheet and cart emptied:");

    return new NextResponse("Order saved to sheet", { status: 201 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
