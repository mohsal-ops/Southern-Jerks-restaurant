"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import z from "zod";
import { sendTelegramMessage } from "@/lib/telegram";
import pic2 from '@/../public/general/nightfestival.png'
import CountUp from 'react-countup'



export default function MarketingCollabPage() {
  const [open, setOpen] = useState(false);
  const trustItems = [{
    sign: '+',
    number: 1000,
    social: 'Happy Customers'
  }, {
    sign: '+'
    , number: 50,
    social: 'Events Served'
  }, {
    sign: '%',
    number: 100,
    social: 'Satisfaction Rate'
  },
  ]

  const MarketingCollabSchema = z.object({
    Company: z.string().min(1, "Name is required"),
    Name: z.string().min(1, "Name is required"),
    Email: z.string().email("Invalid email"),
    Phone: z.string().min(5, "Phone number required"),
    Budget: z.preprocess((val) => Number(val), z.number().min(1, "Guests required")),
    Notes: z.string().optional(),
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Parse & validate with Zod
    const result = MarketingCollabSchema.safeParse(data);

    if (!result.success) {
      console.log(result.error.issues);
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const validatedData = result.data;




    await sendTelegramMessage(`
📈 <b>New Marketing collaboration</b>
👤 ${validatedData.Name}
🏢 ${validatedData.Company}
📱 ${validatedData.Phone}
✉️ ${validatedData.Email}
💰 ${validatedData.Budget} $
📝 ${validatedData.Notes || "No notes"}
`);

    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Thanks! Your collaboration request has been sent.");
    setOpen(false);
  };


  return (
    <main className="flex flex-col items-center  pt-20  md:w-[80vw]">
      {/* Hero */}
      <section className="relative w-full  h-[80vh] flex flex-col items-center justify-center text-center px-6  text-gray-200 ">

        <div className="  w-1/2 p-4 " >
          <Image

            src={pic2}
            alt="Collaboration background"
            fill
            className="object-cover brightness-50"
            priority
          />

        </div>



        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg z-10">
          Partner With Us & Get Your Brand Noticed at the Biggest Parades in the U.S.
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-xl z-10">
          Custom branding opportunities across event activations, and high-visibility parade placements at iconic celebrations like:
          <span className="text-yellow-500 block font-medium text-md md:text-xl max-w-xl z-10">Laybody · WIADCA (New York Carnival) · Tropicalfete</span>
        </p>
        <div className="mt-8 z-10">
          <Button
            variant="mainButton"
            className="rounded-full text-lg px-6 py-3"
            onClick={() => setOpen(true)}
          >
            Collaborate now
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="rounded-2xl shadow-md p-6">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">1. Choose Visibility</h3>
              <p>Select options such branded cups, event banners, flyer and other graphics etc.</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md p-6">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">2. Launch Activation</h3>
              <p>We deploy at high-energy events and drive nostalgic brand awareness.</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md p-6">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">3. Measure Impact</h3>
              <p>Interracting social media posts with customer engagement</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Logo Wall */}
      <section className="text-center py-10 ">
        <h2 className="text-3xl font-bold mb-8">Trusted by Many</h2>
        <div className="flex flex-col md:flex-row justify-center gap-10 flex-wrap">
          {trustItems.map((item, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-4xl font-bold text-yellow-400">
                <CountUp end={item.number} duration={3} />{item.sign}
              </h3>
              <p className="font-semibold">{item.social}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Popularity Videos */}
      <section className="py-16 px-6 max-w-7xl mx-auto bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-4">
          Examples of Our Popularity
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto ">
          Real footage from live events, showcasing crowd engagement and brand visibility.
        </p>

        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {[
            "/videos/video-1.mp4",
            "/videos/video-2.mp4",
            "/videos/video-3.mp4",
          ].map((src, i) => (
            <div
              key={i}
               className="
                 aspect-video
                 group
                 transition-all duration-300 ease-out
                 md:hover:aspect-[10/16] hover:scale-95
               "
              onMouseEnter={(e) => {
                const video = e.currentTarget.querySelector("video")!;
                video.controls = true;
                video.play();
                
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget.querySelector("video")!;
                video.pause();
                video.currentTime = 0;
                video.controls = false;
              }}
            >
              <video
                src={src}
                className="w-full h-full md:object-cover object-contain rounded-2xl"
                muted
                playsInline
                preload="metadata"
              />
            </div>
          ))}
        </div>
      </section>




      {/* Package Tiers */}
      <section className="py-16 px-6 md:w-6xl w-96 text-center">
        <h2 className="text-3xl font-bold text-center mb-10">Collab Packages</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Bronze", benefits: ["Products Sampling Table", "Social media Shout-out"], price: "From $2500" },
            { name: "Silver", benefits: ["Bronze features ", "Co-Branding"], price: "From $4000" },
            { name: "Gold", benefits: ["Bronze & Silver features ", "Full branding on cups"], price: "From 6000$" },
          ].map((tier, i) => (
            <Card key={i} className="rounded-2xl shadow-md bg-gray-50 ">
              <CardContent className="p-6 space-y-3 ">
                <h3 className="text-2xl font-bold ">{tier.name}</h3>
                <ul className=" list-inside text-gray-600">
                  {tier.benefits.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
                <p className="text-xl font-semibold mt-4">{tier.price}</p>
                <Button variant='link' className="rounded-full mt-3" onClick={() => setOpen(true)}>
                  Request Collab
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>



      {/* Request Collab Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-lg p-4">
          <DialogHeader>
            <DialogTitle>Request a Collaboration</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input name="Company" placeholder="Company Name" required />
            <Input name="Name" placeholder="ex: Mr. petter" required />
            <Input name="Email" placeholder="Email" type="email" required />
            <Input name="Phone" type="tel" placeholder="Phone Number" required />
            <Input name="Budget" placeholder="Budget / Desired Exposure" />
            <Textarea name="Notes" placeholder="Tell us about your brand and goals" />
            <Button variant="mainButton" type="submit" className="w-full rounded-full">
              Send Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer CTA */}
      <section className="py-12 px-6 text-center">
        <p className="text-lg mb-4">Have a custom idea? We’d love to hear it.</p>
        <Button variant="mainButton" className="rounded-full px-8 py-3" onClick={() => setOpen(true)}>
          Let’s Talk Collab
        </Button>
      </section>
    </main>
  );
}
