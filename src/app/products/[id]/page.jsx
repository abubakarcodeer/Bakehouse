import { getActiveProducts, getProductById } from "../../../lib/server/products";
import ProductDetail from "../../../components/product/ProductDetail";
import ProductFallback from "../../../components/product/ProductFallback";

export async function generateMetadata(props) {
  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: { title: product.title, description: product.description, images: product.image ? [{ url: product.image }] : [] },
  };
}

// Pre-generate active products at build time; new ones render on demand.
export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage(props) {
  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) return <ProductFallback id={id} />;
  return <ProductDetail initialProduct={product} />;
}
