'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'
import { PiHeartStraightThin } from "react-icons/pi";
import SchedulePickupDialog from './schedualePickupModal';
import { CartItem } from '../../../../generated/prisma';

type productObjectPath = {
    id: string;
    name: string;
    priceInCents: number;
    description: string;
    image: string;
    cartItems: CartItem[]
};



export default function ProductCardClient({
    id,
    name,
    priceInCents,
    description,
    image,
    cartItems
}: productObjectPath) {
    const [open, setOpen] = useState(false)

    const ProductInfos = {
        id, name,
        priceInCents,
        description,
        image,
    }

    return (
        <div className='space-y-3'>
            <Card className="flex  overflow-hidden gap-5 h-72 flex-col w-72 " key={id}>
                {/* <CardHeader className="relative w-full h-5/6 aspect-video">
                </CardHeader> */}
                <CardContent className="flex items-end relative h-full p-0 w-full text-center " >
                    <div className='relative top-0 h-full w-full' >
                        <Image
                            src={image}
                            fill
                            alt={name}
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            className='object-cover ' />

                    </div>
                    <div className='absolute z-10 flex items-end h-full  w-full p-3 '>
                        <div className="flex  flex-col gap-4 z-20 ">
                            <CardTitle className="font-semibold text-lg text-white ">{name}</CardTitle>
                        </div>
                        <div className='flex gap-2 items-center absolute right-2 z-40 '>
                            <Button onClick={() => setOpen(true)} variant="outline" className=' w-10 h-10 '><Plus className="stroke-1" size={28} /></Button>
                        </div>

                    </div>

                </CardContent>
            </Card>
            <div className="font-semibold text-lg ">{name}</div>
            <SchedulePickupDialog  product={ProductInfos} open={open} onOpenChange={setOpen} />

        </div>
    );
}

export function PopularDishesCardClient({
    id,
    name,
    description,
    priceInCents,
    image,
    
}: productObjectPath) {
    const [open, setOpen] = useState(false)
    const ProductInfos = {
        id, name,
        priceInCents,
        description,
        image,
    }

    return (
        <div className='space-y-2'>
            <Card className="flex rounded-2xl overflow-hidden gap-5 sm:[h-60 w-60]  h-36 flex-col w-36  " key={id}>
                {/* <CardHeader className="relative w-full h-5/6 aspect-video">
                </CardHeader> */}
                <CardContent className=" flex items-end relative h-full p-0 w-full text-center " >
                    <div className='relative top-0 h-full w-full ' >
                        <Image
                            src={image}
                            fill
                            alt={name}
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            className='object-cover ' />

                    </div>
                    <div className='absolute bottom-0 z-20 flex justify-end w-full p-3 '>

                        <div className='flex gap-2 items-center  '>
                            <Button onClick={() => setOpen(true)} variant="outline" className='w-10 h-10 '><Plus className="stroke-1" size={28} /></Button>
                        </div>

                    </div>
                </CardContent>
            </Card>
            <div className='flex flex-col gap-1 px-2 font-semibold w-full '>
                <p>{name}</p>
                <p>{formatCurrency(priceInCents / 100)}</p>
            </div>
            <SchedulePickupDialog  product={ProductInfos} open={open} onOpenChange={setOpen} />

        </div>
    );
}

export function AllDishesCardClient({
    id,
    name,
    priceInCents,
    description,
    image,
    cartItems
}: productObjectPath) {
    const [open, setOpen] = useState(false)
    const ProductInfos = {
        id, name,
        priceInCents,
        description,
        image,
    }

    return (
        <div className='flex w-full space-x-2 md:rounded-2xl md:border-[1px] border-y-[1px] border-gray-200 md:p-0 p-2'>
            <div className='flex py-3 flex-col gap-1 md:px-4 px-2 text-lg tracking-tight font-semibold w-3/5 '>
                <p>{name}</p>
                <p>{formatCurrency(priceInCents / 100)}</p>
                <p className='text-gray-500 text-sm font'>{description.split(" ").slice(0, 25).join(" ")}
  {description.split(" ").length > 25 && "..."}</p>
            </div>
            <Card className="flex md:rounded-l-none rounded-2xl overflow-hidden gap-5 md:h-50 h-36 flex-col md:w-1/2 w-2/5  " key={id}>
                {/* <CardHeader className="relative w-full h-5/6 aspect-video">
                </CardHeader> */}
                <CardContent className="flex items-end relative h-full p-0 w-full text-center " >
                    <div className='relative top-0 h-full w-full ' >
                        <Image
                            src={image}
                            fill
                            alt={name}
                            priority
                            className='object-cover '
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        />

                    </div>
                    <div className='absolute bottom-0 z-20 flex justify-end w-full p-3 '>

                        <div className='flex gap-2 items-center  '>
                            <Button onClick={() => setOpen(true)} variant="outline" className='w-10 h-10 '><Plus className="stroke-1" size={28} /></Button>

                        </div>

                    </div>
                </CardContent>
            </Card>
            <SchedulePickupDialog product={ProductInfos} open={open} onOpenChange={setOpen} />


        </div>
    );
}

