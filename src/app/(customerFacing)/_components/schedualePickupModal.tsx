"use client"
import { useEffect, useState } from "react"
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
import Image from "next/image"
import { formatCurrency } from "@/lib/formatters"
import { toast } from "sonner"
import { CartItem } from "@prisma/client"
import { useRouter } from "next/navigation"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { useCart } from "@/app/providers/CartProvider"





function PickupDetails({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center gap-4">
        <Button variant="outline">Pickup</Button>
        <Button variant="outline" disabled>
          Delivery (coming soon)
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        📍 1Cato Snow Cones – Exotic Natural Flavors
      </p>


    </div>
  );
}

function ScheduleStep({
  selectedDay,
  setSelectedDay,
  selectedTime,
  setSelectedTime,
  onNext,
}: {
  selectedDay: Date | null;
  setSelectedDay: (date: Date) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  onNext: () => void;
}) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const moreDays = Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i + 2);
    return d;
  });

  const formatDay = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

  const isSameDay = (a: Date | null, b: Date) =>
    !!a && a.toDateString() === b.toDateString();

  const timeSlots = [
    "10:15 AM", "11:00 AM", "11:45 AM", "12:30 PM",
    "1:15 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:15 PM", "7:15 PM", "8:15 PM",
  ];

  const [showMoreDays, setShowMoreDays] = useState(false);
  return (
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
    </>)
}
function AddProductCard(
  { product,
    quantity,
    setQuantity
  }: {
    product: Product,
    quantity: number,
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
  }
) {

  return (
    <>
      <div className="mt-6 animate-in fade-in-50 duration-300">
        <div className="border rounded-2xl shadow-sm p-4 space-y-4 bg-white">
          {/* Product Header */}
          <div className="flex items-center gap-4">
            <Image
              src={product.image}// replace with actual product image
              alt="Snow cone"
              height={16}
              width={16}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{formatCurrency(product.priceInCents / 100)}</p>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <Label className="font-medium">Quantity</Label>
            <div className="flex items-center border rounded-lg">
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                }
              >
                –
              </Button>
              <span className="px-3">{quantity}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Toppings */}
          <div className="space-y-2">
            <Label className="font-medium">Add toppings</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Coconut", "Mango drizzle", "Pineapple chunks", "Whipped cream"].map(
                (topping) => (
                  <div
                    key={topping}
                    className="flex items-center space-x-2 border rounded-lg p-2 cursor-pointer hover:bg-zinc-50"
                  >
                    <Checkbox id={topping} />
                    <Label htmlFor={topping}>{topping}</Label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label className="font-medium">Special Instructions</Label>
            <textarea
              placeholder="Add a note for the restaurant..."
              className="w-full border rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

        </div>
      </div>

    </>
  )

}


type Product = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  image: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
};


export default function SchedulePickupDialog({
  open,
  onOpenChange,
  product,
}: Props) {
  const [step, setStep] = useState<"details" | "schedule" | "addCard">(
    "details"
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading , setIsLoading] =useState<boolean>(false)
  const [TimeExist, setTimeExist] = useState<boolean>(false)


  
  const route = useRouter()
  const {cartId,mutate,cartItems } = useCart()


  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const Day = cartItems[0].pickupDay  // convert string -> Date
      const time = cartItems[0].pickupTime
      setSelectedDay(Day)
      setSelectedTime(time)
      setTimeExist(true)

    }

  }, [cartItems, selectedDay])

  useEffect(() => {
    if (TimeExist) setStep("addCard");
  }, [TimeExist]);

  // -------------- Add to Cart



  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.priceInCents,
          pickupDay: selectedDay,
          pickupTime: selectedTime,
          quantity,
        }),
      })


      const data = await res.json();
      await mutate(["/api/cart/get", cartId]);
      route.refresh()

      toast(data.message);
      onOpenChange(false);

      


      if (!res.ok) throw new Error("Failed to add to cart");

      onOpenChange(false);
      setStep("details");
    } catch (error) {
      console.error(error);
      toast("Something went wrong while adding to cart.");
    }finally{
      setIsLoading(true)
    }
  };

  // console.log(step)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger></DialogTrigger>
      <DialogContent aria-describedby={undefined} className="flex flex-col justify-between max-h-[95vh]">
        <DialogHeader className="p-4">
          <DialogTitle>
            {step === "details"
              ? "Order Details"
              : step === "schedule"
                ? "Schedule Pickup"
                : "Add to Cart"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4">
          {TimeExist ? (
            <AddProductCard
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          )
            : (<>
              {step === "details" && (
                <PickupDetails onNext={() => setStep("schedule")} />
              )}

              {step === "schedule" && (
                <ScheduleStep
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  onNext={() => setStep("addCard")}
                />
              )}

              {step === "addCard" && (
                <AddProductCard
                  product={product}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
              )}
            </>
            )

          }

        </div>

        <DialogFooter className="p-3">
          {step === "details" && (
            <Button
              size="md"

              variant="mainButton"
              className="w-full"
              onClick={() => setStep("schedule")}
            >
              Schedule Pickup
            </Button>
          )}

          {step === "schedule" && (
            <Button
              size="md"

              variant="mainButton"
              className="w-full"
              onClick={() => setStep("addCard")}
              disabled={!selectedDay || !selectedTime}
            >
              Continue
            </Button>
          )}

          {step === "addCard" && (
            <Button
              size="md"
              variant="mainButton"
              className="w-full"
              onClick={handleAddToCart}
              disabled={isLoading} 
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}









// I am currently working on re-engaging restaurants that I previously contacted about offering them a free website as a lead magnet. I want you to provide me with effective follow-up strategies and sample messages to reconnect with these restaurants after a month of inactivity. The result I want is a structured approach to rekindle interest, build rapport, and ultimately close the deal for the paid service after they experience the free website offer.