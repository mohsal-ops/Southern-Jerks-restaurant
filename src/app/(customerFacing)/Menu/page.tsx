import type { Metadata } from 'next'
import { GetFeaturedProducts, GetGategories, GetPlaces, GetProducts } from './_actions/getDataNeeded'
import MainPageMenu from './_components/mainPage'
import { getBusinessHours } from '@/lib/getHours'

export const metadata: Metadata = {
  title: "Menu | Jerk Chicken, Wings & Loaded Fries",
  description:
    "Order jerk chicken, crispy wings, loaded fries, sandwiches, and family feasts online from Southern Jerks in Houston, TX. Pickup or delivery, kids menu included.",
  keywords: [
    "jerk chicken Houston menu",
    "jerk wings Houston",
    "loaded fries Houston",
    "fried chicken Houston order online",
    "family dinners Houston",
    "kids meal Houston restaurant",
  ],
  alternates: {
    canonical: "/Menu",
  },
  openGraph: {
    title: "Menu | Southern Jerks Houston",
    description:
      "Jerk chicken, wings, loaded fries, sandwiches, and family feasts — order online for pickup or delivery in Houston, TX.",
    url: "/Menu",
  },
}

export default async function Menu() {


   const [featuredProducts , places, categories, products, hours] = await Promise.all([
    GetFeaturedProducts(),
    GetPlaces(),
    GetGategories(),
    GetProducts(),
    getBusinessHours(),
   ])
  return (
      <MainPageMenu featuredProducts={featuredProducts}  places={places} products={products} gategories={categories} hours={hours} />
  )
}


