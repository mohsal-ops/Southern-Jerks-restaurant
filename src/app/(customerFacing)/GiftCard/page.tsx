"use client"

import { useEffect, useState, FormEvent } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, LinkAuthenticationElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)

export default function GiftCardPage() {
  const [clientSecret, setClientSecret] = useState<string>()
  const [price, setPrice] = useState(50 * 100)
  const route = useRouter()

  useEffect(() => {
    fetch("/api/GiftCard/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: price }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
  }, [price])

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6 ">

      <section className="w-full  bg-gradient-to-b bg-pink-600  via-pink-400 to-white py-24 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-100 mb-4">
          Give the Perfect Gift 🎁
        </h1>
        <p className="text-gray-800 max-w-xl mx-auto">
          Perfect for birthdays, holidays, and celebrations — send a snow cone
          gift card to friends, family, or coworkers!
        </p>
      </section>

      {/* Card design preview (optional placeholder) */}
      <section className="w-full max-w-4xl px-6 mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Choose Your Gift Card Amount
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {[10, 25, 50, 75, 100].map((amt) => (
            <Button
              key={amt}
              variant={price === amt * 100 ? "default" : "outline"}
              className={cn(
                "rounded-full px-6 py-2 text-lg",
                price === amt * 100 && "bg-pink-600 text-white"
              )}
              onClick={() => setPrice(amt * 100)}
            >
              ${amt}
            </Button>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-2">
          <Label htmlFor="customAmount" className="text-gray-600">
            Or enter custom amount:
          </Label>
          <Input
            id="customAmount"
            type="number"
            onChange={(e) => {
              setPrice(e.target.valueAsNumber)

            }}
            className="w-28"
            placeholder="e.g. 30"
          />
        </div>
      </section>

      {clientSecret ? (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <CheckoutForm priceInCents={price} />
        </Elements>
      ) : (
        <div className="w-full  flex justify-center items-center text-gray-400 py-8">
          if no payment fields apeared try to <Button variant='link' onClick={()=> route.refresh()} className="p-1 underline"> refresh</Button>
        </div>
      )}
    </div>
  )
}

function CheckoutForm({ priceInCents }: { priceInCents: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [GetPromEmails, setGetPromEmails] = useState(true)
  const [GetPromTexts, setGetPromTexts] = useState<boolean>()
  const [email, setEmail] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [formData, setFormData] = useState({
    fromName: "",
    fromEmail: "",
    toName: "",
    toEmail: "",
    note: "",
    delivery: "now",
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!stripe || !elements || !email) return

    setIsLoading(true)

    const res = await fetch("/api/gift-cards/save-temp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, email, price: priceInCents }),
    })

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/GcPurchase-success`,
        receipt_email: email,
      },
    }).then(({ error }) => {
      if (error) setErrorMessage(error.message || "Unknown error occurred")
    })

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Order your gift card today</h2>
        <p className="text-gray-600">Give the gift of a delicious meal! Perfect for any occasion.</p>

        <div className="grid grid-cols-2 gap-3">
          <Input className="border p-2 rounded" placeholder="From Name"
            value={formData.fromName}
            onChange={e => setFormData({ ...formData, fromName: e.target.value })} />
          <Input className="border p-2 rounded" placeholder="From Email"
            value={formData.fromEmail}
            onChange={e => setFormData({ ...formData, fromEmail: e.target.value })} />
          <Input className="border p-2 rounded col-span-2" placeholder="Note"
            value={formData.note}
            onChange={e => setFormData({ ...formData, note: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="To Name"
            value={formData.toName}
            onChange={e => setFormData({ ...formData, toName: e.target.value })} />
          <input className="border p-2 rounded" placeholder="To Email"
            value={formData.toEmail}
            onChange={e => setFormData({ ...formData, toEmail: e.target.value })} />
        </div>

        <div className="  space-y-5">
          <div className="flex gap-3">
            <label ><input type="radio" checked={formData.delivery === "now"} onChange={() => setFormData({ ...formData, delivery: "now" })} /> Deliver Now</label>
            <label><input type="radio" checked={formData.delivery === "later"} onChange={() => setFormData({ ...formData, delivery: "later" })} /> Deliver Later</label>
          </div>
          <div className="flex flex-col gap-3 ">
            <Label className="flex gap-3 font-normal items-center"><Checkbox checked={GetPromEmails} onCheckedChange={() => setGetPromEmails(!GetPromEmails)} /> Get promotional emails from 1Cato Snow cone</Label>
            <Label className="flex gap-3 font-normal items-center"><Checkbox onChange={() => setGetPromTexts(!GetPromTexts)} /> Get promotional texts from 1Cato Snow cone</Label>
          </div>

        </div>

        <PaymentElement />
        <div className="mt-4">
          <LinkAuthenticationElement onChange={e => setEmail(e.value.email)} />
        </div>

        <Button type="submit" disabled={isLoading || !stripe || !elements} className="w-full mt-3 bg-green-500 hover:bg-green-600/90">
          {isLoading ? "Processing..." : `Pay ${formatCurrency(priceInCents / 100)}`}
        </Button>

        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </Card>
    </form>
  )
}
