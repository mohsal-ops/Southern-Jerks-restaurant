"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { sendTelegramMessage } from "@/lib/telegram";
import z from "zod"
import pic1 from '@/../public/general/schoolevent.png'
import school from '@/../public/general/schoolevent.png'
import corporate from '@/../public/general/img8.webp'
import privetParties from '@/../public/general/img16.webp'
import festival from '@/../public/general/img5.webp'
import sport from '@/../public/general/img4.webp'
import gatherring from '@/../public/general/img19.webp'


export default function HostEventPage() {
  const [open, setOpen] = useState(false);
  const packagesRef = useRef<HTMLDivElement | null>(null);

  const hosteventschema = z.object({
    Name: z.string().min(1, "Name is required"),
    Email: z.string().email("Invalid email"),
    Phone: z.string().min(5, "Phone number required"),
    EventType: z.string().min(1, "Event type required"),
    Date: z.string().min(1, "Date required"), // still string, we’ll not force it to Date
    Guests: z.preprocess((val) => Number(val), z.number().min(1, "Guests required")),
    Notes: z.string().optional(),
  });

  const scrollToPackages = () => {
    if (packagesRef.current) {
      const navbarHeight = 80; // adjust based on your TopNavBar height (px)
      const elementTop = packagesRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementTop - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Parse & validate with Zod
    const result = hosteventschema.safeParse(data);

    if (!result.success) {
      console.log(result.error.issues);
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const validatedData = result.data;




    await sendTelegramMessage(`
      🎪 <b>New Event Request</b>
      📅 ${validatedData.Date}
      📱 ${validatedData.Phone}
      👤 ${validatedData.Name} (${validatedData.Email})
      👥 ${validatedData.Guests} guests
      📝 ${validatedData.Notes || "No notes"}
      `);

    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Your quote request has been sent!");
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center md:w-[80vw] text-gray-800  pt-20 p-2">
      {/* Hero */}
      <section className=" p-5 flex gap-4 flex-col md:flex-row w-full h-[80vh] bg-stone-200 rounded-2xl  ">
        <div className=" relative h-full md:w-1/2 overflow-hidden rounded-2xl">
          <Image
            src={pic1}
            alt="Collaboration background"
            fill 
            className="object-cover brightness-70"
            priority
          />
        </div>
        <div className="px-2 md:w-1/2 sm:space-y-10 space-y-5 flex flex-col items-center justify-center text-center">
          <div className=" text-4xl md:text-6xl font-bold drop-shadow-lg ">
            Bring Snow Cones to Your Event
          </div>
          <div className=" text- font-medium  md:text-xl max-w-xl ">
            Schools, corporate events, festivals — we serve joy in every scoop!
          </div>
          <div className="flex gap-4 ">
            <Button
              variant="mainButton"
              size='lg'
              className=" text-md px-6 "
              onClick={() => setOpen(true)}
            >
              Request a Quote
            </Button>
            <Button
              variant="outline"
              size='lg'
              onClick={scrollToPackages}
              className="text-md px-6  text-gray-600  "
            >
              See Packages
            </Button>
          </div>
          <div className="text-sm ">
            Serving NYC & surrounding areas • Fully licensed & insured
          </div>
        </div>

      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[
            { title: "Fast Service", desc: "500+ servings per hour." },
            { title: "Custom Flavors", desc: "Over 20 unique snow cone flavors." },
            { title: "Friendly Staff", desc: "Our team handles setup & cleanup." },
            { title: "Branded Packaging", desc: "Custom cups and banners available." },
          ].map((f, i) => (
            <Card key={i} className="rounded-2xl shadow-md bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16 px-6 bg-gray-50 w-full">
        <h2 className="text-3xl font-bold text-center mb-10">We Cater To</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            { img: school, title: "Schools & Fundraisers" },
            { img: corporate, title: "Corporate Events" },
            { img: privetParties, title: "Weddings & Private Parties" },
            { img: festival, title: "Festivals & Fairs" },
            { img: sport, title: "Sports & Competitions" },
            { img: gatherring, title: "Community Gatherings" },
          ].map((c, i) => (
            <Card key={i} className="rounded-2xl shadow-md overflow-hidden hover:scale-[1.02] transition hover:duration-500">
              <Image src={c.img} alt={c.title} width={0} height={0} className=" object-cover w-full h-48" />
              <CardContent className="p-5 text-center font-semibold text-lg">{c.title}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Packages & Pricing */}
      <section ref={packagesRef} className="py-16 px-6 max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-10">Packages & Pricing</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Starter", desc: "Perfect for small parties (50–150 guests).", price: "From $350" },
            { name: "Event", desc: "Medium events (300–600 guests).", price: "From $1200" },
            { name: "Festival", desc: "Large-scale service (1000+ guests).", price: "Custom Quote" },
          ].map((p, i) => (
            <Card key={i} className="rounded-2xl shadow-md bg-gray-50">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-2xl font-bold">{p.name}</h3>
                <p className="text-gray-500">{p.desc}</p>
                <p className="text-xl font-semibold">{p.price}</p>
                <Button variant='link' className="rounded-full mt-3" onClick={() => setOpen(true)}>
                  Request Quote
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-lg p-4">
          <DialogHeader>
            <DialogTitle>Request a Quote</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input name="Name" placeholder="Your Name" required />
            <Input name="Email" placeholder="Email" type="email" required />
            <Input name="Phone" placeholder="Phone Number" type="tel" required />
            <Input name="EventType" placeholder="Event Type (e.g. School, Wedding...)" required />
            <Input name="Date" type="date" required />
            <Input name="Guests" placeholder="Estimated Guests" type="number" required />
            <Textarea name="Notes" placeholder="Additional Notes" />
            <Button type="submit" variant='mainButton' className="text-black w-full rounded-full">
              Send Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
