'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TextAlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import db from '@/db/db';


export default function AppSideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sheet on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  const links = [
    {
      name: "Menu",
      link: "/Menu"
    },
    {
      name: "Catering",
      link: "/HostEvent"
    },
    // {
    //   name: "Host an event",
    //   link: "/HostEvent"
    // },
    {
      name: "Gift Card",
      link: "/GiftCard"
    },
    {
      name: "Blog",
      link: "/Blog",

    },
    {
      name: "Our Story",
      link: "/story"
    },
  ]
  const hndleclick = async () => {
    await fetch('/api/getcartId')
  }

  return <>
    <div className="flex overflow-auto gap-8 justify-center   ">
      <Sheet open={isOpen} onOpenChange={setIsOpen} >
        <SheetTrigger className='h-20 w-16  flex justify-center items-center'>
          <TextAlignJustify />
        </SheetTrigger>
        <SheetContent aria-describedby={undefined}>
          <SheetHeader className="relative sr-only">
            <SheetTitle>Side Bar Menu</SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-2 items-center justify-center '>
            {links.map((obj, key) => (
              <Link
                key={key}
                className="hover:bg-zinc-100 hover:duration-300 rounded-md text-center px-2 font-medium py-2"
                href={`${obj.link}`}
              >
                {obj.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </>

}
