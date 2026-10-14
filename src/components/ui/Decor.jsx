// Hand-drawn doodles and painted shapes from the design. All decorative, so hidden from screen readers.
const line = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" };

export const HeartDoodle = ({ className = "", strokeWidth = 2 }) => (
  <svg viewBox="0 0 40 36" className={className} aria-hidden="true">
    <path {...line} strokeWidth={strokeWidth} d="M20 32C9 24 4 18 4.5 11.5 5 7 8 4.2 12 4.4c3.4.2 6 2.6 8 6.2 2-3.8 4.8-6.4 8.4-6.4C32.6 4.3 35.6 7.4 35.4 12 35 18.6 29.6 24.4 20 32Z" />
  </svg>
);

// Leafy sprig drawn with a single line, as next to the Order Now button and story cookie.
export const SprigDoodle = ({ className = "", strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 48 60" className={className} aria-hidden="true">
    <path {...line} strokeWidth={strokeWidth} d="M24 58C23 44 25 30 30 4" />
    <path {...line} strokeWidth={strokeWidth} d="M25 42c-8-1-13-6-14-13 8 0 13 5 14 13ZM26 30c7-2 11-7 11-14-7 1-11 6-11 14ZM27 19c-6-2-9-7-8-13 6 1 9 6 8 13ZM24 50c6 1 11-2 13-8-6-1-11 2-13 8Z" />
  </svg>
);

// Three-leaf branch outline used at the bottom-left of the story cookie and CTA.
export const LeafDoodle = ({ className = "", strokeWidth = 1.8 }) => (
  <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
    <path {...line} strokeWidth={strokeWidth} d="M4 44C20 34 36 26 60 22" />
    <path {...line} strokeWidth={strokeWidth} d="M20 36c-2-10 2-18 10-22 3 9-1 17-10 22ZM34 29c0-10 6-17 15-19 1 9-5 16-15 19ZM14 40C6 36 2 29 4 22c8 3 11 10 10 18ZM28 32c-8 1-15-3-18-9 8-2 15 2 18 9ZM44 26c-7-3-11-9-10-16" />
  </svg>
);

// Honey "ℓ"-shaped squiggle on the green blob.
export const SquiggleDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 40 52" className={className} aria-hidden="true">
    <path {...line} strokeWidth={3.4} d="M8 6c4 6 4 14-1 20-4 5-2 12 5 12 8 0 14-7 13-14-1-6-8-6-10 0-2 7 3 18 18 24" />
  </svg>
);

// Line-art cookie with a bite, beside the hero plate.
export const CookieDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 64 56" className={className} aria-hidden="true">
    <path {...line} strokeWidth={2.2} d="M52 18c-4 1-8-2-8-6-4 1-8-2-8-6C22 4 8 14 6 28c-2 14 10 24 24 24 15 0 26-11 25-25-1-3-2-6-3-9Z" />
    <g fill="currentColor">
      <circle cx="20" cy="22" r="2.6" />
      <circle cx="32" cy="32" r="2.6" />
      <circle cx="18" cy="38" r="2.6" />
      <circle cx="40" cy="42" r="2.2" />
      <circle cx="28" cy="16" r="1.8" />
      <circle cx="58" cy="46" r="1.6" />
      <circle cx="61" cy="38" r="1.2" />
    </g>
  </svg>
);

// Loose loop, top-right of "Crafted Menus".
export const SwirlDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 100 44" className={className} aria-hidden="true">
    <path {...line} strokeWidth={2} d="M4 30c12-16 30-24 44-18 12 5 8 22-6 22-12 0-14-14-2-22 14-8 34-4 46 6 8 7 4 18-6 16" />
  </svg>
);

export const SparkDoodle = ({ className = "" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <path {...line} strokeWidth={2} d="M16 4v7M16 21v7M4 16h7M21 16h7M8 8l4 4M20 20l4 4M24 8l-4 4M12 20l-4 4" />
  </svg>
);

// Rough-edged painted circle (the honey disc behind the hero cookies and story cookie).
export const PaintCircle = ({ className = "", id = "paint" }) => (
  <svg viewBox="0 0 220 220" className={className} aria-hidden="true">
    <defs>
      <filter id={`${id}-rough`} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="14" />
      </filter>
    </defs>
    <g filter={`url(#${id}-rough)`} fill="currentColor">
      <circle cx="112" cy="112" r="96" />
      {/* dry-brush streaks off the top-left edge */}
      <path d="M30 70c20-40 60-62 104-60" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".9" />
      <path d="M18 96c14-46 52-74 96-78" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".75" />
      <path d="M14 122c6-36 26-62 54-80" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".6" />
    </g>
  </svg>
);

// Organic brush-edged blob (the green "Baked with Love" panel).
export const BrushBlob = ({ className = "", id = "blob" }) => (
  <svg viewBox="0 0 600 300" preserveAspectRatio="none" className={className} aria-hidden="true">
    <defs>
      <filter id={`${id}-rough`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="12" />
      </filter>
    </defs>
    <path
      filter={`url(#${id}-rough)`}
      fill="currentColor"
      d="M0 22C120 4 300 0 470 14c70 6 120 22 112 52-6 24-40 30-34 58 8 34 50 40 30 78-18 36-90 58-200 66C250 278 110 286 0 280Z"
    />
  </svg>
);

// Thick honey brush swoosh used as the icon in front of "Crafted Menus".
export const BrushSwoosh = ({ className = "" }) => (
  <svg viewBox="0 0 64 56" className={className} aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M12 48C14 30 28 14 58 8" strokeWidth="9" />
      <path d="M6 40C10 24 24 10 50 4" strokeWidth="3" opacity=".8" />
      <path d="M20 52C24 36 36 22 60 16" strokeWidth="3" opacity=".7" />
    </g>
  </svg>
);

// Thin hand-drawn underline.
export const Underline = ({ className = "", strokeWidth = 3 }) => (
  <svg viewBox="0 0 200 16" preserveAspectRatio="none" className={className} aria-hidden="true">
    <path {...line} strokeWidth={strokeWidth} d="M3 12C60 5 130 3 197 4" />
  </svg>
);

// Wavy edge for green bands; `flip` points the wave downward.
export const Wave = ({ className = "", flip = false }) => (
  <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className={`block w-full ${flip ? "rotate-180" : ""} ${className}`} aria-hidden="true">
    <path d="M0 34c120-22 260-30 400-14s260 26 420 10 300-34 440-22c80 7 140 18 180 26v26H0Z" fill="currentColor" />
  </svg>
);
