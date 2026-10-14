"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrushBlob, HeartDoodle, LeafDoodle, SparkDoodle, SprigDoodle, Underline, Wave } from "../ui/Decor";
import { IMAGES } from "../../data/images";
import { useSettings } from "../../context/SettingsContext";

export default function BakedWithLove() {
  const { storyTitle, storyText, storyImage } = useSettings();
  const [first, ...rest] = String(storyTitle).split(" ");
  const image = storyImage || IMAGES.story;

  return (
    <section className="py-4 lg:py-6">
      {/* Desktop: brush panel on the left, copy, cookie on the right */}
      <div className="container hidden grid-cols-[330px_1fr_320px] items-center gap-8 lg:grid">
        <div className="relative py-14">
          <div className="absolute -bottom-6 -top-6 left-[-100vw] right-[-40px] flex items-center">
            <div className="-mr-8 h-[86%] flex-1 bg-forest" />
            <BrushBlob id="story-blob" className="h-full w-[420px] text-forest" />
          </div>
          <h2 className="relative -rotate-[10deg] pl-6 font-script text-[64px] font-medium leading-[0.95] text-white">
            {first}
            <HeartDoodle className="ml-6 inline h-9 w-10 -translate-y-6 text-honey" strokeWidth={2.4} />
            <br />
            <span className="-ml-4">{rest.join(" ")}</span>
          </h2>
          <Underline className="relative ml-4 mt-2 h-4 w-[250px] -rotate-[8deg] text-honey" strokeWidth={3} />
        </div>

        <div className="pl-14">
          <p className="max-w-[380px] text-[15px] leading-[1.75] text-ink/75">{storyText}</p>
          <Link href="/about" className="btn-honey mt-6 h-[52px] px-8 py-0 text-[15px]">
            Our Story <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </Link>
        </div>

        <div className="relative h-[340px]">
          <div className="absolute right-[-6px] top-[14px] h-[130px] w-[150px] rounded-full bg-honey" />
          <img src={image} alt="A chocolate chip cookie with a bite taken out" className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,.22)]" />
          <SprigDoodle className="absolute -left-14 -top-4 h-20 w-14 -rotate-12 text-ink/25" />
          <LeafDoodle className="absolute -left-6 bottom-6 h-12 w-16 text-forest" />
        </div>
      </div>

      {/* Mobile: green card */}
      <div className="lg:hidden">
        <Wave className="h-5 text-forest" />
        <div className="relative overflow-hidden bg-forest px-5 pb-8 pt-3 text-white">
          <h2 className="relative inline-block font-script text-[32px] font-medium leading-none">
            {storyTitle}
            <Underline className="absolute -bottom-2 left-6 h-2 w-[85%] text-honey" strokeWidth={2.5} />
          </h2>
          <SparkDoodle className="absolute right-12 top-4 h-5 w-5 text-honey" />
          <HeartDoodle className="absolute right-5 top-3 h-6 w-7 rotate-12 text-white" />
          <div className="mt-5 grid grid-cols-[1fr_42%] items-end gap-3">
            <div>
              <p className="text-[11px] leading-[1.75] text-white/85">{storyText}</p>
              <Link href="/about" className="btn-honey mt-4 h-9 gap-2 px-4 py-0 text-[11px]">
                Our Story <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -bottom-10 -right-8 h-28 w-36 rounded-full bg-mint" />
              <img src={image} alt="" className="relative w-full object-contain drop-shadow-[0_14px_14px_rgba(0,0,0,.35)]" />
              <LeafDoodle className="absolute -bottom-1 -left-5 h-9 w-12 text-honey" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
