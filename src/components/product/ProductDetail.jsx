"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, onSnapshot } from "../../lib/db";
import { ArrowLeft, Clock, Heart, Leaf, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { db } from "../../lib/firebase";
import { CATEGORIES, formatPrice } from "../../lib/config";
import { getGallery, getRelatedProducts, isSoldOut, optionPrice } from "../../lib/product";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { useSettings } from "../../context/SettingsContext";
import ProductCard from "./ProductCard";
import RichText from "./RichText";
import { HeartDoodle } from "../ui/Decor";

export default function ProductDetail({ initialProduct }) {
  const [product, setProduct] = useState(initialProduct);
  const { products } = useProducts();
  const { addItem } = useCart();
  const { deliveryTime } = useSettings();
  const gallery = getGallery(product);
  const [active, setActive] = useState(0);
  const [option, setOption] = useState(product.options?.[0]?.name || "");
  const [quantity, setQuantity] = useState(1);

  // Keep price and stock live while the page is open.
  useEffect(() => {
    return onSnapshot(
      doc(db, "products", initialProduct.id),
      (snap) => snap.exists() && setProduct({ id: snap.id, ...snap.data() }),
      () => {}
    );
  }, [initialProduct.id]);

  const soldOut = isSoldOut(product);
  const price = optionPrice(product, option);
  const category = CATEGORIES.find((c) => c.slug === product.category);
  const related = getRelatedProducts(products, product, 4);

  return (
    <div className="container py-8 md:py-12">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest">
        <ArrowLeft size={15} /> Back to menu
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-14">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-[32px] bg-mint shadow-[0_30px_60px_-30px_rgba(11,63,41,.5)]">
            <img src={gallery[active] || product.image} alt={product.title} className="h-full w-full object-cover" />
            <HeartDoodle className="absolute right-5 top-5 h-8 w-8 text-white drop-shadow" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  className={`h-20 w-20 overflow-hidden rounded-2xl ring-2 transition ${active === i ? "ring-honey" : "ring-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:py-4">
          {category && (
            <Link href={`/products?category=${category.slug}`} className="eyebrow hover:underline">
              {category.name}
            </Link>
          )}
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight tracking-tight text-forest-deep md:text-5xl">{product.title}</h1>
          <p className="mt-3 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-forest">{formatPrice(price)}</span>
            {product.compareAtPrice > product.price && !option && <span className="text-muted line-through">{formatPrice(product.compareAtPrice)}</span>}
          </p>
          {product.description && <p className="mt-4 text-muted">{product.description}</p>}

          {product.options?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">Choose a size</p>
              <div className="flex flex-wrap gap-2">
                {product.options.map((o) => (
                  <button
                    key={o.name}
                    onClick={() => setOption(o.name)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      option === o.name ? "bg-forest text-white" : "bg-white ring-1 ring-line hover:ring-forest"
                    }`}
                  >
                    {o.name} · {formatPrice(o.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full bg-white ring-1 ring-line">
              <button className="grid h-12 w-12 place-items-center" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button className="grid h-12 w-12 place-items-center" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
            <button disabled={soldOut} onClick={() => addItem(product, { option, quantity })} className="btn-honey flex-1 py-3.5 sm:flex-none sm:px-10">
              <ShoppingCart size={17} /> {soldOut ? "Sold out" : `Add to cart · ${formatPrice(price * quantity)}`}
            </button>
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-3 rounded-3xl bg-white p-4 text-center text-xs text-muted">
            {[
              [Leaf, "Fresh ingredients"],
              [Heart, "Made from scratch"],
              [Star, "Premium quality"],
            ].map(([Icon, label]) => (
              <li key={label} className="flex flex-col items-center gap-1.5">
                <Icon size={20} className="text-forest" /> {label}
              </li>
            ))}
          </ul>
          {deliveryTime && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              <Clock size={15} className="text-honey-deep" /> {deliveryTime}
            </p>
          )}

          {product.longDescription && (
            <section className="mt-8 border-t border-line pt-6">
              <h2 className="mb-3 font-display text-lg font-bold">About this bake</h2>
              <RichText text={product.longDescription} />
            </section>
          )}
          {product.ingredients && (
            <section className="mt-6 border-t border-line pt-6">
              <h2 className="mb-3 font-display text-lg font-bold">Ingredients & allergens</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{product.ingredients}</p>
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold md:text-3xl">
            You may also <span className="font-script font-normal text-forest">love</span>
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
