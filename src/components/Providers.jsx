"use client";

import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { SettingsProvider } from "../context/SettingsContext";
import { ProductProvider } from "../context/ProductContext";
import { CartProvider } from "../context/CartContext";

export default function Providers({ initialProducts, children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <SettingsProvider>
          <ProductProvider initialProducts={initialProducts}>
            <CartProvider>{children}</CartProvider>
          </ProductProvider>
        </SettingsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
