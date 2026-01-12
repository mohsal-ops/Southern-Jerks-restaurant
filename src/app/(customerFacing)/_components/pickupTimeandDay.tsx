"use client"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import { toast } from "sonner"
import { useSWRConfig } from "swr"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/providers/CartProvider"



export default function PickupDetails({
    open,
    onOpenChange,

}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [showSchedule, setShowSchedule] = useState(false)
    const [showpickupDetails, setshowpickupDetails] = useState(true)

    // 🟢 selectedDay is now a Date or null
    const [selectedDay, setSelectedDay] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [showMoreDays, setShowMoreDays] = useState(false)
    const { cartId,mutate} = useCart()
    const router = useRouter()


    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const formatDay = (date: Date) =>
        date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
        })

    const moreDays = Array.from({ length: 8 }, (_, i) => {
        const d = new Date(today)
        d.setDate(today.getDate() + i + 2)
        return d
    })
    const handleAddToCart = async (Day: Date | null, Time: string | null) => {
        if (!Day || !Time) {
            toast("Please select a day and time");
            return;
        }
        try {
            const res = await fetch("/api/cart/addTime", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pickupDay: Day,
                    pickupTime: Time,
                }),
            });
            if (res.ok) {
                const data = await res.json()
                await mutate(["/api/cart/get", cartId]);
                router.refresh()
                toast(`${data.message}`)

            }

            if (!res.ok) {
                const data = await res.json()
                toast(`${data.message}`)
                throw new Error("Failed adding Time");
            }
        } catch (error) {
            console.error(error);
            toast(`${error}`)
        }
    };







    const timeSlots = [
        "10:15 AM", "11:00 AM", "11:45 AM", "12:30 PM", "1:15 PM",
        "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:15 PM", "7:15 PM", "8:15 PM",
    ]

    const isSameDay = (a: Date | null, b: Date) =>
        !!a && a.toDateString() === b.toDateString()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className="flex flex-col gap-4 justify-between max-h-[90vh] overflow-hidden  ">
                <DialogHeader className="p-5 flex-none ">
                    <DialogTitle>
                        {!showSchedule ? "Order Details" : "Schedule Pickup"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col space-y-8 flex-1 p-2">
                    {showpickupDetails && (
                        <>

                            {/* Pickup / Delivery Toggle */}
                            <div className="flex justify-center gap-4">
                                <Button variant="outline">Pickup</Button>
                                <Button variant="outline">Delivery</Button>
                            </div>

                            {/* Restaurant location */}
                            <p className="text-center text-sm text-muted-foreground">
                                📍 1Cato Snow Cones – Exotic Natural Flavors
                            </p>
                        </>)}


                    {showSchedule && (
                        <>
                            {/* Day Selection */}
                            <div className="flex flex-col gap-2  ">
                                <div className="flex gap-2">
                                    {/* Today */}
                                    <Button
                                        size="lg"
                                        variant={isSameDay(selectedDay, today) ? "clicked" : "outline"}
                                        className="flex justify-between w-1/2"
                                        onClick={() => {
                                            setSelectedDay(today)
                                            setShowMoreDays(false)
                                        }}
                                    >
                                        <span>{formatDay(today).split(" ")[0]}</span>
                                        <span>{formatDay(today).split(" ").slice(1).join(" ")}</span>
                                    </Button>

                                    {/* Tomorrow */}
                                    <Button
                                        size="lg"
                                        variant={isSameDay(selectedDay, tomorrow) ? "clicked" : "outline"}
                                        className="flex justify-between w-1/2"
                                        onClick={() => {
                                            setSelectedDay(tomorrow)
                                            setShowMoreDays(false)
                                        }}
                                    >
                                        <span>{formatDay(tomorrow).split(" ")[0]}</span>
                                        <span>{formatDay(tomorrow).split(" ").slice(1).join(" ")}</span>
                                    </Button>
                                </div>

                                {/* More Days */}
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => setShowMoreDays(!showMoreDays)}
                                    className="w-full justify-between"
                                >
                                    More days
                                    <span>▼</span>
                                </Button>

                                {showMoreDays && (
                                    <div className="grid grid-cols-2 gap-2 ">
                                        {moreDays.map((day, i) => (
                                            <Button
                                                size="lg"
                                                key={i}
                                                variant={isSameDay(selectedDay, day) ? "clicked" : "outline"}
                                                className="justify-between"
                                                onClick={() => setSelectedDay(day)}
                                            >
                                                <span>{formatDay(day).split(" ")[0]}</span>
                                                <span>{formatDay(day).split(" ").slice(1).join(" ")}</span>
                                            </Button>
                                        ))}
                                    </div>
                                )}
                                {/* Time Slots */}
                                <div className={`${showMoreDays && 'h-28'} flex flex-col max-h-72  overflow-hidden `}>
                                    <p className="font-medium mb-2">Available times:</p>
                                    <div className="w-full h-full overflow-auto ">
                                        <div>
                                            {timeSlots.map((t) => (
                                                <div
                                                    key={t}
                                                    onClick={() => setSelectedTime(t)}
                                                    className="flex items-center w-full py-4 px-2 space-x-4 border-b cursor-pointer"
                                                >
                                                    <Checkbox
                                                        checked={selectedTime === t}
                                                        onCheckedChange={() => setSelectedTime(t)}
                                                    />
                                                    <Label>{t}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </>
                    )}
                </div>


                <DialogFooter className="flex-none p-3 shadow-lg shadow-black">
                    {showpickupDetails && (

                        <Button
                            size="md"
                            variant="mainButton"
                            className="h-6 w-full"
                            onClick={() => {
                                setshowpickupDetails(false)
                                setShowSchedule(true)
                                setSelectedDay(today) // default to today
                            }}
                        >
                            Schedule Pickup
                        </Button>)
                    }
                    {showSchedule && (<Button
                        size="md"
                        variant="mainButton"
                        className="w-full"
                        onClick={() => {
                            handleAddToCart(selectedDay, selectedTime)
                            setShowSchedule(false)
                            onOpenChange(false)
                        }}
                    >
                        Schedule Order
                    </Button>)}

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
