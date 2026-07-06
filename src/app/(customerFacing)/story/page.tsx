import type { Metadata } from "next";
import db from "@/db/db";
import StoryClient from "./_components/StoryClient";

export const metadata: Metadata = {
  title: "Our Story | Family-Owned Caribbean Kitchen in Houston",
  description:
    "Meet the family behind Southern Jerks — a Houston, TX restaurant serving jerk chicken and Caribbean-inspired comfort food rooted in generations of home cooking.",
  keywords: [
    "Caribbean restaurant Houston story",
    "family owned restaurant Houston",
    "jerk chicken restaurant history",
    "Southern Jerks owners",
  ],
  alternates: {
    canonical: "/story",
  },
  openGraph: {
    title: "Our Story | Southern Jerks Houston",
    description:
      "The family story behind Southern Jerks' jerk chicken and Caribbean-inspired cooking in Houston, TX.",
    url: "/story",
  },
};

export default async function Page() {
  const partners = await db.partner.findMany({
    orderBy: { order: "asc" },
  });

  return <StoryClient partners={partners} />;
}