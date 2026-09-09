// Single source of truth for every brand-specific value on the site.
// To onboard a new restaurant client, this is the only file that should
// need to change (plus swapping image assets in /public).
import { atLeast, type PackageTier } from "./packages";

// Product tier this client is on. The panel patches this line per client at
// provision time. It gates which site + admin sections show (via `minTier`
// below and the admin nav). Southern Jerks is a full live site → PRO.
const PACKAGE_TIER: PackageTier = "PRO";

// Optional sections. Flip a flag to false to remove that section from the
// navbar + footer. The route still exists, it is simply not linked. Tier gating
// (`minTier`) is layered on top: a section shows only when its flag is on AND
// the client's tier reaches it. Southern Jerks runs every section.
const FEATURES = {
  catering: true,
  giftCard: true,
  rewards: true,
  blog: true,
};

type FeatureKey = keyof typeof FEATURES;
type NavLink = { label: string; href: string; feature?: FeatureKey; minTier?: PackageTier };

const ALL_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/Menu" },
  { label: "Catering", href: "/catering", feature: "catering", minTier: "STANDARD" },
  { label: "Gift Card", href: "/GiftCard", feature: "giftCard", minTier: "STANDARD" },
  { label: "Kids Zone", href: "/KidsZone", minTier: "PRO" },
  { label: "Rewards", href: "/rewards", feature: "rewards", minTier: "PRO" },
  { label: "Press", href: "/Blog", feature: "blog", minTier: "STANDARD" },
  { label: "Our Story", href: "/story" },
];

const ALL_FOOTER_LINKS: NavLink[] = [
  { label: "Menu", href: "/Menu" },
  { label: "Catering", href: "/catering", feature: "catering", minTier: "STANDARD" },
  { label: "Gift Cards", href: "/GiftCard", feature: "giftCard", minTier: "STANDARD" },
  { label: "Terms", href: "/terms" },
];

// A link shows when its feature flag is on (or it has none) AND the client's
// tier reaches its minTier (or it has none).
const enabled = (l: NavLink) =>
  (!l.feature || FEATURES[l.feature]) && (!l.minTier || atLeast(PACKAGE_TIER, l.minTier));
const pickLink = ({ label, href }: NavLink) => ({ label, href });

