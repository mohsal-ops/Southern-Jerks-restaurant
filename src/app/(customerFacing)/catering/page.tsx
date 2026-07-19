import type { Metadata } from "next";
import CateringPageClient from "./_components/CateringPageClient";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: `Catering | Jerk Chicken Catering for ${SITE_CONFIG.city} Events`,
  description: `${SITE_CONFIG.name} caters jerk chicken, wings, and Caribbean-inspired sides for weddings, corporate events, and parties in ${SITE_CONFIG.city}, ${SITE_CONFIG.state}. Request a custom quote today.`,
  keywords: [
    `Caribbean catering ${SITE_CONFIG.city}`,
    `jerk chicken catering ${SITE_CONFIG.city}`,
    `wing catering ${SITE_CONFIG.city}`,
    `event catering ${SITE_CONFIG.city} ${SITE_CONFIG.state}`,
    `corporate catering ${SITE_CONFIG.city}`,
  ],
  alternates: {
    canonical: "/catering",
  },
  openGraph: {
    title: `Catering | ${SITE_CONFIG.name} ${SITE_CONFIG.city}`,
    description: `Jerk chicken and Caribbean-inspired catering for weddings, corporate events, and parties in ${SITE_CONFIG.city}, ${SITE_CONFIG.state}.`,
    url: "/catering",
  },
};

export default function Page() {
  return <CateringPageClient />;
}
