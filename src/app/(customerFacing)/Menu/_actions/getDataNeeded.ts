'use server'

import db from "@/db/db"
import { cache } from "@/lib/handleCaching"



export const GetCateringProducts = cache(async () => {
    const products = await db.item.findMany({
    where:{
      isCaterable:true,
    }
  })
    return products

}, ['cater-products-fun'],{tags:['catering-products']})



export const GetProducts = cache(async () => {
    const products = await db.item.findMany()
    return products

}, ['products-fun'],{tags:['products']})

export const GetFeaturedProducts = cache(async () => {
    const products = await db.item.findMany({
        where: { isAvailableForPurchase: true },
    });
    return products


}, ['featured-products-fun'],{tags:['featured-products']})




export const GetGategories = cache(async () => {
    const types = await db.types.findMany()
    return types

}, ['categorries-fun'],{tags:['categorries']})

export const GetPlaces = cache(async () => {
    const places = await db.location.findMany()
    return places

}, ['location'],{tags:['location']})


export const GetCartItems = cache(async (cartId) => {

    if (!cartId) return { items: [] };
    const cart = await db.cart.findUnique({
        where: { id: cartId },
        include: { items: true }
    });


    if(!cart ) return {items:[]}

    return cart
}, ['cart-items'],{ tags:['cart'], revalidate:2},
  );


  



