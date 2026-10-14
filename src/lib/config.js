export const STORE_NAME = "HEARTHLY";
export const STORE_DOMAIN = "Bakehouse";
export const STORE_FULL_NAME = "Hearthly Bakehouse";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Fallbacks for settings/store; admins override these from /admin/settings.
export const DEFAULT_SETTINGS = {
  announcement: "",
  freeShippingThreshold: 3000,
  flatShipping: 200,
  heroEyebrow: "Freshly Baked",
  heroTitle: "Goodness\nin Every Bite",
  heroSubtitle: "we craft fresh, delicious baked goods using premium ingredients and a whole lot of love.",
  heroImage: "",
  storyTitle: "Baked with Love",
  storyText:
    "Since our first loaf came out of the oven, we've been dedicated to bringing you fresh, wholesome, and delicious baked goods. Every recipe is made from scratch using premium ingredients and lots of love.",
  storyImage: "",
  instagramUrl: "",
  facebookUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  contactEmail: "hello@hearthlybakehouse.com",
  contactPhone: "",
  whatsappNumber: "",
  address: "",
  openingHours: "Mon – Sun · 9:00 AM – 11:00 PM",
  deliveryTime: "Same-day delivery on orders before 6 PM",
};

// `tile` is the card colour used on the homepage menu grid.
export const CATEGORIES = [
  { slug: "cupcakes", name: "Cupcakes", tile: "bg-tile-green" },
  { slug: "cookies", name: "Cookies", tile: "bg-tile-yellow" },
  { slug: "doughnuts", name: "Doughnuts", tile: "bg-tile-sky" },
  { slug: "pastries", name: "Pastries", tile: "bg-tile-pink" },
  { slug: "cakes", name: "Cakes & Brownies", tile: "bg-honey-soft" },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products", children: CATEGORIES.map((c) => ({ href: `/products?category=${c.slug}`, label: c.name })) },
  { href: "/recipes", label: "Recipes" },
  { href: "/contact", label: "Contact" },
];

export const CURRENCY = "PKR";

export const LOW_STOCK_THRESHOLD = 5;

// Pakistani rupees, no paisa: Rs 2,490
export const formatPrice = (amount) => `Rs ${Math.round(Number(amount) || 0).toLocaleString("en-US")}`;
