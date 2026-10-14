"use client";

import Link from "next/link";
import { ArrowRight, Heart, Leaf, Star } from "lucide-react";
import { CookieDoodle, HeartDoodle, PaintCircle, SparkDoodle, SprigDoodle, SquiggleDoodle, Underline } from "../ui/Decor";
import { IMAGES } from "../../data/images";
import { STORE_FULL_NAME } from "../../lib/config";
import { useSettings } from "../../context/SettingsContext";

const FEATURES = [
  { icon: Leaf, label: "Fresh\nIngredients" },
  { icon: Heart, label: "Homemade\nTaste" },
  { icon: Star, label: "Premium\nQuality" },
];

// Right-hand artwork, laid out on a 640×800 canvas measured from the design and scaled as one piece.
function HeroArt({ image }) {
  return (
    <div className="absolute left-0 top-0 h-[800px] w-[640px] origin-top-left scale-[0.36] sm:scale-[0.5] md:scale-[0.7] lg:scale-100">
      {/* Green shape wrapping the top-right corner */}
      <div className="absolute left-[95px] top-[-110px] h-[730px] w-[910px] rounded-[50%] bg-forest" />
      <PaintCircle id="hero-paint" className="absolute left-[-66px] top-[150px] h-[340px] w-[340px] text-honey" />

      {/* Stone plate under the stack */}
      <div className="absolute left-[46px] top-[682px] h-[86px] w-[500px] rounded-[50%] bg-[#BDB3A1] shadow-[0_26px_40px_-14px_rgba(0,0,0,.45)]" />
      <div className="absolute left-[46px] top-[668px] h-[86px] w-[500px] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_35%,#F4F0E8_0%,#E4DDD0_62%,#CFC6B6_100%)]" />
      <img src={image} alt="A stack of chocolate chip cookies with melted chocolate pouring over them" className="absolute left-[96px] top-[6px] h-[722px] w-[400px] object-contain object-bottom drop-shadow-[0_20px_20px_rgba(0,0,0,.22)]" />
      {/* Front lip of the plate, drawn over the base of the stack so it sits on the plate */}
      <div className="absolute left-[46px] top-[668px] h-[86px] w-[500px] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_20%,#F7F4EE_0%,#E6DFD3_60%,#D3CABA_100%)] [clip-path:inset(54%_0_0_0)]" />

      <p className="absolute left-[392px] top-[46px] -rotate-[9deg] font-script text-[38px] font-medium leading-[1.05] text-white">
        Life is better
        <br />
        <span className="pl-7">with cookies</span>
      </p>
      <HeartDoodle className="absolute left-[505px] top-[150px] h-[34px] w-[38px] text-white" strokeWidth={2.2} />
      <SparkDoodle className="absolute left-[368px] top-[70px] h-[14px] w-[14px] text-honey" />
      <SquiggleDoodle className="absolute left-[540px] top-[262px] h-[56px] w-[40px] text-honey" />
      <SprigDoodle className="absolute hidden sm:block left-[-58px] top-[452px] h-[74px] w-[56px] text-ink/30" />
      <CookieDoodle className="absolute hidden sm:block left-[-112px] top-[566px] h-[66px] w-[74px] text-ink/80" />
    </div>
  );
}

export default function Hero() {
  const { heroEyebrow, heroTitle, heroSubtitle, heroImage } = useSettings();
  const [firstLine, ...rest] = String(heroTitle).split("\n");

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-2 top-0 h-[288px] w-[230px] sm:right-0 sm:h-[400px] sm:w-[320px] md:h-[560px] md:w-[448px] lg:h-[800px] lg:w-[640px]">
        <HeroArt image={heroImage || IMAGES.hero} />
      </div>

      {/* Bottom corner shapes */}
      <div className="absolute -bottom-16 -right-20 hidden h-36 w-[330px] -rotate-[14deg] rounded-[50%] bg-forest lg:block" />
      <div className="absolute -bottom-20 -left-24 hidden h-40 w-64 rounded-[50%] bg-mint lg:block" />

      <div className="container relative pb-10 pt-3 sm:pt-8 lg:min-h-[800px] lg:pb-16 lg:pt-[70px]">
        <div className="relative z-10 max-w-[230px] sm:max-w-[360px] md:max-w-[440px] lg:max-w-[560px]">
          <p className="relative inline-block -rotate-[4deg] font-script text-[25px] font-semibold leading-none text-honey-deep sm:text-[36px] lg:text-[52px]">
            {heroEyebrow}
            <Underline className="absolute -bottom-1 right-0 h-2 w-[52%] text-honey-deep lg:-bottom-2 lg:h-3" strokeWidth={2} />
          </p>
          <h1 className="mt-1.5 font-sans text-[27px] font-extrabold leading-[1.12] tracking-[-0.02em] text-forest-deep sm:text-[44px] md:text-[54px] lg:mt-3 lg:text-[76px]">
            {firstLine}
            {rest.length > 0 && (
              <>
                <br />
                <span className="lg:text-ink">{rest.join(" ")}</span>
              </>
            )}
          </h1>
          <p className="mt-3 max-w-[168px] text-[10.5px] leading-[1.6] text-ink/75 sm:max-w-sm sm:text-sm md:text-base lg:mt-6 lg:max-w-[400px] lg:text-[18px] lg:leading-[1.75]">
            At <b className="font-bold text-forest-deep">{STORE_FULL_NAME}</b>, {heroSubtitle}
          </p>
          <Link href="/products" className="btn-honey mt-4 h-9 gap-2 px-4 py-0 text-[11px] sm:h-11 sm:text-sm lg:mt-8 lg:h-[60px] lg:gap-4 lg:px-9 lg:text-[17px]">
            Order Now <ArrowRight className="h-3.5 w-3.5 lg:h-[18px] lg:w-[18px]" strokeWidth={2.4} />
          </Link>
        </div>

        <ul className="relative z-10 mt-9 grid grid-cols-3 lg:-ml-9 lg:mt-[64px] lg:flex">
          {FEATURES.map(({ icon: Icon, label }, i) => (
            <li key={label} className={`flex flex-col items-center gap-2 text-center lg:w-[170px] ${i ? "border-l border-ink/10" : ""}`}>
              <Icon className="h-6 w-6 text-forest lg:h-8 lg:w-8" strokeWidth={1.5} />
              <span className="whitespace-pre-line text-[11px] font-medium leading-snug text-ink/70 lg:text-[14px]">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
