'use client'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { FaLocationPin } from 'react-icons/fa6'
import { PiMagnifyingGlass } from 'react-icons/pi'
import { Button } from '@/components/ui/button'
import { AllDishesSuspense, PopularDishesSuspense } from './ProductSuspense'
import PickupDetails from '../../_components/pickupTimeandDay'
import { ProductCardSkeleton } from '../../_components/ProductCardServer'
import { useCart } from '@/app/providers/CartProvider'
import { CartItem, Item, Location, Types } from 'generated/prisma'

type PropsTypes = {
    places: Location[],
    gategories: Types[],
    products: Item[],
    featuredProducts: Item[]
} & React.HTMLAttributes<HTMLDivElement>

export default function MainPageMenu({ featuredProducts, style, places, gategories, products }: PropsTypes) {
    const [filtered, setfiltered] = useState<Item[] | undefined>()
    const [choice, setChoice] = useState<"delivery" | "pickup" | null>("pickup");
    const [query, setQuery] = useState("");
    const placeholderRef = useRef<HTMLDivElement | null>(null)
    const [isPinned, setIsPinned] = useState(false)
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    // const [cartItems, setcartItems] = useState<CartItem[] | undefined>([])
    const [selectedDay, setSelectedDay] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [open, setOpen] = useState<boolean>(false)
    const { cartItems, cartId, mutate } = useCart();



    // Tracks the serachbar so it fiex it or un-fix it 
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsPinned(!entry.isIntersecting)
            },
            { threshold: 0.3 }
        )

        if (placeholderRef.current) {
            observer.observe(placeholderRef.current)
        }

        return () => observer.disconnect()
    }, []);

    // observ gategory position so it's button style will be changed

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveCategory(entry.target.id.replace("cat-", ""));
                    }
                });
            },
            { threshold: 0.3 } // triggers when 30% of section is visible
        );

        gategories?.forEach((cat) => {
            const el = document.getElementById(`cat-${cat.id}`);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [gategories]);



    // search filter function 
    useEffect(() => {
        const filterFunction = () => {
            const filteredArray = query ? products?.filter((p) =>
                p.name.toLowerCase().includes(query.toLowerCase())
            ) : undefined
            setfiltered(filteredArray)
        }

        filterFunction();
    }, [query])


    useEffect(() => {
        // Only run when cartItems first become available
        if (cartItems && cartItems.length > 0 && !selectedDay && !selectedTime) {
            const Day = cartItems[0].pickupDay
                ? new Date(cartItems[0].pickupDay)
                : null;
            const time = cartItems[0].pickupTime;
            setSelectedDay(Day);
            setSelectedTime(time);
        }
    }, [cartItems]);



    const grouped = React.useMemo(() => {
        return gategories?.map((category) => ({
            category,
            products: products.filter((p) => p.typeId === category.id),
        }));
    }, [gategories, products]);


    return (
        <div style={{ ...style }} className='flex flex-col md:flex-row gap-16 w-full lg:w-[80%] pt-20 '>
            <div className='relative hidden md:block w-2/12 py-5  '>
                <div id="SearchBar&gategories" className='flex w-[15rem] flex-col fixed'>
                    <div className='flex  w-full justify-start items-center  border border-stone-300 rounded-xl outline-none focus-within:border-2 focus-within:border-black'>
                        {/* Search Input */}
                        <PiMagnifyingGlass fontSize={21} className="mx-2" />

                        <input
                            type="text"
                            placeholder="Search Menu..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full md:rounded-lg rounded-full py-2 outline-none "
                        />
                    </div>
                    <div className='flex flex-col py-2 font-bold gap-1  w-full '>
                        {gategories && (
                            gategories.map((cat) => (
                                <Button
                                    key={cat.id}

                                    onClick={() =>
                                        document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: "smooth" })
                                    }
                                    className={`justify-start font-medium text-sm ${activeCategory === cat.id ? "bg-black text-white" : "bg-transparent text-gray-600"
                                        }`}
                                    variant="ghost"
                                >
                                    {cat.name}
                                </Button>
                            ))

                        )}

                    </div>
                </div>
            </div>
            <div className='md:w-9/12 w-full md:py-5 px-2 space-y-5 md:space-y-7 '>
                <div className='flex flex-col gap-2 md:items-start  items-center  font-bold  ' id="name&address">
                    <p className='tracking-tight font-serif  text-xl text-center'>1Cato Snow Cones Exotic Natural Flavors</p>
                    <p className="flex text-sm items-center font-semibold w-4/5 gap-1  text-neutral-600 text-center  "><FaLocationPin className='md:block hidden' />{places[0] && places[0].name}</p>
                </div>
                <div id="PickupOrDelivery " className='text-sm flex  p'>
                    <div className="flex flex-col sm:flex-row w-full sm:w-1/2  gap-4 font-semibold text-gray-600">
                        {/* Delivery */}
                        <div className='bg-stone-200 w-full shadow-sm sm:w-1/2 flex h-11 rounded-3xl overflow-hidden'>
                            <label className="cursor-pointer w-1/2 relative">
                                <input
                                    type=""
                                    name="orderType"
                                    className='hidden peer'
                                />
                                {/* <div className="h-full  bg-stone-200 border  flex items-center justify-center  rounded-3xl peer-checked:shadow-md peer-checked:border-gray-300 peer-checked:bg-white peer-checked:text-black transition">
                                    Delivery
                                </div> */}
                                <div className="h-full  bg-stone-200 border  flex items-center justify-center  rounded-3xl ">
                                    Delivery
                                </div>
                            </label>

                            {/* Pickup */}
                            <label className="cursor-pointer h-full relative w-1/2">
                                <input
                                    type="radio"
                                    name="orderType"
                                    value="pickup"
                                    checked={choice === "pickup"}
                                    onChange={() => setChoice("pickup")}
                                    className="hidden peer"
                                />
                                <div className=" h-full bg-stone-200 border  flex items-center justify-center rounded-3xl peer-checked:shadow-md peer-checked:border-gray-300 peer-checked:bg-white peer-checked:text-black transition">
                                    Pickup
                                </div>
                            </label>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setOpen(true)}
                            className="w-full sm:w-2/3 h-11 text-sm rounded-lg hover:bg-stone-200 shadow-xs justify-between"
                        >
                            {selectedDay != null || selectedTime != null ? (
                                <div className='flex gap-2' >
                                    <h1>{selectedDay?.toDateString()}</h1>  <h1>{selectedTime}</h1>
                                </div>
                            )
                                : "Scheduel pickup "}
                            <span>▼</span>
                        </Button>
                    </div>

                </div>
                <div ref={placeholderRef} id="popularDishes" >
                    <h2 className="text-xl font-semibold font-serif ">Popular</h2>
                    {featuredProducts && featuredProducts?.length > 0 ? (
                        <PopularDishes cartItems={cartItems} Poularproducts={featuredProducts} />
                    ) : (

                        <p className="text-gray-500 text-center ">No products found</p>
                    )}
                </div>
                <div
                    id="SearchBar&gategories"
                    className={isPinned ? 'fixed top-20  right-0 left-0  z-50 md:hidden transform p-2 -translate-y-20 duration-500  bg-white flex gap-2 flex-col ' : 'md:hidden py-2 translate-y-0 duration-500 z-50 flex gap-2 flex-col'}
                >
                    <div className='flex pl-1 w-full justify-start items-center  bg-white border rounded-xl outline-none focus-within:border-2 focus-within:border-black'>
                        {/* Search Input */}
                        <PiMagnifyingGlass fontSize={21} className="ml-1" />

                        <input
                            type="text"
                            placeholder="Search Menu..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full md:rounded-lg rounded-full p-2 outline-none "
                        />
                    </div>
                    <div className='flex items-center gap-2 overflow-auto'>
                        {gategories && (
                            gategories.map((cat) => (
                                <Button
                                    key={cat.id}
                                    onClick={() =>
                                        document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: "smooth" })
                                    }
                                    className={`font-medium text-sm ${activeCategory === cat.id ? "bg-black text-white" : "bg-transparent text-gray-600"
                                        }`}
                                    variant="outline"
                                >
                                    {cat.name}
                                </Button>))
                        )}
                    </div>
                </div>

                <div id="Products" className='min-h-56 '>
                    {filtered && filtered.length > 0 ? (
                        <AllDishes cartItems={cartItems} Products={filtered} />
                    ) : query ? (

                        <span className="text-gray-500 text-center  ">No products found</span>
                    ) : (
                        grouped?.map((Category) => (
                            <section key={Category.category.id} className='space-y-1 mb-8' id={`cat-${Category?.category?.id}`}>
                                <h2 className="text-xl font-semibold font-serif ">{Category.category.name}</h2>
                                <AllDishes cartItems={cartItems} Products={Category.products} />
                            </section>
                        ))

                    )}

                </div>
            </div>
            <PickupDetails open={open} onOpenChange={setOpen} />
        </div>
    )
}

export function PopularDishes({ cartItems, Poularproducts }: { cartItems: CartItem[], Poularproducts: Item[] | undefined }) {

    const products = Poularproducts;
    return (
        <div className="flex-col space-y-6  w-full ">
            <div className="grid grid-flow-col justify-start gap-4 w-full no-scrollbar overflow-auto  py-2">
                <Suspense
                    fallback={
                        <>
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                        </>
                    }
                >
                    <PopularDishesSuspense cartItems={cartItems} products={products} />
                </Suspense>
            </div>
        </div>

    )
}

export function AllDishes({ cartItems, Products }: { cartItems: CartItem[], Products: Item[] }) {

    return (
        <div className="flex space-y-6  w-full">
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4 w-full py-2">
                <Suspense
                    fallback={
                        <>
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                        </>
                    }
                >
                    <AllDishesSuspense cartItems={cartItems} products={Products} />
                </Suspense>
            </div>
        </div>

    )
}

