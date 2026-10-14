import { Suspense } from "react";
import MenuView from "../../components/product/MenuView";

export const metadata = {
  title: "Our Menu",
  description: "Cookies, cupcakes, doughnuts, pastries and cakes, baked fresh every morning.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-32 text-center text-muted">Loading the menu…</div>}>
      <MenuView />
    </Suspense>
  );
}
