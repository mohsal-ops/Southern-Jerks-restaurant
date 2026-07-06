import type { Metadata } from "next";
import CateringPageClient from "./_components/CateringPageClient";

export const metadata: Metadata = {
  title: "Catering | Jerk Chicken Catering for Houston Events",
  description:
    "Southern Jerks caters jerk chicken, wings, and Caribbean-inspired sides for weddings, corporate events, and parties in Houston, TX. Request a custom quote today.",
  keywords: [
    "Caribbean catering Houston",
    "jerk chicken catering Houston",
    "wing catering Houston",
    "event catering Houston TX",
    "corporate catering Houston",
  ],
  alternates: {
    canonical: "/catering",
  },
  openGraph: {
    title: "Catering | Southern Jerks Houston",
    description:
      "Jerk chicken and Caribbean-inspired catering for weddings, corporate events, and parties in Houston, TX.",
    url: "/catering",
  },
};

export default function Page() {
  return <CateringPageClient />;
}
