"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Logo from "../ui/Logo";
import { NAV_LINKS } from "../../lib/config";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";

function SearchBar({ onClose }) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/products${term.trim() ? `?q=${encodeURIComponent(term.trim())}` : ""}`);
        onClose();
      }}
      className="container flex items-center gap-3 py-3"
    >
      <Search size={18} className="text-muted" />
      <input autoFocus value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search cookies, cupcakes, doughnuts…" className="flex-1 bg-transparent py-2 text-sm outline-none" />
      <button type="button" onClick={onClose} aria-label="Close search" className="grid h-9 w-9 place-items-center rounded-full hover:bg-mint">
        <X size={18} />
      </button>
    </form>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { currentUser } = useAuth();
  const { announcement } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]));
  const iconBtn = "relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-mint hover:text-forest";

  return (
    <header className="relative z-40 bg-cream">
      {announcement && <p className="bg-forest px-4 py-2 text-center text-xs font-medium text-white">{announcement}</p>}

      <div className="container flex h-[76px] items-center gap-6 md:h-[104px]">
        <Logo />

        <nav className="mx-auto hidden items-center gap-11 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.href} className="group relative">
                <Link href={link.href} className={`flex items-center gap-1.5 text-[15px] transition hover:text-forest ${isActive(link.href) ? "font-bold text-forest-deep" : "font-medium text-ink/85"}`}>
                  {link.label} <ChevronDown size={15} strokeWidth={2.2} className="transition group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full w-52 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <ul className="rounded-2xl border border-line bg-white p-2 shadow-xl shadow-forest/5">
                    {link.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-xl px-3 py-2 text-sm hover:bg-mint hover:text-forest">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] transition hover:text-forest ${isActive(link.href) ? "font-bold text-forest-deep" : "font-medium text-ink/85"}`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button onClick={() => setSearchOpen((v) => !v)} className={`${iconBtn} hidden sm:grid`} aria-label="Search">
            <Search size={19} strokeWidth={2} />
          </button>
          <button onClick={() => setIsCartOpen(true)} className={iconBtn} aria-label={`Cart, ${itemCount} items`}>
            <ShoppingCart size={20} strokeWidth={1.8} />
            {itemCount > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-honey px-1 text-[10px] font-bold text-ink">{itemCount}</span>
            )}
          </button>
          <Link href="/book-a-table" className="btn-dark ml-6 hidden h-12 px-7 py-0 text-[14px] lg:inline-flex">
            Book a Table
          </Link>
          <button onClick={() => setMenuOpen(true)} className={`${iconBtn} lg:hidden`} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-line bg-white">
          <SearchBar onClose={() => setSearchOpen(false)} />
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="ml-auto flex h-full w-[85%] max-w-sm animate-slideIn flex-col bg-cream" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4">
              <Logo size="sm" />
              <button onClick={() => setMenuOpen(false)} className={iconBtn} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <div className="border-y border-line bg-white">
              <SearchBar onClose={() => setMenuOpen(false)} />
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="border-b border-line py-3">
                  <Link href={link.href} className={`block font-display text-xl font-bold ${isActive(link.href) ? "text-forest" : ""}`}>
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {link.children.map((c) => (
                        <Link key={c.href} href={c.href} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-forest ring-1 ring-line">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href={currentUser ? "/account" : "/login"} className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <User size={16} /> {currentUser ? "My account" : "Sign in"}
              </Link>
            </nav>
            <div className="p-5">
              <Link href="/book-a-table" className="btn-dark w-full">
                Book a Table
              </Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
