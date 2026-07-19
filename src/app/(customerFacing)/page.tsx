import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import {
  GetCartItems,
  GetFeaturedProducts,
} from "./Menu/_actions/getDataNeeded";
import GetPlaces from "./_components/getPlaces";
import ThirdSectionClient from "./_components/ThirdSectionClient";
import FadeIn from "@/components/FadeIn";
import { OurLocation } from "./_components/OurLocation";
import HomeFeaturedSkeleton from "./_skeletons/HomeFeaturedSkeleton";
import db from "@/db/db";
import {
  TopSection,
  SecondSection,
  ReviewsSection,
  OrderDirectlyfromOUrWebsite,
  DistinctiveFeatures,
  Featuring,
  Frequentlyaskedquestions,
} from "./_components/HomeSections";
import {
  Item,
  SideGroup,
  SideOption,
} from "generated/prisma";

export type ItemWithSides = Item & {
  sideGroups: (SideGroup & {
    options: SideOption[];
  })[];
};

export const metadata: Metadata = {
  title: "Southern Jerks | Jerk Chicken, Wings & Caribbean Food in Houston",
  description:
    "Southern Jerks serves bold jerk chicken, crispy wings, loaded fries, and stacked sandwiches in Houston, TX. A family-friendly Caribbean-inspired kitchen with a kids menu, catering, and gift cards.",
  keywords: [
    "jerk chicken Houston",
    "jerk wings Houston",
    "Caribbean restaurant Houston",
    "Caribbean food Houston",
    "fried chicken Houston",
    "loaded fries Houston",
    "family restaurant Houston",
    "kids restaurant Houston",
    "Southern Jerks Houston",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Southern Jerks | Jerk Chicken, Wings & Caribbean Food in Houston",
    description:
      "Bold jerk chicken, crispy wings, loaded fries, and stacked sandwiches made fresh at Southern Jerks in Houston.",
    url: "/",
    siteName: "Southern Jerks",
    images: [
      {
        url: "/general/generalPages/mainImage.jpg",
        width: 1200,
        height: 630,
        alt: "Southern Jerks jerk chicken and wings in Houston, TX",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Southern Jerks | Caribbean Food in Houston",
    description:
      "Jerk chicken, wings, loaded fries, and bold Caribbean-inspired flavors you'll crave.",
    images: ["/general/generalPages/mainImage.jpg"],
  },
};

function FaqSchema() {
  // Mirrors the questions/answers rendered in Frequentlyaskedquestions below —
  // keep these in sync if that content changes.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What are you known for?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We're known for our crispy jerk chicken, wings, and bold southern flavors.",
              },
            },
            {
              "@type": "Question",
              name: "What meals do you serve?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Chicken wings, sandwiches, Caribbean sides, and snacks.",
              },
            },
            {
              "@type": "Question",
              name: "Do you offer delivery or takeout?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! We offer both pickup and delivery.",
              },
            },
            {
              "@type": "Question",
              name: "Where are you located?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We are located at 2950 Gears Rd, Houston, TX 77067.",
              },
            },
          ],
        }),
      }}
    />
  );
}

function SectionDivider() {
  return (
    <div className="w-full flex justify-center px-4">
      <div className="h-px w-full max-w-[85vw] bg-linear-to-r from-transparent via-stone-300 to-transparent" />
    </div>
  );
}

async function FeaturedProductsSection() {
  const cartId = (await cookies()).get("cart_id")?.value;
  const [products, cart] = await Promise.all([
    GetFeaturedProducts(),
    cartId ? GetCartItems(cartId) : Promise.resolve(null),
  ]);

  return <SecondSection products={products} cartItems={cart?.items ?? []} />;
}

async function LocationSection() {
  const placesRes = await GetPlaces();
  const places = placesRes?.places ?? [];
  const lat = places[0]?.lat ?? 0;
  const lng = places[0]?.lng ?? 0;

  return <OurLocation places={places} lat={lat} lng={lng} />;
}

async function GallerySection() {
  const images = await db.galleryImage.findMany({ orderBy: { order: "asc" } });
  return <ThirdSectionClient images={images} />;
}

async function ReviewsDataSection() {
  const reviews = await db.review.findMany({ orderBy: { order: "asc" } });
  return <ReviewsSection reviews={reviews} />;
}

export default function Home() {
  // TopSection and the static sections below render immediately; the two
  // DB-backed sections stream in behind Suspense so the hero image isn't
  // blocked on the featured-products and places queries.
  return (
    <div className="flex  pt-20 flex-col gap-5 items-center justify-center    [&>*:not(:first-child)]:m-2">
      <FaqSchema />
      <TopSection />
      <SectionDivider />
      <Suspense fallback={<HomeFeaturedSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>
      <SectionDivider />
      <Suspense fallback={<div className="w-[85%] h-100 bg-gray-200 rounded-3xl animate-pulse" />}>
        <GallerySection />
      </Suspense>
      <SectionDivider />
      <FadeIn delay={100}>
        <Suspense fallback={<div className="h-96 w-full md:w-[85vw] bg-gray-100 rounded-4xl animate-pulse" />}>
          <ReviewsDataSection />
        </Suspense>
      </FadeIn>
      <SectionDivider />
      <FadeIn delay={200}>
        <div className="p-2 w-full flex justify-center">
          <OrderDirectlyfromOUrWebsite />
        </div>
      </FadeIn>
      <SectionDivider />
      <FadeIn delay={300}>
        <div className="w-full flex justify-center">
          <Featuring />
        </div>
      </FadeIn>
      <SectionDivider />
      <FadeIn delay={400}>
        <DistinctiveFeatures />
      </FadeIn>
      <SectionDivider />
      <FadeIn delay={500}>
        <div className="p-4 w-full flex justify-center">
          <Frequentlyaskedquestions />
        </div>
      </FadeIn>
      <SectionDivider />
      <Suspense fallback={<div className="h-40 w-full sm:w-[75%] animate-pulse bg-stone-100 rounded-4xl" />}>
        <LocationSection />
      </Suspense>
    </div>
  );
}
