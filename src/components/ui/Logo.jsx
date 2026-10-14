import Link from "next/link";
import { STORE_DOMAIN, STORE_NAME } from "../../lib/config";

// Wheat sprig from the brand logo, drawn as SVG so it stays crisp at any size.
export function LogoMark({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="currentColor">
      <path d="M16 31V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="16" cy="6" rx="2.6" ry="5" />
      <ellipse cx="11" cy="12" rx="2.4" ry="4.6" transform="rotate(-38 11 12)" />
      <ellipse cx="21" cy="12" rx="2.4" ry="4.6" transform="rotate(38 21 12)" />
      <ellipse cx="11" cy="19" rx="2.4" ry="4.6" transform="rotate(-38 11 19)" />
      <ellipse cx="21" cy="19" rx="2.4" ry="4.6" transform="rotate(38 21 19)" />
    </svg>
  );
}

const SIZES = {
  sm: { mark: "h-3.5 w-3.5", name: "text-[15px]", script: "text-[17px] -mt-1.5" },
  md: { mark: "h-4 w-4 md:h-5 md:w-5", name: "text-[19px] md:text-[25px]", script: "text-[21px] md:text-[28px] -mt-2 md:-mt-2.5" },
  lg: { mark: "h-5 w-5", name: "text-[24px]", script: "text-[26px] -mt-2" },
};

export default function Logo({ light = false, size = "md", href = "/" }) {
  const s = SIZES[size];
  return (
    <Link href={href} aria-label={`${STORE_NAME} ${STORE_DOMAIN} home`} className="inline-flex flex-col items-start leading-none">
      <LogoMark className={`mb-0.5 ml-[38%] ${light ? "text-white" : "text-forest"} ${s.mark}`} />
      <span className={`font-sans font-extrabold tracking-[0.01em] ${light ? "text-white" : "text-forest-deep"} ${s.name}`}>{STORE_NAME}</span>
      <span className={`ml-[30%] -rotate-3 font-script font-bold ${light ? "text-white" : "text-honey-ink"} ${s.script}`}>{STORE_DOMAIN}</span>
    </Link>
  );
}