export const SITE_CONFIG = {
  // Brand
  name: "Southern Jerks",
  tagline: "Bold Southern flavors, juicy wings, and stacked sandwiches",
  subTagline:
    "perfectly seasoned, and packed with flavor made fresh so every bite hits just right.",
  legalName: "Southern Jerk Co LLC",
  trademark: "Southern Jerks®",

  // Admin intro animation: "burger" (fast food) | "coffee" (café) | "pizza" (pizzeria)
  loaderStyle: "burger",

  // Starting color theme for a first-time visitor: "light" | "dark".
  // Southern Jerks is a dark brand (black + gold), so it opens dark. The header
  // toggle is intentionally hidden on this site, so this is the fixed look.
  defaultTheme: "light" as "light" | "dark",

  // Main call-to-action button label, used on every "menu" button across the site.
  menuCtaLabel: "Order Now",

  // Loyalty / rewards program.
  loyalty: {
    // What members sign up FOR. A lowercase noun phrase, always used mid-sentence
    // ("You're on the list for ...", "Sign up for ..."), so keep it generic and
    // lowercase. Flows into the /rewards signup, the welcome text/email, the
    // popup, and the success message.
    incentive: "member specials, event invites, and offers you won't find anywhere else",
  },

  // Inline catering menu shown on /catering (design in CateringMenuDisplay).
  // Edit these to change the menu - the first section renders full-width.
  // `pdfUrl` is optional (a downloadable PDF in /public); omit to hide the button.
  catering: {
    pdfUrl: "/southern-jerks-catering-menu.pdf",
    // Catering menu entrance animation: "grill" (drifting smoke + embers) or "none".
    animation: "grill",
    menu: [
      {
        title: "Chicken",
        note: "Each meal comes with 20 rolls and 20 jalapeños",
        items: [
          { name: "Half Wings", qty: "50 pieces", price: 75 },
          { name: "Half Wings", qty: "100 pieces", price: 150 },
          { name: "Chicken Tenders", qty: "25 pieces", price: 65 },
          { name: "Chicken Tenders", qty: "50 pieces", price: 105 },
        ],
      },
      {
        title: "Sides",
        items: [
          { name: "Pan Collard Greens", price: 45 },
          { name: "Pan 3 Cheese Mac & Cheese", price: 65 },
          { name: "Pan Jerk Dirty Rice", price: 55 },
          { name: "Box of Seasoned Fries", price: 35 },
        ],
      },
      {
        title: "Extras",
        items: [
          { name: "20 Rolls", price: 10 },
          { name: "20 Jalapeños", price: 10 },
        ],
      },
    ] as { title: string; note?: string; items: { name: string; qty?: string; price: number }[] }[],
  },

  // Contact & Location
  address: "2950 Gears Rd, Houston, TX 77067",
  street: "2950 Gears Rd",
  city: "Houston",
  state: "TX",
  zip: "77067",
  phone: "(346) 242-0328",
  email: "jordan@southernjerkshtx.com",
  cateringEmail: "jordan@southernjerkshtx.com",
  timezone: "America/Chicago",
  lat: 29.9463,
  lng: -95.4642,
  googleMapsUrl:
    "https://www.google.com/maps/place/Southern+Jerks/@29.9461573,-95.4667466,17z/data=!4m15!1m8!3m7!1s0x8640c95bb7adafc3:0xddfe3901268f1b3!2s2950+Gears+Rd,+Houston,+TX+77067,+USA!3b1!8m2!3d29.9461206!4d-95.4641839!16s%2Fg%2F11bw3ym21k!3m5!1s0x8640c93ae409f1e5:0x89628db687ee16b3!8m2!3d29.9463373!4d-95.4643887!16s%2Fg%2F11xclc7vhb",

  // Social
  instagram: "southernjerkshtx",
  instagramUrl: "https://www.instagram.com/southernjerkshtx/?hl=en",
  facebookUrl: "https://www.facebook.com/p/Southern-Jerks-100076329252325",
  tiktokUrl:
    "https://www.tiktok.com/@southernjerkshtx?is_from_webapp=1&sender_device=pc",
  beholdFeedId: "8s90dtGqNm7T2vv65Bxo",

  // SEO
  siteUrl: "https://southernjerkshtx.com",
  seoTitle: "Southern Jerks | Jerk Chicken, Wings & Southern Food in Houston",
  seoDescription:
    "Southern Jerks serves bold jerk chicken, crispy wings, loaded fries, and stacked sandwiches in Houston, TX.",
  seoKeywords: [
    "jerk chicken Houston",
    "jerk wings Houston",
    "Southern restaurant Houston",
    "fried chicken Houston",
    "family restaurant Houston",
    "Southern Jerks Houston",
  ],
  ogImage: "/general/generalPages/mainImage.jpg",

  // Structured-data / business info (used in JSON-LD)
  cuisines: ["Southern", "American", "Comfort Food"],
  priceRange: "$$",

  // Colors (Tailwind hex values)
  primaryColor: "#c85a1e",
  secondaryColor: "#1a6b3c",
  accentColor: "#d97706",

  // Outreach conversion layer (trial popup + read-only dashboard preview). This
  // is a sales tool for un-converted leads - Southern Jerks is a live client, so
  // it is turned OFF. `signalKey`/`savings` are kept for reference only.
  outreach: {
    enabled: false,
    discountReason: "review",
    trialLengthDays: 14,
    calendlyUrl: "https://calendly.com/popdeveloper54/10-minute-meet",
    signalKey: "southern-jerks",
    savings: { estimatedOrdersPerDay: 20, avgOrderValue: 25, commissionPct: 20 },
  },

  // Hours (used for open/closed status) - hour values are 24h local time
  hours: [
    { day: "Sunday", open: 11, close: 16 },
    { day: "Monday", open: null, close: null },
    { day: "Tuesday", open: 11, close: 21 },
    { day: "Wednesday", open: 11, close: 21 },
    { day: "Thursday", open: 11, close: 21 },
    { day: "Friday", open: 11, close: 21 },
    { day: "Saturday", open: 12, close: 20 },
  ] as { day: string; open: number | null; close: number | null }[],

  // Home page text sections
  home: {
    heroHeadline: "Bold Southern flavors",
    heroSubHeadline: "juicy wings, and stacked sandwiches",
    heroSlides: [
      {
        image: "/general/generalPages/mainImage.jpg",
        headline: "Bold Southern Flavors",
        subheadline: "juicy wings, and stacked sandwiches",
        ctaLabel: "Order Now",
        ctaHref: "/Menu",
      },
      {
        image: "/general/generalPages/enjoy.jpg",
        headline: "Now Booking Catering",
        subheadline: "Feeding a crowd? We've got you covered for any event.",
        ctaLabel: "See Catering",
        ctaHref: "/catering",
      },
      {
        image: "/general/generalPages/vibe.jpg",
        headline: "Earn Every Time You Order",
        subheadline: "Join Southern Jerks Rewards and start racking up perks.",
        ctaLabel: "Join Rewards",
        ctaHref: "/rewards",
      },
    ] as { image: string; headline: string; subheadline: string; ctaLabel: string; ctaHref: string }[],
    galleryTitle: "Southern Jerks®",
    gallerySubtitle: "Quiet Mouth. Loud Flavor.",
    distinctiveFeatures: [
      {
        title: "Only flavor that hits",
        description:
          "From juicy wings to stacked sandwiches, every dish is made with care, quality ingredients, and big Southern flavor.",
        image: "/general/generalPages/enjoy.jpg",
      },
      {
        title: "Bite, chill, and enjoy",
        description:
          "Our dishes are made to elevate your experience, using quality ingredients, balanced seasoning, and bold flavor in every bite.",
        image: "/general/generalPages/vibe.jpg",
      },
    ],
    featuring: [
      { name: "Takeaway", icon: "PiPackageFill" },
      { name: "Family friendly", icon: "MdOutlineFamilyRestroom" },
      { name: "Catering", icon: "BsBagCheckFill" },
      { name: "Gluten-Free Options", icon: "TbPlant2Off" },
    ],
    faq: [
      {
        question: "What are you known for?",
        answer:
          "We're known for our crispy jerk chicken, wings, and bold southern flavors.",
      },
      {
        question: "What meals do you serve?",
        answer: "Chicken wings, sandwiches, Southern sides, and snacks.",
      },
      {
        question: "Do you offer delivery or takeout?",
        answer: "Yes! We offer both pickup and delivery.",
      },
      {
        question: "Where are you located?",
        answer: "We are located at 2950 Gears Rd, Houston, TX 77067.",
      },
    ],
  },

  // Which optional sections are enabled (see FEATURES above)
  features: FEATURES,

  // Product tier - gates site + admin sections (see PACKAGE_TIER above).
  packageTier: PACKAGE_TIER,

  // Navbar links (derived from FEATURES + tier)
  navLinks: ALL_NAV_LINKS.filter(enabled).map(pickLink),

  // Footer
  footer: {
    get copyright() {
      return `© ${new Date().getFullYear()} Southern Jerk Co LLC. All rights reserved.`;
    },
    links: ALL_FOOTER_LINKS.filter(enabled).map(pickLink),
  },
};

export type SiteConfig = typeof SITE_CONFIG;
