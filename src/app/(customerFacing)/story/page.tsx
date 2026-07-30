import type { Metadata } from "next";
import db from "@/db/db";
import StoryClient from "./_components/StoryClient";
import { getSiteImage } from "@/lib/getSiteImages";

export const metadata: Metadata = {
  title: "Our Story | Family-Owned Caribbean Kitchen in Houston",
  description:
    "Meet the family behind Southern Jerks - a Houston, TX restaurant serving jerk chicken and Caribbean-inspired comfort food rooted in generations of home cooking.",
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
  const [partners, storyHero, storyOrigin, storyClosing] = await Promise.all([
    db.partner.findMany({ orderBy: { order: "asc" } }),
    getSiteImage("story_hero"),
    getSiteImage("story_origin"),
    getSiteImage("story_closing"),
  ]);

  return (
    <StoryClient
      partners={partners}
      images={{ story_hero: storyHero, story_origin: storyOrigin, story_closing: storyClosing }}
    />
  );
}