"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../ui/Logo";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "../ui/SocialIcons";
import { Wave } from "../ui/Decor";
import { NAV_LINKS, STORE_FULL_NAME } from "../../lib/config";
import { useSettings } from "../../context/SettingsContext";

export default function Footer() {
  const settings = useSettings();
  // The homepage ends on the green "Craving something sweet?" band, so the footer joins it without a wave.
  const joined = usePathname() === "/";
  const socials = [
    { href: settings.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { href: settings.twitterUrl, label: "Twitter", Icon: TwitterIcon },
    { href: settings.instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { href: settings.youtubeUrl, label: "YouTube", Icon: YoutubeIcon },
  ];

  return (
    <footer className={`text-white ${joined ? "" : "mt-10"}`}>
      {!joined && <Wave className="h-8 text-forest-deep md:h-12" />}
      <div className="bg-forest-deep">
        <div className="container flex flex-col items-center gap-5 pb-6 pt-8 text-center">
          <Logo light size="sm" />

          <div className="flex gap-2.5">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href || "#"}
                target={href ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={label}
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-forest-deep transition hover:bg-honey"
              >
                <Icon />
              </a>
            ))}
          </div>

          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-medium sm:gap-x-7 sm:text-[12px]" aria-label="Footer">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-white/90 hover:text-honey">
                {l.label}
              </Link>
            ))}
          </nav>

          <p className="text-[11px] text-white/70">
            © {new Date().getFullYear()} {STORE_FULL_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
