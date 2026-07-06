import Image from "next/image";
import Link from "next/link";
import mainImg from "@/../public/general/generalPages/mainImage.jpg";
import img2 from "@/../public/general/generalPages/enjoy.jpg";
import img3 from "@/../public/general/generalPages/vibe.jpg";
import Logo from "@/../public/general/logo/logo.png";
import PageHeader from "./PageHeader";
import { MdKeyboardArrowRight } from "react-icons/md";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FaStar } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PiPackageFill } from "react-icons/pi";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import { BsBagCheckFill } from "react-icons/bs";
import { TbPlant2Off } from "react-icons/tb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CartItem } from "generated/prisma";
import { SecondSectionFeatured } from "./FeaturedSection";
import type { ItemWithSides } from "../page";

export function TopSection() {
  return (
    <div className="flex relative overflow-hidden h-svh sm:flex-row sm:w-[85%] flex-col bg-stone-100 sm:rounded-3xl sm:p-2">
      <div className="sm:relative absolute z-30 bottom-20 flex flex-col gap-6 items-start justify-end mt-10 md:mb-20 md:w-1/2 p-5 md:p-12">
        <Image
          alt="Southern Jerks logo"
          src={Logo}
          width={120}
          height={120}
          className="w-auto h-auto "
        />

        <span className="lg:text-5xl text-white sm:text-black text-4xl font-bold leading-10 lg:leading-15">
          <h1 className="text-yellow-400">Bold Caribbean flavors</h1> juicy
          wings, and stacked sandwiches
        </span>
        <span className="font-semibold text-white sm:text-zinc-400 text-md">
          perfectly seasoned, and packed with flavor made fresh so every bite
          hits just right.
        </span>
        <Link href="/Menu">
          <Button size="lg" variant="mainButton">
            View our menu
            <MdKeyboardArrowRight />
          </Button>
        </Link>
      </div>

      <div className="md:w-1/2 w-full sm:rounded-3xl overflow-hidden h-full">
        <Image
          priority
          alt="Southern Jerks bold Caribbean food"
          src={mainImg}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover h-full"
        />
        <div className="sm:hidden absolute top-0 bg-auto bg-black/30 backdrop-blur-none z-20 w-full h-full"></div>
      </div>
    </div>
  );
}

export function SecondSection({
  products,
  cartItems,
}: {
  products: ItemWithSides[];
  cartItems: CartItem[];
}) {
  return <SecondSectionFeatured products={products} cartItems={cartItems} />;
}

function ReviewCard({
  link,
  name,
  review,
}: {
  link: string;
  name: string;
  review: string;
}) {
  return (
    <Card className="w-full h-fit overflow-hidden rounded-2xl shadow-lg ">
      <CardHeader className="flex flex-row" aria-label="5 out of 5 stars">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} aria-hidden="true" />
        ))}
      </CardHeader>
      <CardContent className="font-normal">{review}</CardContent>
      <CardFooter className="flex justify-start gap-3">
        <Avatar>
          <AvatarImage src={link} alt="" />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <p className="text-lg font-semibold">{name}</p>
      </CardFooter>
    </Card>
  );
}

export function ReviewsSection() {
  const reviews = [
    {
      name: "Terrence B.",
      review:
        "This was some good eatin! Chicken has a nice coating and is crispy. The jerk flavor in the breading sets this apart from others. The sauce options were next level.",
      link: "https://api.dicebear.com/7.x/micah/svg?seed=TerenceB&backgroundColor=b6e3f4",
    },
    {
      name: "Sofia M.",
      review:
        "I've tried Caribbean food all over Houston and Southern Jerks is hands down the best. The seasoning is bold without being overpowering. My whole family is obsessed now!",
      link: "https://api.dicebear.com/7.x/micah/svg?seed=SofiaM&backgroundColor=ffd5dc",
    },
    {
      name: "James L.",
      review:
        "Came in on my lunch break and ended up going back for dinner the same day. The jerk chicken sandwich is unreal. Fast service, friendly staff highly recommend.",
      link: "https://api.dicebear.com/7.x/micah/svg?seed=JamesL&backgroundColor=c0aede",
    },
    {
      name: "Amara N.",
      review:
        "As someone who grew up eating Caribbean food, I'm very picky. Southern Jerks nailed the authentic flavor. Crispy, juicy, perfectly spiced. Will be a regular for sure.",
      link: "https://api.dicebear.com/7.x/micah/svg?seed=AmaraN&backgroundColor=d1f5c0",
    },
    {
      name: "Paris B.",
      review:
        "I've been addicted since I first tried them. Went back that same day for dinner. Told my whole job and we've been ordering for team lunch ever since. 10/10, no debate.",
      link: "https://api.dicebear.com/7.x/micah/svg?seed=ParisB&backgroundColor=ffeaa7",
    },
  ];
  return (
    <div className=" flex flex-col items-center  md:w-[85vw] p-10 space-y-10 bg-gray-100 rounded-4xl">
      <div className="text-center space-y-4">
        <PageHeader>What our guests are saying</PageHeader>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 sm:w-11/12 w-full gap-6">
        {reviews.map((Rev, key) => (
          <ReviewCard
            key={key}
            link={Rev.link}
            name={Rev.name}
            review={Rev.review}
          />
        ))}
      </div>
    </div>
  );
}

