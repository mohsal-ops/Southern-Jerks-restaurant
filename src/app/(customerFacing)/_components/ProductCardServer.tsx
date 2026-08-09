import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '../../../../generated/prisma';
import ProductCardClient, { AllDishesCardClient, PopularDishesCardClient } from './productCardClient';
import { SideGroupWithOptions } from './schedualePickupModal';

type productObjectPath = {
    id: string;
    name: string;
    priceInCents: number;
    description: string | null ;
    image: string | null ;
    cartItems: CartItem[]
    sideGroups: SideGroupWithOptions[]
    orderType: "pickup" | "delivery" | null
};



export default function ProductCardServer({ id, name, priceInCents, description, image, cartItems, sideGroups, orderType }: productObjectPath) {
  return (
    <ProductCardClient
      id={id}
      name={name}
      priceInCents={priceInCents}
      description={!description ? "": description}
      image={image}
      cartItems={cartItems}
      sideGroups={sideGroups}
      orderType={orderType}
    />
  );
}



export function PopularDishesCardServer({ id, name, priceInCents, description, image, cartItems, sideGroups, orderType }: productObjectPath) {
  return (
    <PopularDishesCardClient
      id={id}
      name={name}
      priceInCents={priceInCents}
      description={!description ? "": description}
      image={image}
      cartItems={cartItems}
      sideGroups={sideGroups}
      orderType={orderType}
    />
  );
}

export function AllDishesCardServer({ id, name, priceInCents, description, image, cartItems, sideGroups, orderType }: productObjectPath) {  return (
    <AllDishesCardClient
      id={id}
      name={name}
      priceInCents={priceInCents}
      description={!description ? "": description}
      image={image}
      cartItems={cartItems}
      sideGroups={sideGroups}
      orderType={orderType}
    />
  );
}



export function ProductCardSkeleton() {
  return (
    <div className="flex w-44 shrink-0 flex-col gap-2 rounded-2xl bg-stone-200 p-2 animate-pulse sm:w-56">
      <div className="aspect-square w-full rounded-xl bg-gray-300" />
      <div className="space-y-2 px-1 pb-1">
        <div className="h-4 w-3/4 rounded bg-gray-300" />
        <div className="h-3 w-1/3 rounded bg-gray-300" />
      </div>
    </div>
  );
}
