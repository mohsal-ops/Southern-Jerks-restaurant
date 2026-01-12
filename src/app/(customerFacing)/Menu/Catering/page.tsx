import React from 'react'
import { cookies } from 'next/headers';
import CateringMainPage from '../_components/cateringMainPage';
import { GetCartItems, GetCateringProducts, GetGategories } from '../_actions/getDataNeeded';

export default async function Menu() {
  
   const [ categories, products] = await Promise.all([
    GetGategories(),
    GetCateringProducts()
   ])





  return (
      <CateringMainPage  products={products} gategories={categories} />

  )
}


