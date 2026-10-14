"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import DemoBadge from "../ui/DemoBadge";

// The admin dashboard has its own shell, so the storefront header, cart and footer are skipped there.
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin"))
    return (
      <>
        {children}
        <DemoBadge />
      </>
    );

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <DemoBadge />
    </>
  );
}
