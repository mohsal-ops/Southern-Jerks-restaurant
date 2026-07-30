import type { Metadata } from "next";
import logo from "public/logo.png";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rewards | Earn Points on Jerk Chicken & Wings",
  description:
    "Join Southern Jerks Rewards in Houston, TX - earn points on every jerk chicken and wings order and redeem them for free sides and combos. No app required.",
  keywords: [
    "restaurant rewards Houston",
    "loyalty program Houston restaurant",
    "Southern Jerks rewards",
  ],
  alternates: {
    canonical: "/rewards",
  },
  openGraph: {
    title: "Rewards | Southern Jerks Houston",
    description:
      "Earn points on every order and redeem them for free sides and combos at Southern Jerks.",
    url: "/rewards",
  },
};

export default function RewardsPage() {
  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-16">
      {/* 🔥 HERO */}
      <section className="relative overflow-hidden mt-2 rounded-3xl bg-white px-10 py-24 text-center shadow-xl text-brand">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${logo.src})`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
            transform: "rotate(-8deg) scale(1.2)",
          }}
        />
        <div className="absolute inset-0 bg-black/90" />

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Eat More. <span className="text-white">Earn More.</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-yellow-200 text-lg">
            Every order earns points that turn into free Southern Jerks meals.
          </p>
        </div>
      </section>

      {/* 🪪 LOYALTY CARD PREVIEW */}
      <section className="grid md:grid-cols-2 gap-10 items-center px-6">
        {/* DIGITAL POINTS CARD */}
        <div className="relative">
          <div className="rounded-2xl bg-linear-to-br from-yellow-400 to-yellow-300 p-8 shadow-2xl -rotate-3">
            <div className="flex justify-between items-center mb-10">
              <span className="font-bold text-black text-xl">
                Southern Jerks
              </span>
              <span className="text-black/70">Rewards</span>
            </div>

            <div className="text-black text-4xl font-extrabold mb-4">
              $1 = 1 Point
            </div>

            <div className="flex justify-between text-black/80 text-sm">
              <span>No Signup Needed</span>
              <span>Phone Number Based</span>
            </div>
          </div>
        </div>

        {/* REWARD TIERS */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Redeem your points
          </h2>

          <Card className="p-4 flex justify-between items-center">
            <p>Free Regular Side</p>
            <span className="font-bold">100 pts</span>
          </Card>

          <Card className="p-4 flex justify-between items-center">
            <p>Free 5 Piece Combo</p>
            <span className="font-bold">500 pts</span>
          </Card>

          <Card className="p-4 flex justify-between items-center">
            <p>Free 8 Piece Combo</p>
            <span className="font-bold">800 pts</span>
          </Card>
        </div>
      </section>

      {/* 📲 HOW IT WORKS */}
      <section className="px-6">
        <Card className="p-10 text-center space-y-4">
          <h3 className="text-2xl font-bold">No App. No Cards. No Hassle.</h3>

          <p className="text-muted-foreground">
            Just enter your phone number when ordering. Use the same number
            every time to collect points.
          </p>
          <Link href="/Menu">
            <Button variant="mainButton" size="lg">
              Start Earning Today
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
