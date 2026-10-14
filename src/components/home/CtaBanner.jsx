import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeartDoodle, SparkDoodle, SprigDoodle, Wave } from "../ui/Decor";
import { IMAGES } from "../../data/images";

export default function CtaBanner() {
  return (
    <section className="pt-2">
      <Wave className="h-6 text-forest lg:h-9" />
      <div className="relative overflow-hidden bg-forest text-white">
        <div className="container relative grid min-h-[210px] grid-cols-[1fr_40%] items-center lg:min-h-[190px] lg:grid-cols-[90px_1fr_auto_330px] lg:gap-8">
          <SprigDoodle className="hidden h-16 w-12 rotate-[30deg] text-honey lg:block" strokeWidth={2} />
          <div className="relative z-10 py-6 lg:py-0">
            <h2 className="whitespace-nowrap font-script text-[24px] font-medium leading-none lg:text-[44px]">Craving Something Sweet?</h2>
            <p className="mt-3 max-w-[190px] text-[11px] leading-relaxed text-white/85 lg:max-w-none lg:text-[15px]">
              Order now and enjoy the freshest bakes,
              <br /> delivered with love.
            </p>
            <Link href="/products" className="btn-honey mt-5 h-9 gap-2 px-5 py-0 text-[11px] lg:hidden">
              Order Now <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
          </div>
          <Link href="/products" className="btn-honey hidden h-[58px] px-9 py-0 text-[16px] lg:inline-flex">
            Order Now <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </Link>
          <div className="relative h-full self-stretch">
            <div className="absolute -bottom-12 -right-10 h-36 w-52 rounded-full bg-mint lg:hidden" />
            <img src={IMAGES.cta} alt="Chocolate chip cookies" className="absolute bottom-0 right-[-14px] w-[118%] max-w-none object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,.4)] lg:right-[-30px] lg:w-[280px]" />
            <HeartDoodle className="absolute left-[-6%] top-[18%] hidden h-7 w-8 text-honey lg:block lg:left-[-14%] lg:h-10 lg:w-11" strokeWidth={2.2} />
            <SparkDoodle className="absolute right-0 top-4 hidden h-6 w-6 text-white lg:block" />
            <SprigDoodle className="absolute bottom-6 left-[-30%] h-12 w-9 rotate-[25deg] text-honey lg:hidden" strokeWidth={2} />
          </div>
        </div>
      </div>
    </section>
  );
}
