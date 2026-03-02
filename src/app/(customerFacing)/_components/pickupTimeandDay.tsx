"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/providers/CartProvider";
import HereAutocomplete from "@/lib/HereAutocomplete";

type HerePlace = {
  id: string;
  title: string;
  address: {
    label: string;
  };
  position: {
    lat: number;
    lng: number;
  };
};

export default function PickupDetails({
  open,
  onOpenChange,
  orderType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderType: "delivery" | "pickup" | null;
}) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showpickupDetails, setshowpickupDetails] = useState(false);

  useEffect(() => {
    setshowpickupDetails(orderType === "pickup");
  }, [orderType]);
  const [selectedPlace, setSelectedPlace] = useState<{
    address: string;
    lat: number;
    lng: number;
    placeId: string;
  } | null>(null);
  const [apt, setApt] = useState("");
  const [instructions, setInstructions] = useState("");

  // 🟢 selectedDay is now a Date or null
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | undefined>("");
  const [customerPhone, setCustomerPhone] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMoreDays, setShowMoreDays] = useState(false);
  const { cartId, mutate } = useCart();
  const router = useRouter();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDay = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

  const moreDays = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 2);
    return d;
  });

  const handleAddDelivery = async () => {
    setIsLoading(true);
    if (!selectedPlace) {
      toast("Please select delivery address");
      return;
    }
    try {
      const res = await fetch("/api/cart/addDelivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: selectedPlace.address,
          lat: selectedPlace.lat,
          lng: selectedPlace.lng,
          placeId: selectedPlace.placeId,
          apt,
          instructions,
          orderType,
          customerName,
          customerPhone,
        }),
      });

      await mutate(["/api/cart/get", cartId]);
      router.refresh();
      onOpenChange(false);

      if (res.ok) {
        const data = await res.json();
        await mutate(["/api/cart/get", cartId]).then(() => {
          router.refresh();
        });
        toast(`${data.message}`);
      }

      if (!res.ok) {
        const data = await res.json();
        toast(`${data.message}`);
        throw new Error("Failed adding delevey details");
      }
    } catch (error) {
      console.error(error);
      toast(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (Day: Date | null, Time: string | null) => {
    setIsLoading(true);
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
          orderType: orderType,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        await mutate(["/api/cart/get", cartId]).then(() => {
          router.refresh();
        });

        toast(`${data.message}`);
      }

      if (!res.ok) {
        const data = await res.json();
        toast(`${data.message}`);
        throw new Error("Failed adding Time");
      }
    } catch (error) {
      console.error(error);
      toast(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = [
    "10:15 AM",
    "11:00 AM",
    "11:45 AM",
    "12:30 PM",
    "1:15 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:15 PM",
    "7:15 PM",
    "8:15 PM",
  ];

  const isSameDay = (a: Date | null, b: Date) =>
    !!a && a.toDateString() === b.toDateString();
  console.log(orderType)

  return (
    <Dialog open={open}  onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="flex flex-col gap-4 justify-between  overflow-scroll max-h-[95vh] scrollbar-thin scrollbar-track-gray-100 "
      >
        <DialogHeader className="px-5 py-3 flex-none ">
          <DialogTitle>
            {!showSchedule ? "Order Details" : "Schedule Pickup"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-8 flex-1 px-2">
          {orderType === "delivery" && !selectedPlace && (
            <HereAutocomplete
              onSelect={(place) => {
                setSelectedPlace({
                  address: place.address.label,
                  lat: place.position.lat,
                  lng: place.position.lng,
                  placeId: place.id,
                });
              }}
            />
          )}

          {orderType === "delivery" || orderType === null && selectedPlace && (
            <div className="flex flex-col gap-3">
              <div className="border p-3 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-medium">📍 {selectedPlace.address}</div>
                </div>
                <button
                  className="text-sm text-blue-500"
                  onClick={() => setSelectedPlace(null)}
                >
                  Change
                </button>
              </div>

              <input
                placeholder="Apt / Suite / Floor"
                value={apt}
                onChange={(e) => setApt(e.target.value)}
                className="border rounded-xl p-3"
              />
              <input
                className="border rounded-xl p-3"
                placeholder="Full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <input
                className="border rounded-xl p-3"
                placeholder="Phone number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              <div className="border rounded-xl p-3 bg-stone-50 text-sm space-y-1">
                <p className="font-semibold">
                  ⭐ Earn Rewards With Every Order
                </p>
                <p>• 1 point for every $1 spent</p>
                <p>• 100 points = Free Regular Side</p>
                <p>• 500 points = Free 5 Piece Combo</p>
                <p>• 800 points = Free 8 Piece Combo</p>
                <p className="text-xs text-muted-foreground pt-1">
                  Use your phone number at checkout to collect and redeem
                  points.
                </p>
              </div>
              <textarea
                placeholder="Delivery instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="border rounded-xl p-3"
              />
            </div>
          )}
          
          {showSchedule ||
            (orderType === "pickup" && (
              <>
                {/* Day Selection */}
                <div className="flex flex-col gap-2  ">
                  <div className="flex gap-2">
                    {/* Today */}
                    <Button
                      size="lg"
                      variant={
                        isSameDay(selectedDay, today) ? "clicked" : "outline"
                      }
                      className="flex justify-between w-1/2"
                      onClick={() => {
                        setSelectedDay(today);
                        setShowMoreDays(false);
                      }}
                    >
                      <span>{formatDay(today).split(" ")[0]}</span>
                      <span>
                        {formatDay(today).split(" ").slice(1).join(" ")}
                      </span>
                    </Button>

                    {/* Tomorrow */}
                    <Button
                      size="lg"
                      variant={
                        isSameDay(selectedDay, tomorrow) ? "clicked" : "outline"
                      }
                      className="flex justify-between w-1/2"
                      onClick={() => {
                        setSelectedDay(tomorrow);
                        setShowMoreDays(false);
                      }}
                    >
                      <span>{formatDay(tomorrow).split(" ")[0]}</span>
                      <span>
                        {formatDay(tomorrow).split(" ").slice(1).join(" ")}
                      </span>
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
                          variant={
                            isSameDay(selectedDay, day) ? "clicked" : "outline"
                          }
                          className="justify-between"
                          onClick={() => setSelectedDay(day)}
                        >
                          <span>{formatDay(day).split(" ")[0]}</span>
                          <span>
                            {formatDay(day).split(" ").slice(1).join(" ")}
                          </span>
                        </Button>
                      ))}
                    </div>
                  )}
                  {/* Time Slots */}
                  <div
                    className={`${showMoreDays && "h-28"} flex flex-col max-h-72 overflow-hidden `}
                  >
                    <p className="font-medium mb-2">Available times:</p>
                    <div className="w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 ">
                      <div>
                        {timeSlots.map((t) => (
                          <div
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className="flex items-center w-full py-3 px-2 space-x-4 border-b cursor-pointer"
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
                  <div className="flex flex-col gap-3 pt-3">
                    <input
                      className="border rounded-xl p-3"
                      placeholder="Phone number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />

                    <div className="border rounded-xl p-3 bg-stone-50 text-sm space-y-1">
                      <p className="font-semibold">
                        ⭐ Earn Rewards With Every Order
                      </p>
                      <p>• 1 point for every $1 spent</p>
                      <p>• 100 points = Free Regular Side</p>
                      <p>• 500 points = Free 5 Piece Combo</p>
                      <p>• 800 points = Free 8 Piece Combo</p>

                      <p className="text-xs text-muted-foreground pt-1">
                        Use your phone number to collect and redeem points.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ))}
        </div>

        <DialogFooter className="flex-none p-3 shadow-lg shadow-black">
          {showpickupDetails && (
            <Button
              size="md"
              variant="mainButton"
              className="h-6 w-full"
              onClick={() => {
                setshowpickupDetails(false);
                setShowSchedule(true);
                setSelectedDay(today); // default to today
              }}
            >
              Schedule Pickup
            </Button>
          )}
          {showSchedule && (
            <Button
              disabled={isLoading}
              size="md"
              variant="mainButton"
              className="w-full"
              onClick={() => {
                handleAddToCart(selectedDay, selectedTime);
                setShowSchedule(false);
                onOpenChange(false);
              }}
            >
              {isLoading ? "Scheduling..." : "Schedule Order"}
            </Button>
          )}
          {orderType === "delivery" && selectedPlace && (
            <Button
              disabled={isLoading}
              size="md"
              variant="mainButton"
              className="w-full"
              onClick={handleAddDelivery}
            >
              {isLoading ? "Confirming..." : "Confirm Delivery"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
