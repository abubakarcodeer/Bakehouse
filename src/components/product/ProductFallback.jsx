"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "../../lib/db";
import { db } from "../../lib/firebase";
import ProductDetail from "./ProductDetail";

// The server had no copy of this product (just created, or local demo data): load it in the browser.
export default function ProductFallback({ id }) {
  const [state, setState] = useState({ loading: true, product: null });

  useEffect(() => {
    getDoc(doc(db, "products", id))
      .then((snap) => setState({ loading: false, product: snap.exists() && snap.data().isActive !== false ? { id: snap.id, ...snap.data() } : null }))
      .catch(() => setState({ loading: false, product: null }));
  }, [id]);

  if (state.loading) return <div className="container py-32 text-center text-muted">Loading…</div>;
  if (state.product) return <ProductDetail initialProduct={state.product} />;

  return (
    <div className="container py-32 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">404</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold text-forest-deep">This tray is empty</h1>
      <p className="mt-3 text-muted">We couldn’t find that bake. It may have sold out for good.</p>
      <Link href="/products" className="btn-dark mt-8">
        Back to the menu
      </Link>
    </div>
  );
}
