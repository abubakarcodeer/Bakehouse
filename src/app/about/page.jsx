import Link from "next/link";
import { ArrowRight, Heart, Leaf, Star, Wheat } from "lucide-react";
import PageIntro from "../../components/ui/PageIntro";
import { HeartDoodle, LeafDoodle } from "../../components/ui/Decor";
import { IMAGES } from "../../data/images";
import { STORE_FULL_NAME } from "../../lib/config";

export const metadata = {
  title: "About Us",
  description: "Our story: fresh, wholesome bakes made from scratch with premium ingredients and a whole lot of love.",
};

const VALUES = [
  { icon: Leaf, title: "Fresh ingredients", text: "Real butter, free-range eggs and single-origin chocolate. Nothing artificial, ever." },
  { icon: Heart, title: "Homemade taste", text: "Small batches, family recipes and hands that have shaped dough for years." },
  { icon: Star, title: "Premium quality", text: "Every tray is checked before it leaves the kitchen. If it is not perfect, it stays." },
  { icon: Wheat, title: "Baked daily", text: "Our ovens are on before sunrise so your order is as fresh as it gets." },
];

export default function AboutPage() {
  return (
    <>
      <section className="container grid items-center gap-10 py-10 md:grid-cols-2 md:py-16">
        <PageIntro eyebrow="Our Story" title="Baked with" accent="Love">
          <p>
            {STORE_FULL_NAME} started with one oven, one recipe book and a simple belief: everyone deserves a bake that tastes like home. Since our first loaf came
            out of the oven, we have been dedicated to bringing you fresh, wholesome, and delicious baked goods.
          </p>
          <p className="mt-3">Every recipe is made from scratch using premium ingredients and lots of love, from our signature chocolate cookies to celebration cakes.</p>
          <Link href="/products" className="btn-honey mt-6">
            Explore the menu <ArrowRight size={16} />
          </Link>
        </PageIntro>
        <div className="relative">
          <div className="absolute -right-6 -top-6 h-3/4 w-3/4 rounded-[42%_58%_40%_60%/50%_45%_55%_50%] bg-forest" />
          <img src={IMAGES.about} alt="Inside the bakery" className="relative aspect-[4/3] w-full rounded-[32px] object-cover shadow-xl" />
          <HeartDoodle className="absolute -bottom-6 left-6 h-10 w-10 text-honey" />
        </div>
      </section>

      <section className="bg-forest py-14 text-white">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-extrabold md:text-4xl">
            What we <span className="font-script font-normal text-honey">believe in</span>
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-honey text-ink">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm text-white/75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container grid items-center gap-10 py-14 md:grid-cols-2">
        <img src={IMAGES.bakery} alt="Fresh pastries on display" className="aspect-[4/3] w-full rounded-[32px] object-cover" />
        <div>
          <h2 className="font-display text-3xl font-extrabold text-forest-deep md:text-4xl">Come visit the bakery</h2>
          <p className="mt-3 text-muted">Grab a coffee and a warm cookie, or book a table for birthdays, catch-ups and slow Sunday mornings.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/book-a-table" className="btn-dark">
              Book a Table
            </Link>
            <Link href="/contact" className="btn-outline">
              Contact us
            </Link>
          </div>
          <LeafDoodle className="mt-6 h-10 w-10 text-honey" />
        </div>
      </section>
    </>
  );
}
