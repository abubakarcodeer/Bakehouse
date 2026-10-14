"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useToast } from "./ToastContext";
import { usePersistedList } from "./usePersistedList";
import { useSettings } from "./SettingsContext";
import { optionPrice } from "../lib/product";

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const lineKey = (item) => `${item.id}|${item.option || ""}`;

const mergeCarts = (remote, local) => {
  const merged = remote.map((i) => ({ ...i }));
  for (const item of local) {
    const existing = merged.find((m) => lineKey(m) === lineKey(item));
    if (existing) existing.quantity = Math.max(existing.quantity, item.quantity);
    else merged.push(item);
  }
  return merged;
};

export function CartProvider({ children }) {
  const { addToast } = useToast();
  const [items, setItems] = usePersistedList("hearthly-cart", "cart", mergeCarts);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { freeShippingThreshold, flatShipping } = useSettings();

  const addItem = useCallback(
    (product, { option, quantity = 1 } = {}) => {
      const chosen = option || product.options?.[0]?.name || "";
      const line = {
        id: product.id,
        title: product.title,
        price: optionPrice(product, chosen),
        image: product.image,
        option: chosen,
        quantity,
      };
      setItems((current) => {
        const existing = current.find((i) => lineKey(i) === lineKey(line));
        if (existing) return current.map((i) => (i === existing ? { ...i, quantity: i.quantity + quantity } : i));
        return [line, ...current];
      });
      addToast(`${product.title} added to your cart`);
      setIsCartOpen(true);
    },
    [setItems, addToast]
  );

  const updateQuantity = useCallback(
    (key, delta) =>
      setItems((current) =>
        current.map((i) => (lineKey(i) === key ? { ...i, quantity: i.quantity + delta } : i)).filter((i) => i.quantity > 0)
      ),
    [setItems]
  );

  const removeItem = useCallback((key) => setItems((current) => current.filter((i) => lineKey(i) !== key)), [setItems]);
  const clearCart = useCallback(() => setItems([]), [setItems]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= Number(freeShippingThreshold) ? 0 : Number(flatShipping);

  return (
    <CartContext.Provider
      value={{ items, isCartOpen, setIsCartOpen, addItem, updateQuantity, removeItem, clearCart, subtotal, shipping, total: subtotal + shipping, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}
