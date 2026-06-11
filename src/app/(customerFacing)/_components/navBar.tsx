"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/../public/general/logo/logo.png";
import AppSideBar from "./sideBar";
import CartSideBar from "./Cart-SideBar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { usePathname } from "next/navigation";
import { CartItem } from "generated/prisma";
import { Gamepad2 } from "lucide-react";

export function SideBar({ pathname }: { pathname: string }) {
  return (
    <div className="flex w-full  justify-between h-20 items-center ">
      <div className="flex items-center justify-center pl-7">
        <Link href="/">
          <Image
            alt="snow cone logo"
            priority
            className=" w-auto h-auto"
            src={Logo}
            height={50}
            width={50}
          />
        </Link>
      </div>

      <div className="flex items-center gap-4 pr-7">
        {pathname !== "/Menu" && (
          <Button
            asChild
            size="md"
            variant="outline"
            className="text-md border-gray-300"
          >
            <Link href="/Menu">Menu</Link>
          </Button>
        )}
        <div className="flex w-7 justify-center items-center">
          <AppSideBar />
        </div>
      </div>
    </div>
  );
}

const fetcher = async (url: string, cartId: string | null) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "x-cart-id": cartId ?? "",
    },
  });
  return res.json();
};

export function TopNavBar({ initialCartId }: { initialCartId: string | null }) {
  // console.log("🔁 TopNavBar rendered");

  const pathname = usePathname();
  const [cartId, setCartId] = useState<string | null>(initialCartId);

  useEffect(() => {
    const fetchCartId = async () => {
      const res = await fetch("/api/getcartId");
      const data = await res.json();
      setCartId(data.cartId);
    };
    fetchCartId();
  }, []);

  // 🧠 Pass a stable key and avoid dependency loops
  console.log("Fetching cart with ID:", cartId);
  const { data: CartResObj } = useSWR(
    cartId ? ["/api/cart/get", cartId] : null,
    ([url, id]) => fetcher(url, id),
    { revalidateOnFocus: false },
  );

  const cartItems = (CartResObj?.cart?.items ?? []) as CartItem[];
  const links = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Menu",
      link: "/Menu",
    },
    {
      name: "Catering",
      link: "/catering",
    },
    {
      name: "Gift Card",
      link: "/GiftCard",
    },

    {
      name: "Kids Zone",
      link: "/KidsZone",
    },
    {
      name: "Rewards",
      link: "/rewards",
    },
    {
      name: "Press",
      link: "/Blog",
    },
    {
      name: "Our Story",
      link: "/story",
    },
  ];

  // setCartItems(cartItems)

  return (
    <div className="bg-white flex justify-center ">
      <div className="flex w-full md:hidden">
        <SideBar pathname={pathname} />
        {cartItems.length > 0 && (
          <div className="fixed bottom-1 right-2 left-2 rounded-md flex justify-center z-50">
            <CartSideBar cartId={cartId} cartItems={cartItems} />
          </div>
        )}
      </div>

      <div className="hidden md:flex justify-between h-16 md:h-20 md:w-[80%]  items-center ">
        <div className="flex items-center justify-center w-auto ">
          <Image
            alt="southern jerks logo"
            className="w-auto h-auto"
            src={Logo}
            height={60}
            width={60}
          />
        </div>
        <div className="flex justify-end gap-4 items-center">
          <div className="flex overflow-auto gap-2 justify-center w-full py-1">
            {links.map((obj, key) => {
              const isActive =
                (obj.link === pathname )
                

              return (
                <Link key={key} href={obj.link}>
                  <Button
                    className={[
                      "text-md rounded-md  font-medium transition-colors duration-150 flex items-center gap-2",
                      isActive
                        ? "bg-yellow-400 text-stone-900" // active: yellow bg, dark text
                        : "text-stone-700  hover:bg-stone-100 ", // inactive: orange text, subtle yellow hover
                    ].join(" ")}
                  >
                    {obj.name === "Kids Zone" && (
                      <Gamepad2 strokeWidth={1.5} className="w-4 h-4" />
                    )}
                    {obj.name}
                  </Button>
                </Link>
              );
            })}
            {/* {links.map((obj, key) => {
              const isActive = pathname == "/" + obj.link;
              return (
                <Button
                  key={key}
                  className={`font-medium text-md ${isActive && "bg-yellow-400 text-black "}`}
                  variant="ghost"
                >
                  <Link href={obj.link} className=" text-gray-600">
                    <div className="flex items-center gap-2">
                      {obj.name === "Kids Zone" && (
                        <Gamepad2 strokeWidth={1.5} className="w-5 h-5" />
                      )}
                      {obj.name}
                    </div>
                  </Link>
                </Button>
              );
            })} */}
          </div>
          <div>
            <CartSideBar cartId={cartId} cartItems={cartItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