export function OrderDirectlyfromOUrWebsite() {
  return (
    <div className="relative flex items-end h-96 md:h-svh sm:w-[85vw]  rounded-3xl overflow-hidden   ">
      <Image
        src={mainImg}
        alt="Southern Jerks jerk chicken plated and ready to order"
        sizes="85vw"
        className="object-cover w-full h-full"
      />
    </div>
  );
}

export function DistinctiveFeatures() {
  return (
    <div className="flex flex-col space-y-5 md:w-[85vw] rounded-3xl overflow-hidden ">
      <div className="flex md:flex-row flex-col justify-between  md:h-132 h-full">
        <Image
          src={img2}
          alt="Distinctive Features"
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover md:w-[45%] w-full h-full rounded-3xl"
        />
        <div className="flex flex-col space-y-7 p-5 justify-center   md:w-[45%] w-full h-full">
          <PageHeader>Only flavor that hits</PageHeader>
          <p className="text-lg font-medium text-neutral-600">
            From juicy wings to stacked sandwiches, every dish is made with
            care, quality ingredients, and big Caribbean flavor because average
            isn’t our thing.
          </p>
        </div>
      </div>
      <div className="flex md:flex-row flex-col justify-between md:h-132 h-full">
        <div className="flex md:order-1 order-2 flex-col space-y-7 p-5 justify-center   md:w-[45%] w-full h-full">
          <PageHeader>Bite, chill, and enjoy</PageHeader>
          <p className="text-lg font-medium text-neutral-600">
            Our dishes are made to elevate your experience, using quality
            ingredients, balanced seasoning, and bold flavor in every bite.
          </p>
        </div>
        <Image
          src={img3}
          alt="Distinctive Features"
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover flex items-start bg-amber-200 md:order-2 order-1 md:w-[45%] w-full h-full rounded-3xl"
        />
      </div>
    </div>
  );
}

export function Featuring() {
  const featuring = [
    {
      name: "Takeaway",
      image: PiPackageFill,
    },
    {
      name: "Family friendly",
      image: MdOutlineFamilyRestroom,
    },
    {
      name: "Catering",
      image: BsBagCheckFill,
    },
    {
      name: "Gluten-Free Options",
      image: TbPlant2Off,
    },
  ];
  return (
    <div className=" flex flex-col gap-14 items-center py-16 w-full md:w-2no/3  ">
      <PageHeader>Featuring</PageHeader>
      <div className="grid md:grid-cols-4 grid-cols-2  w-full gap-10  text-lg font-semibold ">
        {featuring.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-5 text-center"
          >
            <feature.image size={25} />
            <span>{feature.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Frequentlyaskedquestions() {
  return (
    <div className="flex items-center w-full flex-col md:py-10 md:w-[85vw] overflow-hidden ">
      <div className="mb-10">
        <PageHeader>Frequently asked questions</PageHeader>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What are you known for?</AccordionTrigger>
          <AccordionContent className="text-balance text-lg w-full font-medium bg-sidebar-accent p-4 ">
            We’re known for our crispy jerk chicken, wings, and bold southern
            flavors.{" "}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What meals do you serve?</AccordionTrigger>
          <AccordionContent className="text-balance text-lg font-semibold bg-sidebar-accent p-4 ">
            Chicken wings, Sandwiches, carribean sides, and snacks.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Do you offer delivery or takeout?</AccordionTrigger>
          <AccordionContent className="text-balance  text-lg font-semibold bg-sidebar-accent p-4 ">
            Yes! We offer both pickup and delivery.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Where are you located?</AccordionTrigger>
          <AccordionContent className="text-balance text-lg font-semibold bg-sidebar-accent p-4 ">
            We are located in{" "}
            <p className="font-bold">2950 Gears Rd Houston, TX 77067</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
