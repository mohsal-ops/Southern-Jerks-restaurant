// lib/cart.ts (server)
import { cookies } from "next/headers";
import db from "@/db/db"; // prisma client

export async function getOrCreateCart() {
  const cookieStore = cookies();
  let cartId = (await cookieStore).get("cart_id")?.value;

  if (!cartId) {
    const cart = await db.cart.create({ data: {} });
    (await cookieStore).set({
      name: "cart_id",
      value: cart.id,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return cart;
  }

  const cart = await db.cart.findUnique({
    where: { id: cartId },
    include: { items: true }
  });
  if (!cart) {
    // fallback create new and set cookie
    const newCart = await db.cart.create({ data: {} });
    (await cookieStore).set({ name: "cart_id", value: newCart.id, httpOnly: true, path: "/", maxAge: 60*60*24*1 });
    return newCart;
  }
  return cart;
}
