// Single source of truth for every brand-specific value on the site.
// To onboard a new restaurant client, this is the only file that should
// need to change (plus swapping image assets in /public).

export const SITE_CONFIG = {
  // Brand
  name: "Southern Jerks",
  tagline: "Bold Caribbean flavors, juicy wings, and stacked sandwiches",
  subTagline:
    "perfectly seasoned, and packed with flavor made fresh so every bite hits just right.",
  legalName: "Southern Jerk Co LLC",
  trademark: "Southern Jerks®",

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
  seoTitle: "Southern Jerks | Jerk Chicken, Wings & Caribbean Food in Houston",
  seoDescription:
    "Southern Jerks serves bold jerk chicken, crispy wings, loaded fries, and stacked sandwiches in Houston, TX.",
  seoKeywords: [
    "jerk chicken Houston",
    "jerk wings Houston",
    "Caribbean restaurant Houston",
    "fried chicken Houston",
    "family restaurant Houston",
    "Southern Jerks Houston",
  ],
  ogImage: "/general/generalPages/mainImage.jpg",

  // Colors (Tailwind hex values)
  primaryColor: "#c85a1e",
  secondaryColor: "#1a6b3c",
  accentColor: "#d97706",

  // Hours (used for open/closed status) — hour values are 24h local time
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
    heroHeadline: "Bold Caribbean flavors",
    heroSubHeadline: "juicy wings, and stacked sandwiches",
    galleryTitle: "Southern Jerks®",
    gallerySubtitle: "Quiet Mouth. Loud Flavor.",
    distinctiveFeatures: [
      {
        title: "Only flavor that hits",
        description:
          "From juicy wings to stacked sandwiches, every dish is made with care, quality ingredients, and big Caribbean flavor.",
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
        answer: "Chicken wings, sandwiches, Caribbean sides, and snacks.",
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

  // Navbar links
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/Menu" },
    { label: "Catering", href: "/catering" },
    { label: "Gift Card", href: "/GiftCard" },
    { label: "Kids Zone", href: "/KidsZone" },
    { label: "Rewards", href: "/rewards" },
    { label: "Press", href: "/Blog" },
    { label: "Our Story", href: "/story" },
  ],

  // Footer
  footer: {
    get copyright() {
      return `© ${new Date().getFullYear()} Southern Jerk Co LLC. All rights reserved.`;
    },
    links: [
      { label: "Menu", href: "/Menu" },
      { label: "Catering", href: "/catering" },
      { label: "Gift Cards", href: "/GiftCard" },
      { label: "Terms", href: "/terms" },
    ],
  },
};

export type SiteConfig = typeof SITE_CONFIG;
