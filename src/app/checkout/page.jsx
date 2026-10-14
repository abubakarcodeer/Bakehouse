"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "../../lib/db";
import { Check } from "lucide-react";
import { db } from "../../lib/firebase";
import { formatPrice } from "../../lib/config";
import { CITIES, COUNTRY, normalizePkPhone, PROVINCES } from "../../data/pakistan";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const EMPTY = { firstName: "", lastName: "", email: "", phone: "", address: "", city: "", province: "", postalCode: "", notes: "" };

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [checkoutRef, setCheckoutRef] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    setForm((f) => ({
      ...f,
      email: f.email || currentUser.email || "",
      firstName: f.firstName || userProfile?.firstName || "",
      lastName: f.lastName || userProfile?.lastName || "",
    }));
  }, [currentUser, userProfile]);

  useEffect(() => {
    const hasData = form.phone || form.firstName || form.address;
    if (!hasData || orderId) return;

    const timer = setTimeout(async () => {
      const phone = normalizePkPhone(form.phone) || form.phone;
      const data = {
        customer: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim().toLowerCase(),
        phone,
        shipping: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          province: form.province,
          postalCode: form.postalCode.trim(),
        },
        items: items.map(({ id, title, price, option, quantity, image }) => ({ id, title, price, option, quantity, image })),
        total,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      try {
        if (checkoutRef) {
          await setDoc(checkoutRef, { ...data, createdAt: undefined }, { merge: true });
        } else {
          const res = await addDoc(collection(db, "checkouts"), data);
          setCheckoutRef(doc(db, "checkouts", res.id));
        }
      } catch (err) {
        console.warn("Failed to save draft checkout:", err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [form, items, total, orderId, checkoutRef]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function placeOrder(e) {
    e.preventDefault();
    const phone = normalizePkPhone(form.phone);
    if (!phone) return addToast("Enter a valid Pakistani mobile number, e.g. 0300 1234567", "error");
    if (!PROVINCES.includes(form.province)) return addToast("Please select your province", "error");
    setBusy(true);
    try {
      // Shape matches the validation in firestore.rules (customer, +92 phone, Pakistan address, items, total, status: Pending).
      const ref = await addDoc(collection(db, "orders"), {
        customer: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim().toLowerCase(),
        phone,
        shipping: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone,
          address: form.address.trim(),
          city: form.city.trim(),
          province: form.province,
          postalCode: form.postalCode.trim(),
          country: COUNTRY,
        },
        notes: form.notes.trim(),
        items: items.map(({ id, title, price, option, quantity, image }) => ({ id, title, price, option, quantity, image })),
        subtotal,
        shippingCost: shipping,
        total,
        paymentMethod: "Cash on Delivery",
        status: "Pending",
        userId: currentUser?.uid || null,
        createdAt: serverTimestamp(),
      });
      setOrderId(ref.id);

      clearCart();

      // Remove abandoned checkout record if it exists
      if (checkoutRef) {
        try {
          const { deleteDoc } = await import("../../lib/db");
          await deleteDoc(checkoutRef);
        } catch (e) {
          console.warn("Failed to clean up checkout draft:", e);
        }
      }

      // Fire-and-forget admin notification; the order is already saved if this fails.
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: {
            id: ref.id,
            customer: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            phone,
            address: [form.address, form.city, form.province, form.postalCode, COUNTRY].filter(Boolean).join(", "),
            items: items.map((i) => `${i.quantity} × ${i.title}${i.option ? ` (${i.option})` : ""}`).join("\n"),
            total: formatPrice(total),
          },
        }),
      }).catch((err) => console.warn("Order email notification failed:", err));
    } catch (err) {
      console.error("Order failed:", err);
      addToast("We could not place your order. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  if (orderId) {
    return (
      <div className="container flex flex-col items-center py-28 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-forest text-white">
          <Check size={26} />
        </span>
        <h1 className="mt-6 font-display text-4xl md:text-5xl">Thank you!</h1>
        <p className="mt-3 text-muted">
          Your order <b className="text-ink">#{orderId.slice(0, 8).toUpperCase()}</b> has been placed. Our team will call or WhatsApp you to confirm, then it goes straight into the oven. Please keep cash ready on delivery.
        </p>
        <Link href="/products" className="btn-dark mt-8">
          Order something else
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-28 text-center">
        <h1 className="font-display text-4xl">Your cart is empty</h1>
        <Link href="/products" className="btn-dark mt-8">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <h1 className="font-display text-4xl font-extrabold text-forest-deep md:text-5xl">Checkout</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <form id="checkout" onSubmit={placeOrder} className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="mb-4 text-lg font-semibold">Contact</legend>
            {!currentUser && (
              <p className="text-sm text-muted">
                Have an account? <Link href="/login" className="text-ink link-underline">Sign in</Link>
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="tel" required inputMode="tel" placeholder="Mobile number (03XX XXXXXXX)" className="field" value={form.phone} onChange={set("phone")} />
              <input type="email" placeholder="Email (optional)" className="field" value={form.email} onChange={set("email")} />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-4 text-lg font-semibold">Delivery Address</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required minLength={2} placeholder="First name" className="field" value={form.firstName} onChange={set("firstName")} />
              <input required placeholder="Last name" className="field" value={form.lastName} onChange={set("lastName")} />
            </div>
            <input required minLength={8} placeholder="House / street / area" className="field" value={form.address} onChange={set("address")} />
            <div className="grid gap-4 sm:grid-cols-3">
              <select required className="field" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value, city: "" })}>
                <option value="">Province</option>
                {PROVINCES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <input required list="pk-cities" placeholder="City" className="field" value={form.city} onChange={set("city")} />
              <datalist id="pk-cities">
                {(CITIES[form.province] || Object.values(CITIES).flat()).map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <input inputMode="numeric" pattern="\d{5}" title="5-digit postal code" placeholder="Postal code (optional)" className="field" value={form.postalCode} onChange={set("postalCode")} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-sm">
              <span className="text-muted">Country</span>
              <span className="font-semibold">🇵🇰 {COUNTRY}</span>
            </div>
            <textarea rows={2} placeholder="Delivery notes (optional), e.g. nearest landmark" className="field" value={form.notes} onChange={set("notes")} />
          </fieldset>

          <fieldset>
            <legend className="mb-4 text-lg font-semibold">Payment</legend>
            <label className="flex items-center gap-3 rounded-2xl border border-forest bg-white p-4 text-sm">
              <input type="radio" checked readOnly className="accent-forest" />
              <span>
                <b>Cash on Delivery</b>
                <span className="block text-xs text-muted">Pay in cash when your order arrives.</span>
              </span>
            </label>
          </fieldset>
        </form>

        <aside className="h-fit rounded-[28px] bg-white p-6 shadow-[0_20px_40px_-30px_rgba(11,63,41,.5)] lg:sticky lg:top-28">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <ul className="mt-5 space-y-4">
            {items.map((i) => (
              <li key={`${i.id}${i.option}`} className="flex gap-3 text-sm">
                <div className="relative shrink-0">
                  <img src={i.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-forest text-[10px] text-white">{i.quantity}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{i.title}</p>
                  <p className="text-xs text-muted">{i.option}</p>
                </div>
                <p>{formatPrice(i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{shipping ? formatPrice(shipping) : "Free"}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          <button form="checkout" disabled={busy} className="btn-honey mt-6 w-full">
            {busy ? "Placing order…" : `Place Order · ${formatPrice(total)}`}
          </button>
        </aside>
      </div>
    </div>
  );
}
