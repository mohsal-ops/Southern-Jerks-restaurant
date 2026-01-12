import { CartItem, Item } from "@prisma/client";
import ProductCard, {  AllDishesCardServer, PopularDishesCardServer } from "../../_components/ProductCardServer";
import ProductCardServer from "../../_components/ProductCardServer";

type ProductFetcherProp = {
    products: Item[] | undefined
    cartItems: CartItem[]
};

export function ProductSuspense({cartItems, products }: ProductFetcherProp) {

    return products?.map((product: Item) => (
        <ProductCardServer cartItems={cartItems} key={product.id} {...product} />
    ));
}

export function PopularDishesSuspense({cartItems, products }: ProductFetcherProp) {

    return products?.map((product: Item) => (
        <PopularDishesCardServer cartItems={cartItems} key={product.id} {...product} />
    ));
}
export function AllDishesSuspense({cartItems, products }: ProductFetcherProp) {

    return products?.map((product: Item) => (
        <AllDishesCardServer cartItems={cartItems} key={product.id} {...product} />
    ));
}


