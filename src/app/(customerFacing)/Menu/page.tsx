import React from 'react'
import { GetFeaturedProducts, GetGategories, GetPlaces, GetProducts } from './_actions/getDataNeeded'
import MainPageMenu from './_components/mainPage'


export default async function Menu() {


   const [featuredProducts , places, categories, products] = await Promise.all([
    GetFeaturedProducts(),
    GetPlaces(),
    GetGategories(),
    GetProducts()
   ])
  return (
      <MainPageMenu featuredProducts={featuredProducts}  places={places} products={products} gategories={categories} />
  )
}


