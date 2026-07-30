import Image from "next/image";
import Link from "next/link";
import mainImg from "@/../public/general/generalPages/mainImage.jpg";
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
import { SITE_CONFIG } from "@/lib/siteConfig";

export function TopSection({ heroImage }: { heroImage: string }) {
  return (
    <div className="flex relative overflow-hidden h-svh sm:flex-row sm:w-[85%] flex-col bg-stone-100 sm:rounded-3xl sm:p-2">
      <div className="sm:relative absolute z-30 bottom-20 flex flex-col gap-6 items-start justify-end mt-10 md:mb-20 md:w-1/2 p-5 md:p-12">
        <Image
          alt={`${SITE_CONFIG.name} logo`}
          src={Logo}
          width={120}
          height={120}
          className="w-auto h-auto "
        />

        <span className="lg:text-5xl text-white sm:text-black text-4xl font-bold leading-10 lg:leading-15">
          <h1 className="text-yellow-400">{SITE_CONFIG.home.heroHeadline}</h1>{" "}
          {SITE_CONFIG.home.heroSubHeadline}
        </span>
        <span className="font-semibold text-white sm:text-zinc-400 text-md">
          {SITE_CONFIG.subTagline}
        </span>
        <Link href="/Menu">
          <Button size="lg" variant="mainButton">
            View our menu
            <MdKeyboardArrowRight />
          </Button>
        </Link>
      </div>

      <div className="relative md:w-1/2 w-full sm:rounded-3xl overflow-hidden h-full">
        <Image
          priority
          fill
          alt={`${SITE_CONFIG.name} bold Caribbean food`}
          src={heroImage}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
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

// Reviews moved to ./ReviewsSection.tsx (client component — adaptive grid +
// "Read more" floating card for long reviews).

export function OrderDirectlyfromOUrWebsite() {
  return (
    <div className="relative flex items-end h-96 md:h-svh sm:w-[85vw]  rounded-3xl overflow-hidden   ">
      <Image
        src={mainImg}
        alt={`${SITE_CONFIG.name} jerk chicken plated and ready to order`}
        sizes="85vw"
        className="object-cover w-full h-full"
      />
    </div>
  );
}

export function DistinctiveFeatures() {
  const [first, second] = SITE_CONFIG.home.distinctiveFeatures;
  return (
    <div className="flex flex-col space-y-5 md:w-[85vw] rounded-3xl overflow-hidden ">
      <div className="flex md:flex-row flex-col justify-between  md:h-132 h-full">
        <Image
          src={first.image}
          alt={first.title}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover md:w-[45%] w-full h-full rounded-3xl"
        />
        <div className="flex flex-col space-y-7 p-5 justify-center   md:w-[45%] w-full h-full">
          <PageHeader>{first.title}</PageHeader>
          <p className="text-lg font-medium text-neutral-600">
            {first.description}
          </p>
        </div>
      </div>
      <div className="flex md:flex-row flex-col justify-between md:h-132 h-full">
        <div className="flex md:order-1 order-2 flex-col space-y-7 p-5 justify-center   md:w-[45%] w-full h-full">
          <PageHeader>{second.title}</PageHeader>
          <p className="text-lg font-medium text-neutral-600">
            {second.description}
          </p>
        </div>
        <Image
          src={second.image}
          alt={second.title}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover flex items-start bg-amber-200 md:order-2 order-1 md:w-[45%] w-full h-full rounded-3xl"
        />
      </div>
    </div>
  );
}

const FEATURING_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  PiPackageFill,
  MdOutlineFamilyRestroom,
  BsBagCheckFill,
  TbPlant2Off,
};

export function Featuring() {
  return (
    <div className=" flex flex-col gap-14 items-center py-16 w-full md:w-2no/3  ">
      <PageHeader>Featuring</PageHeader>
      <div className="grid md:grid-cols-4 grid-cols-2  w-full gap-10  text-lg font-semibold ">
        {SITE_CONFIG.home.featuring.map((feature, index) => {
          const Icon = FEATURING_ICONS[feature.icon];
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-5 text-center"
            >
              {Icon && <Icon size={25} />}
              <span>{feature.name}</span>
            </div>
          );
        })}
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
        {SITE_CONFIG.home.faq.map((item, i) => (
          <AccordionItem key={i} value={`item-${i + 1}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent className="text-balance text-lg w-full font-medium bg-sidebar-accent p-4 ">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
