import db from "@/db/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: Promise<{ cartId: string; productId: string }> }) {
  const { cartId, productId } = await context.params;


  try {
    await db.cartItem.deleteMany({
      where: {
        cartId,
        id: productId,
      },
    })
    revalidatePath('cart')
    console.log('fuck yea')
    return new Response("Item deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response("Failed to delete item", { status: 500 });
  }
}

