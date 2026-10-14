"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import ProductCard from "./ProductCard";
import { SwirlDoodle } from "../ui/Decor";
import { CATEGORIES } from "../../lib/config";
import { useProducts } from "../../context/ProductContext";

export default function MenuView() {
  const { products } = useProducts();
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") || "";
  const q = params.get("q") || "";

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!term || [p.title, p.description, p.category].some((v) => String(v || "").toLowerCase().includes(term)))
    );
  }, [products, category, q]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(`/products${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const current = CATEGORIES.find((c) => c.slug === category);

  return (
    <div className="container py-10 md:py-14">
      <p className="eyebrow">Our Menu</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
        <span className="text-forest">{current ? current.name : "Fresh from"}</span> {current ? "" : "the Oven"}
      </h1>
      <SwirlDoodle className="mt-1 h-6 w-16 text-forest/50" />

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {[{ slug: "", name: "All" }, ...CATEGORIES].map((c) => (
            <button
              key={c.slug}
              onClick={() => setParam("category", c.slug)}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:text-sm ${
                category === c.slug ? "border-forest bg-forest text-white" : "border-line bg-white text-ink hover:border-forest-soft hover:bg-mint hover:text-forest"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setParam("q", new FormData(e.currentTarget).get("q")?.toString().trim());
          }}
          className="relative md:w-72"
        >
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input key={q} name="q" defaultValue={q} placeholder="Search the menu" className="field rounded-full pl-10" />
        </form>
      </div>

      {q && (
        <p className="mt-5 flex items-center gap-2 text-sm text-muted">
          {filtered.length} result{filtered.length === 1 ? "" : "s"} for <b className="text-ink">“{q}”</b>
          <button onClick={() => setParam("q", "")} className="grid h-6 w-6 place-items-center rounded-full hover:bg-mint" aria-label="Clear search">
            <X size={14} />
          </button>
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center">
          <p className="font-display text-xl font-bold">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted">Try another category or search.</p>
          <Link href="/products" className="btn-dark mt-6">
            See the full menu
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
