// Placeholder photography (Unsplash licence, CC0 / public domain; see public/images/CREDITS.md). Swap for your own shoot from the dashboard.
const u = (id, w = 900, h) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80`;

// High-resolution cut-outs (transparent WebP) and card photos, in /public/images.
export const IMAGES = {
  hero: "/images/hero-stack.webp",
  story: "/images/story.webp",
  cta: "/images/cta.webp",
  categories: {
    cupcakes: "/images/cupcake.webp",
    cookies: "/images/cookies.webp",
    doughnuts: "/images/doughnut.webp",
    pastries: "/images/pastries.webp",
    cakes: u("photo-1606313564200-e75d5e30476c", 600, 600),
  },
  moments: {
    sweet: "/images/moment-1.webp",
    fresh: "/images/moment-2.webp",
    indulgent: "/images/moment-3.webp",
    seasonal: "/images/moment-4.webp",
  },
  about: u("photo-1517433670267-08bbd4be890f", 1200, 900),
  bakery: u("photo-1568254183919-78a4f43a2877", 1200, 900),
};

export { u as unsplash };
