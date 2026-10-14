import { SwirlDoodle } from "./Decor";

// Heading block for inner pages: honey script eyebrow, bold title, optional intro text.
export default function PageIntro({ eyebrow, title, accent, children, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="font-script text-2xl text-honey md:text-3xl">{eyebrow}</p>}
      <h1 className="mt-1 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-forest-deep md:text-6xl">
        {title} {accent && <span className="text-ink">{accent}</span>}
      </h1>
      <SwirlDoodle className={`mt-2 h-6 w-16 text-forest/50 ${center ? "mx-auto" : ""}`} />
      {children && <div className="mt-4 text-muted">{children}</div>}
    </div>
  );
}
