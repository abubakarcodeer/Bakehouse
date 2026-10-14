import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { SprigDoodle, Underline } from "../ui/Decor";
import { CATEGORIES } from "../../lib/config";
import { IMAGES } from "../../data/images";

// Homepage shows the first four categories, like the design.
const FEATURED = CATEGORIES.slice(0, 4).map((c) => ({ ...c, label: c.name }));

export default function MenuCategories() {
  return (
    <section className="container pb-12 pt-10 lg:pb-8 lg:pt-12">
      <div className="grid gap-3 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="relative">
          <p className="eyebrow">Our Menu</p>
          <h2 className="mt-2 text-[25px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[36px] lg:mt-3 lg:text-[52px]">
            <span className="block">
              <span className="text-forest-deep">Explore</span> <span className="text-ink lg:text-forest-deep">Our Delicious</span>
            </span>
            <span className="relative inline-block text-forest-deep lg:text-ink">
              Creations
              <Underline className="absolute -bottom-1.5 left-0 h-2 w-full text-honey lg:hidden" strokeWidth={2.5} />
            </span>
          </h2>
          <SprigDoodle className="mt-3 h-8 w-8 -rotate-90 text-ink/25 lg:hidden" />
        </div>
        <div className="-mt-10 ml-auto max-w-[190px] lg:ml-0 lg:mt-8 lg:max-w-none">
          <p className="text-[10px] leading-relaxed text-ink/70 sm:text-sm lg:text-[16px] lg:leading-[1.65]">
            From warm breads to delightful pastries, made with love and the finest ingredients.
          </p>
          <Link href="/products" className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-forest-deep sm:text-sm lg:mt-5 lg:text-[16px]">
            View All <span className="underline decoration-1 underline-offset-4">Products</span>
            <ArrowRight className="ml-2 h-3 w-3 lg:h-5 lg:w-5" strokeWidth={2} />
          </Link>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4 lg:mt-10 lg:grid-cols-4 lg:gap-6">
        {FEATURED.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className="group rounded-[18px] bg-white shadow-[0_16px_30px_-20px_rgba(0,0,0,.35)] transition hover:-translate-y-1 lg:rounded-[24px]"
          >
            <div className={`relative aspect-[16/15] rounded-[18px] lg:rounded-[24px] ${c.tile}`}>
              <img
                src={IMAGES.categories[c.slug]}
                alt={c.name}
                className="absolute inset-[11%] h-[78%] w-[78%] object-contain drop-shadow-[0_14px_14px_rgba(0,0,0,.28)] transition duration-500 group-hover:scale-105"
              />
              <span className="absolute -bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow-[0_4px_12px_rgba(0,0,0,.18)] transition group-hover:bg-honey lg:-bottom-4 lg:right-5 lg:h-[52px] lg:w-[52px]">
                <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" strokeWidth={2.4} />
              </span>
            </div>
            <p className="px-4 pb-4 pt-4 text-[13px] font-bold text-ink lg:px-6 lg:pb-6 lg:pt-6 lg:text-[18px]">{c.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
