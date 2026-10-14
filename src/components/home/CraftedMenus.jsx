import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrushSwoosh, LeafDoodle, SwirlDoodle, Underline } from "../ui/Decor";
import { IMAGES } from "../../data/images";

const MOMENTS = [
  { title: "Sweet Treats", sub: "for Happy Moments", photo: IMAGES.moments.sweet, cutout: IMAGES.categories.cupcakes, tile: "bg-forest", href: "/products?category=cupcakes" },
  { title: "Fresh Bakes", sub: "for Your Cravings", photo: IMAGES.moments.fresh, cutout: IMAGES.categories.cookies, tile: "bg-tile-yellow", href: "/products?category=cookies" },
  { title: "Indulgent Desserts", sub: "for Special Days", photo: IMAGES.moments.indulgent, cutout: IMAGES.categories.doughnuts, tile: "bg-[#2E9CD3]", href: "/products?category=doughnuts" },
  { title: "Seasonal Specials", sub: "for Extra Joy", photo: IMAGES.moments.seasonal, cutout: IMAGES.categories.pastries, tile: "bg-tile-pink", href: "/products?category=pastries" },
];

const Arrow = ({ className = "" }) => (
  <span className={`grid shrink-0 place-items-center rounded-full bg-honey text-ink shadow-[0_6px_14px_-6px_rgba(227,150,20,.8)] transition group-hover:bg-forest group-hover:text-white ${className}`}>
    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
  </span>
);

export default function CraftedMenus() {
  return (
    <section className="container pb-12 pt-10 lg:pb-6 lg:pt-8">
      <div className="relative">
        <h2 className="relative flex flex-col lg:flex-row lg:items-end lg:gap-4">
          <span className="relative text-[21px] font-extrabold tracking-[-0.02em] text-ink lg:pl-14 lg:text-[40px]">
            <BrushSwoosh className="absolute -left-1 -top-3 hidden h-16 w-16 text-honey lg:block" />
            Crafted Menus
          </span>
          <span className="relative -mt-1 font-script text-[32px] font-bold leading-none text-forest-deep lg:mt-0 lg:-rotate-3 lg:pb-1 lg:text-[54px] lg:font-medium">
            for Every Moment
            <Underline className="absolute -bottom-2 left-[22%] h-2 w-[32%] text-forest-deep" strokeWidth={2} />
          </span>
        </h2>
        <p className="mt-4 max-w-[270px] text-[11px] leading-relaxed text-ink/75 lg:ml-14 lg:mt-5 lg:max-w-none lg:text-[14px]">
          From savory appetizers to indulgent desserts, every dish is made to tantalize your taste buds.
        </p>
        <SwirlDoodle className="absolute right-4 top-10 hidden h-12 w-28 text-ink/25 lg:block" />
        <LeafDoodle className="absolute right-0 top-12 h-10 w-14 rotate-[-30deg] text-honey lg:hidden" />
      </div>

      {/* Mobile: list rows */}
      <ul className="mt-6 lg:hidden">
        {MOMENTS.map((m) => (
          <li key={m.title} className="border-b border-ink/5 last:border-0">
            <Link href={m.href} className="group flex items-center gap-5 py-2.5">
              <span className={`grid h-[80px] w-[100px] shrink-0 place-items-center rounded-xl ${m.tile}`}>
                <img src={m.cutout} alt="" className="h-[82%] w-[82%] object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,.25)]" />
              </span>
              <span className="flex-1">
                <span className="block text-[13px] font-bold text-ink">{m.title}</span>
                <span className="mt-0.5 block text-[12px] text-ink/70">{m.sub}</span>
              </span>
              <Arrow className="h-8 w-8" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop: photo cards */}
      <div className="mt-8 hidden grid-cols-4 gap-6 lg:grid">
        {MOMENTS.map((m) => (
          <Link key={m.title} href={m.href} className="group overflow-hidden rounded-[18px] bg-white shadow-[0_16px_30px_-22px_rgba(0,0,0,.4)] transition hover:-translate-y-1">
            <div className="aspect-[2.15/1] overflow-hidden rounded-[18px]">
              <img src={m.photo} alt={m.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="flex items-center gap-3 px-5 py-5">
              <div className="flex-1 text-[13.5px] leading-snug text-ink">
                <p className="font-semibold">{m.title}</p>
                <p className="text-ink/75">{m.sub}</p>
              </div>
              <Arrow className="h-9 w-9" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
