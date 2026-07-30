import type { Metadata } from "next";
import GiftCardPageClient from "./_components/GiftCardPageClient";

export const metadata: Metadata = {
  title: "Gift Cards | Send Jerk Chicken & Wings to a Friend",
  description:
    "Buy a Southern Jerks gift card online - perfect for jerk chicken, wings, and Caribbean-inspired food lovers in Houston, TX. Instant delivery, no expiration.",
  keywords: [
    "restaurant gift card Houston",
    "Southern Jerks gift card",
    "jerk chicken gift card",
  ],
  alternates: {
    canonical: "/GiftCard",
  },
  openGraph: {
    title: "Gift Cards | Southern Jerks Houston",
    description:
      "Send a Southern Jerks gift card instantly - great for jerk chicken and wings lovers in Houston, TX.",
    url: "/GiftCard",
  },
};

export default function Page() {
  return <GiftCardPageClient />;
}
