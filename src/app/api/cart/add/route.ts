// app/api/cart/add/route.ts
import { NextResponse } from "next/server";
import { getOrCreateCart } from "@/lib/cart";
import db from "@/db/db";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const {image, productId, name, price, quantity ,pickupTime, pickupDay } = await req.json();
  try {
    const cart = await getOrCreateCart();
  // Upsert item: if productId exists, increase qty
  const existing = await db.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (existing) {
    await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity }
    });
    revalidateTag('cart')
  return NextResponse.json({ok:true , message : 'this item already exists/updated'})
  } else {
    await db.cartItem.create({
      data: {image,pickupDay,pickupTime, productId, name, price, quantity,cart:{connect:{id:cart.id}} }
    });
  }
  revalidateTag('cart')
  revalidatePath('/')
  return NextResponse.json({ok:true , message : 'added succefuly'})
    
  } catch (error) {
    console.log(error)
    return NextResponse.json({ok:false ,error,message:'error while adding product'})
    
  }
  
}
