"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { formatPrice } from "../../lib/config";
import { isSoldOut } from "../../lib/product";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const soldOut = isSoldOut(product);
  const onSale = product.compareAtPrice > product.price;

  return (
    <div className="group flex flex-col rounded-3xl bg-white p-2 shadow-[0_12px_30px_-20px_rgba(11,63,41,.5)] transition hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden rounded-[20px] bg-mint">
        <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.bestseller && <span className="rounded-full bg-honey px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink">Bestseller</span>}
          {onSale && <span className="rounded-full bg-forest px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Sale</span>}
          {soldOut && <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Sold out</span>}
        </div>
      </Link>
      <div className="flex flex-1 items-end gap-3 px-2 pb-2 pt-3">
        <div className="min-w-0 flex-1">
          <Link href={`/products/${product.id}`} className="block truncate font-display text-sm font-bold hover:text-forest md:text-base">
            {product.title}
          </Link>
          <p className="mt-0.5 text-sm">
            <span className="font-semibold text-forest">{product.options?.length > 1 ? "From " : ""}{formatPrice(product.price)}</span>
            {onSale && <span className="ml-2 text-xs text-muted line-through">{formatPrice(product.compareAtPrice)}</span>}
          </p>
        </div>
        <button
          onClick={() => addItem(product)}
          disabled={soldOut}
          aria-label={`Add ${product.title} to cart`}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-honey text-ink transition hover:bg-forest hover:text-white disabled:opacity-40"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
