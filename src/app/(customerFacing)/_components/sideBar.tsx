"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Gamepad2, TextAlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import db from "@/db/db";

export default function AppSideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sheet on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
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
      name: "Kids Zone",
      link: "/KidsZone",
    },
    {
      name: "Gift Card",
      link: "/GiftCard",
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
  const hndleclick = async () => {
    await fetch("/api/getcartId");
  };

  return (
    <>
      <div className="flex overflow-auto gap-8 justify-center   ">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="h-20 w-16  flex justify-center items-center">
            <TextAlignJustify />
          </SheetTrigger>
          <SheetContent aria-describedby={undefined}>
            <SheetHeader className="relative sr-only">
              <SheetTitle>Side Bar Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 items-center justify-center ">
              {links.map((obj, key) => (
                <Link
                  key={key}
                  href={obj.link}
                  className={[
                    "w-full text-center px-4 py-2 rounded-md font-medium transition-colors",
                    pathname === obj.link
                      ? "bg-yellow-400 text-stone-900" 
                      : "text-stone-700 hover:bg-stone-100"
                  ].join(" ")}
                >
                  <div className="flex items-center justify-center gap-2">
                    {obj.name === "Kids Zone" && (
                      <Gamepad2 strokeWidth={1.5} className="w-5 h-5" />
                    )}
                    {obj.name}
                  </div>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
